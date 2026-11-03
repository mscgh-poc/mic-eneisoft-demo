'use strict';

const config = require('../config');

// -- Cache en memoria --
let cache = null;
let cacheTimestamp = 0;

/**
 * Datos mock para cuando la API de GitHub no esta disponible
 * o estamos en desarrollo local.
 */
const MOCK_RUN = {
  demo: true,
  status: 'completed',
  conclusion: 'success',
  run_number: 42,
  head_sha: 'abc1234',
  head_branch: 'main',
  actor: 'demo-user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  duration_seconds: 95,
  html_url: '#',
  message: 'Modo demo: datos simulados (la API de GitHub no esta disponible)',
};

/**
 * Obtiene el ultimo workflow run del repositorio.
 * Usa la API publica de GitHub (no requiere token para repos publicos).
 * Cachea el resultado por 60 segundos.
 *
 * @param {string} repository - "owner/repo"
 * @returns {Promise<object>}
 */
async function getLatestRun(repository) {
  // Si el repo es local/dev, devolver mock directamente
  if (!repository || repository === 'local/dev') {
    return { ...MOCK_RUN, message: 'Modo desarrollo local' };
  }

  // Comprobar cache
  const now = Date.now();
  if (cache && (now - cacheTimestamp) < config.githubApiCacheTtl) {
    return cache;
  }

  try {
    const url = `https://api.github.com/repos/${repository}/actions/runs?per_page=1&status=completed`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'eneisoft-pipeline-demo',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`GitHub API respondio ${response.status}`);
    }

    const data = await response.json();

    if (!data.workflow_runs || data.workflow_runs.length === 0) {
      return { ...MOCK_RUN, message: 'No hay runs de workflow todavia' };
    }

    const run = data.workflow_runs[0];
    const createdAt = new Date(run.created_at);
    const updatedAt = new Date(run.updated_at);

    const result = {
      demo: false,
      status: run.status,
      conclusion: run.conclusion,
      run_number: run.run_number,
      head_sha: run.head_sha,
      short_sha: run.head_sha.substring(0, 7),
      head_branch: run.head_branch,
      actor: run.actor?.login || 'unknown',
      avatar_url: run.actor?.avatar_url || '',
      created_at: run.created_at,
      updated_at: run.updated_at,
      duration_seconds: Math.floor((updatedAt - createdAt) / 1000),
      html_url: run.html_url,
      name: run.name,
      message: run.display_title || run.head_commit?.message || 'Workflow run obtenido de GitHub Actions',
    };

    // Actualizar cache
    cache = result;
    cacheTimestamp = now;

    return result;
  } catch (err) {
    // Si hay cache expirada, usarla como fallback
    if (cache) {
      console.warn('[github] Usando cache expirada como fallback:', err.message);
      return { ...cache, stale: true };
    }
    // Sin cache, devolver mock
    console.warn('[github] Fallback a modo demo:', err.message);
    return { ...MOCK_RUN, message: `Modo demo: ${err.message}` };
  }
}

/** Limpia la cache (para tests). */
function clearCache() {
  cache = null;
  cacheTimestamp = 0;
}

module.exports = { getLatestRun, clearCache, MOCK_RUN };

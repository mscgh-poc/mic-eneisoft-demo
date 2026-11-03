(async function () {
  try {
    const res = await fetch('/api/info');
    const data = await res.json();

    document.getElementById('main-message').textContent = data.content.message;
    document.getElementById('subtitle').textContent = data.content.subtitle;

    document.getElementById('build-info').innerHTML = `
      <span class="label">Version:</span> <span class="value">${data.build.version}</span><br/>
      <span class="label">SHA:</span> <span class="value">${data.build.shortSha}</span><br/>
      <span class="label">Build:</span> <span class="value">#${data.build.buildNumber}</span>
    `;

    document.getElementById('runtime-info').innerHTML = `
      <span class="label">Env:</span> <span class="value">${data.runtime.environment}</span><br/>
      <span class="label">Node:</span> <span class="value">${data.runtime.nodeVersion}</span><br/>
      <span class="label">Uptime:</span> <span class="value">${data.runtime.uptime}s</span>
    `;

    document.getElementById('k8s-info').innerHTML = `
      <span class="label">Pod:</span> <span class="value">${data.kubernetes.pod}</span><br/>
      <span class="label">Node:</span> <span class="value">${data.kubernetes.node}</span><br/>
      <span class="label">NS:</span> <span class="value">${data.kubernetes.namespace}</span>
    `;
  } catch (e) {
    document.getElementById('main-message').textContent = 'Error cargando info';
  }

  try {
    const res = await fetch('/api/pipeline/latest');
    const data = await res.json();
    if (!data.fallback) {
      const statusClass = data.conclusion === 'success' ? 'status-success' : 'status-failure';
      document.getElementById('pipeline-info').innerHTML = `
        <span class="label">Status:</span> <span class="${statusClass}">${data.conclusion}</span><br/>
        <span class="label">Branch:</span> <span class="value">${data.branch}</span><br/>
        <span class="label">Run:</span> <span class="value">#${data.run_number}</span>
      `;
    } else {
      document.getElementById('pipeline-info').textContent = 'Sin datos del pipeline';
    }
  } catch (e) {
    document.getElementById('pipeline-info').textContent = 'No disponible';
  }
})();

(async function () {
  'use strict';

  // Cargar mensaje dinamico del backend
  try {
    const res = await fetch('/api/info');
    const data = await res.json();

    document.getElementById('main-message').textContent = data.content.message;
    document.getElementById('subtitle').textContent = data.content.subtitle;

    document.getElementById('build-info').innerHTML = [
      `<span class="lbl">Version:</span> <span class="val">${data.build.version}</span>`,
      `<span class="lbl">SHA:</span> <span class="val">${data.build.shortSha}</span>`,
      `<span class="lbl">Build:</span> <span class="val">#${data.build.buildNumber}</span>`,
    ].join('<br/>');

    document.getElementById('runtime-info').innerHTML = [
      `<span class="lbl">Env:</span> <span class="val">${data.runtime.environment}</span>`,
      `<span class="lbl">Node:</span> <span class="val">${data.runtime.nodeVersion}</span>`,
      `<span class="lbl">Uptime:</span> <span class="val">${data.runtime.uptime}s</span>`,
    ].join('<br/>');

    document.getElementById('k8s-info').innerHTML = [
      `<span class="lbl">Pod:</span> <span class="val">${data.kubernetes.pod}</span>`,
      `<span class="lbl">Node:</span> <span class="val">${data.kubernetes.node}</span>`,
      `<span class="lbl">NS:</span> <span class="val">${data.kubernetes.namespace}</span>`,
    ].join('<br/>');

  } catch (e) {
    document.getElementById('main-message').textContent = 'Bienvenido Developers';
  }
})();

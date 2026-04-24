(function () {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    app.initialized().then(function (client) {
      client.events.on('app.activated', function () {
        document.getElementById('btnFetch').addEventListener('fwClick', function () {
          fetchData(client);
        });
      });
    }).catch(function (err) {
      console.error('App init failed:', err);
    });
  }

  function fetchData(client) {
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = '<fw-spinner size="small"></fw-spinner>';

    client.request
      .invoke('fetchOAuthData', {})
      .then(function (result) {
        resultEl.innerHTML = '';
        const msg = document.createElement('fw-inline-message');
        msg.setAttribute('type', result.success ? 'success' : 'error');
        msg.textContent = result.success ? JSON.stringify(result.data) : result.error;
        resultEl.appendChild(msg);
      })
      .catch(function (error) {
        resultEl.innerHTML = '';
        const msg = document.createElement('fw-inline-message');
        msg.setAttribute('type', 'error');
        msg.textContent = error.message;
        resultEl.appendChild(msg);
      });
  }
})();

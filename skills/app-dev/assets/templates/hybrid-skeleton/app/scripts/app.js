(function () {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    app.initialized().then(function (client) {
      document.getElementById('btnFetch').addEventListener('fwClick', function () {
        invokeServer(client);
      });
    }).catch(function (err) {
      console.error('App init failed:', err);
    });
  }

  function invokeServer(client) {
    const resultEl = document.getElementById('result');
    resultEl.textContent = 'Loading…';

    client.request
      .invoke('fetchExternalData', { param1: 'demo' })
      .then(function (data) {
        resultEl.textContent = data.success ? data.data : data.message || 'Error';
      })
      .catch(function (err) {
        resultEl.textContent = err.message || 'Request failed';
      });
  }
})();

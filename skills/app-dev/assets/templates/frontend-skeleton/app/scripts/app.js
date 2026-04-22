(function () {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    app.initialized().then(function (client) {
      document.getElementById('btnHello').addEventListener('fwClick', function () {
        client.interface.trigger('showNotify', {
          type: 'success',
          message: 'App is running.'
        });
      });
    }).catch(function (err) {
      console.error('App init failed:', err);
    });
  }
})();

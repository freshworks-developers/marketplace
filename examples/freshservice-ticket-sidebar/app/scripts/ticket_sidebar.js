(function () {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    app.initialized().then(function (client) {
      document.getElementById('btnPing').addEventListener('fwClick', function () {
        client.interface.trigger('showNotify', {
          type: 'success',
          message: 'Freshservice sidebar app is running.'
        });
      });
    }).catch(function (err) {
      console.error('App init failed:', err);
    });
  }
})();

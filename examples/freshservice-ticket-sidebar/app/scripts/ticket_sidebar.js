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
      const el = document.querySelector('fw-inline-message.intro');
      if (el) {
        el.setAttribute('type', 'error');
        el.textContent = 'App could not start. Open the browser console for technical details.';
      }
      console.error('App init failed:', err);
    });
  }
})();

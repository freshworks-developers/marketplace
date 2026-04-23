(function () {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    app.initialized().then(function (client) {
      var out = document.getElementById('ctxOut');

      document.getElementById('btnPing').addEventListener('fwClick', function () {
        client.interface.trigger('showNotify', {
          type: 'success',
          message: 'Freshservice full page app is running.'
        });
      });

      document.getElementById('btnContext').addEventListener('fwClick', async function () {
        try {
          var ctx = await client.instance.context();
          out.textContent = JSON.stringify(ctx, null, 2);
        } catch (err) {
          out.textContent = 'Error: ' + (err && err.message ? err.message : String(err));
          console.error('instance.context failed:', err);
        }
      });

      document.getElementById('btnResize').addEventListener('fwClick', function () {
        try {
          client.instance.resize({ height: '480px' });
          client.interface.trigger('showNotify', {
            type: 'success',
            message: 'resize({ height: "480px" }) applied (platform max 700px).'
          });
        } catch (err) {
          console.error('instance.resize failed:', err);
          client.interface.trigger('showNotify', {
            type: 'error',
            message: 'Resize failed — see console.'
          });
        }
      });
    }).catch(function (err) {
      console.error('App init failed:', err);
    });
  }
})();

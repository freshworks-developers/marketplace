document.addEventListener('DOMContentLoaded', function() {
  app.initialized().then(function(client) {
    console.log('App initialized');

    const btn = document.getElementById('testBtn');
    btn.addEventListener('click', function() {
      client.interface.trigger('showNotify', {
        type: 'success',
        message: 'Test app working!'
      });
    });
  });
});

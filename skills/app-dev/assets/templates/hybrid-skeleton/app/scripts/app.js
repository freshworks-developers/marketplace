(async function() {
  const client = await app.initialized();
  
  client.events.on('app.activated', () => {
    document.getElementById('btnFetch').addEventListener('fwClick', async () => {
      await fetchData(client);
    });
  });
  
  async function fetchData(client) {
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = '<fw-spinner size="small"></fw-spinner>';
    
    try {
      const result = await client.request.invoke('fetchExternalData', {
        param1: 'value1'
      });
      
      resultEl.innerHTML = '';
      const msg = document.createElement('fw-inline-message');
      msg.setAttribute('type', result.success ? 'success' : 'error');
      msg.textContent = result.success ? JSON.stringify(result.data) : result.error;
      resultEl.appendChild(msg);
    } catch (error) {
      resultEl.innerHTML = '';
      const msg = document.createElement('fw-inline-message');
      msg.setAttribute('type', 'error');
      msg.textContent = error.message;
      resultEl.appendChild(msg);
    }
  }
})();

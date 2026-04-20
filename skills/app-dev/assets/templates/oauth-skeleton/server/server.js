exports = {
  onAppInstallHandler: function() {
    console.info('onAppInstallHandler invoked');
    renderData();
  },
  onAppUninstallHandler: function() {
    console.info('onAppUninstallHandler invoked');
    renderData();
  },
  fetchOAuthData: async function() {
    try {
      const response = await $request.invokeTemplate('getOAuthResource', {
        context: {}
      });

      renderData(null, { success: true, data: response.response });
    } catch (error) {
      console.error('OAuth API Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};

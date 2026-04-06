exports = {
  fetchOAuthData: async function(args) {
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

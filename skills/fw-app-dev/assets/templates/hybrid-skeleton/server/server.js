exports = {
  fetchExternalData: async function(args) {
    const query = args.param1 || 'ping';

    try {
      const response = await $request.invokeTemplate('externalApiCall', {
        context: {},
        body: JSON.stringify({ query: query })
      });

      renderData(null, { success: true, data: response.response });
    } catch (error) {
      console.error('API Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};

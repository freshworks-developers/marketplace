exports = {
  fetchExternalData: async function(args) {
    const { param1 } = args;
    
    try {
      const response = await $request.invokeTemplate('externalApiCall', {
        context: {
          api_key: args.iparams.api_key
        },
        body: JSON.stringify({ query: param1 })
      });
      
      return { success: true, data: response.response };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message };
    }
  }
};

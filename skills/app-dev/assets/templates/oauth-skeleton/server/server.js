exports = {
  fetchOAuthData: async function(args) {
    try {
      const response = await $request.invokeTemplate('getOAuthResource', {
        context: {}
      });
      
      return { success: true, data: response.response };
    } catch (error) {
      console.error('OAuth API Error:', error);
      return { success: false, error: error.message };
    }
  }
};

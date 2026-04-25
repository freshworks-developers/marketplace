/**
 * AI Actions - Server Methods
 * 
 * CRITICAL RULES:
 * 1. Function name MUST match actions.json key exactly (case-sensitive)
 * 2. Parameters MUST be flat (no nested objects/arrays in actions.json)
 * 3. Construct nested structures HERE, not in actions.json
 * 4. Use renderData(null, data) for success
 * 5. Use renderData({ status, message }) for errors
 * 6. Use $request.invokeTemplate() for external API calls
 * 7. Keep complexity low (max 7) - extract helpers if needed
 */

exports = {
  /**
   * Action Handler
   * 
   * Pattern: Validate → Call API → Return
   * 
   * @param {Object} args - Flat parameters from actions.json
   */
  actionName: async function(args) {
    // Validate required parameters
    if (!args.param1) {
      return renderData({
        status: 400,
        message: 'Missing required parameter: param1'
      });
    }

    // Extract flat parameters
    const { param1, param2 } = args;

    // Build request body (construct nested if API requires it)
    const requestBody = {
      data: {
        param1: param1,
        param2: param2 || ''
      }
    };

    try {
      // Call external API
      const response = await $request.invokeTemplate('requestTemplateName', {
        context: {},
        body: JSON.stringify(requestBody)
      });

      // Parse and return response
      const parsedResponse = JSON.parse(response.response);

      return renderData(null, {
        data: {
          response: parsedResponse
        }
      });

    } catch (error) {
      console.error('Error in actionName:', error);

      return renderData({
        status: error.status || 500,
        message: error.message || 'Action failed'
      });
    }
  }
};

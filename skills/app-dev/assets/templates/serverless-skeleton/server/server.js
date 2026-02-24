exports = {
  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.
  onTicketCreateHandler: function(args) {
    console.log('Hello ' + args['data']['requester']['name']);
  },
  onAppInstallHandler: function(args) {
    console.info('onAppInstallHandler invoked with following data: \n', args);
    renderData();
  },
  onAppUninstallHandler: function(args) {
    console.log('onAppUninstalHandler invoked with following data: \n', args);
    renderData();
  }

};

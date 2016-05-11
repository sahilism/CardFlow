ApiV1 = new Restivus({
  version: 'v1',
  useDefaultAuth: false,
  prettyJson: true,
  enableCors: true,
  defaultHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, x-user-id,x-auth-token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  }
});
ApiV1.addRoute('webhook/:id/:cardId', { authRequired: false }, {
  post: function() {
    var params = this.urlParams;
    console.log(params);
    return params;
  },
  get: function() {
    var params = this.urlParams;
    console.log(params);
    return params;
  }
})
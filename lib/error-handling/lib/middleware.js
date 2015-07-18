module.exports = {
  notFound: function (req, res, next) {
    /*jshint unused:false*/
    res.sendStatus(404);
  },
  serverError: function (err, req, res, next) {
    console.log(err.stack);
    /*jshint unused:false*/
    if (err.httpCode && (err.message || err.param)) {
      res.status(err.httpCode).send({
        type: err.httpCode < 500 ? err.name : 'ApiError',
        message: err.message || undefined, // if undefined, key won't be returned
        param: err.param || undefined
      });
    } else if (err.httpCode) {
      res.sendStatus(err.httpCode);
    } else {
      res.sendStatus(500);
    }
  }
};

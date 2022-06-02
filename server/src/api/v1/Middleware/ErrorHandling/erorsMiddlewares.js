function logErrorMiddleware(err, req, res, next) {
 console.log(err);
  next(err);
}

function returnError(err, req, res, next) {
  res.status(err.statusCode || 500).send(err.message);
}
module.exports = {
  logErrorMiddleware,
  returnError,
};
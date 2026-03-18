module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.status = 'fail';
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
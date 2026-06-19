export const errorHandler = (err, req, res, next) => {
  // Always log the full stack trace or message internally for debugging
  console.error(`[Error Handler] ${err.stack || err.message || err}`);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Under production environment, sanitize generic internal server errors (500) to protect database paths / system secrets
  let clientMessage = err.message || 'Internal Server Error';
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    clientMessage = 'An unexpected internal server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage
  });
};

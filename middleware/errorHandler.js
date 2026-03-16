/**
 * Global Error Handling Middleware
 */

// 404 — Not Found
export function notFoundHandler(req, res, next) {
  res.status(404).render('errors/404', {
    title: '404 — Page Not Found',
  });
}

// Global error handler — catches all errors thrown in the app
// eslint-disable-next-line no-unused-vars
export function globalErrorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.status || 500;

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again later.'
    : err.message;

  res.status(statusCode).render('errors/500', {
    title: 'Server Error',
    message,
  });
}

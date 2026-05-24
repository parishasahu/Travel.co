// Why: Every async controller needs try/catch or the error swallows silently.
// This wrapper catches errors and passes them to Express's error middleware
// so you never forget a try/catch again.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
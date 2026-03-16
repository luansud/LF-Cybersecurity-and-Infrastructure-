/**
 * Authentication & Authorization Middleware
 */

// Check if user is logged in
export function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash('error', 'You must be logged in to access this page.');
  res.redirect('/login');
}

// Check if user is admin
export function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'You do not have permission to access this page.');
  res.redirect('/');
}

// Check if user is a company client
export function isCompany(req, res, next) {
  if (req.session.user && (req.session.user.role === 'company' || req.session.user.role === 'admin')) {
    return next();
  }
  req.flash('error', 'You do not have permission to access this page.');
  res.redirect('/');
}

// Check if user is NOT logged in (for login/register pages)
export function isGuest(req, res, next) {
  if (!req.session.user) {
    return next();
  }
  // Redirect logged-in users to their appropriate dashboard
  const role = req.session.user.role;
  if (role === 'admin') return res.redirect('/admin');
  if (role === 'company') return res.redirect('/company/dashboard');
  return res.redirect('/dashboard');
}

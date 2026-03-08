// Admin middleware for role-based access

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // In a real app, check is_admin flag from database
  // For now, we'll validate from token or database
  if (req.user.isAdmin || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = exports;

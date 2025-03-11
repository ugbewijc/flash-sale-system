export function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ 
        success: false,
        errors: ['Unauthorized'] 
    });
};

export function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ 
        success: false,
        errors: ['Forbidden'],
     });
};

export function redirectIfAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
         return res.redirect('/api/admin/dashboard');
    }
    if (req.isAuthenticated()) {
        return res.redirect('/api/dashboard');
    }
    next();
}
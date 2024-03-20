const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login'); // Unauthorized
};

const isAdmin = (req, res, next) => {
    const user = req.session.user;
    // Check if the user is an admin
    if (user && user.role === 'admin') {
        return next();
    }

    // If not an admin, send a 403 Forbidden status
    res.sendStatus(403);
};

module.exports = { isAuthenticated, isAdmin };
class LogoutController {
    logout(req, res, next) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error logging out');
            } else {
                res.redirect('/'); // Redirect to the home page or login page
            }
        });
    }
}

module.exports = new LogoutController();

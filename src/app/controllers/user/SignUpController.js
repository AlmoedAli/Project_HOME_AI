
const user = require('../../models/user');
class SignUpController {
    signup(req, res, next) {
        res.render('user/signup',{layout: 'auth', isfalse: "none"})
    }
    async signup_check(req, res, next) {
        const finduser = (await user.findOne({ username: req.body.username}));
        if(finduser==null)
        {   
            const newaccount = await user.create({
				cardID: req.body.cardID,
				name: req.body.fullname,
				password: req.body.password,
				username: req.body.username,
				isadmin: false,
			});
            res.redirect('/login')
        }
        else{
            res.render('user/signup',{layout: 'auth', isfalse: "block"})
        }
    }
}

module.exports = new SignUpController();

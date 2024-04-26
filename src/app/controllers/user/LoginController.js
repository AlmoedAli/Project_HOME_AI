
const user = require('../../models/user');

class LoginController {
    login(req, res, next) {
        res.render('user/login',{layout: 'auth', isfalse: "none"})
    }

    async login_check(req, res, next) {
        // console.log(req.body.username)
        // console.log(req.body.password)
        const finduser = (await user.findOne({password: req.body.password, username: req.body.username}));
        // console.log(finduser);
        if(finduser!=null)
        {   if(!finduser.isadmin){
                req.session.user = user;
                req.session.user.role = 'user';
                res.redirect('/')
            }
            else{

            }
            
        }
        else{
            res.render('user/login',{layout: 'auth', isfalse: "block"})
        }
        
    }
}

module.exports = new LoginController();

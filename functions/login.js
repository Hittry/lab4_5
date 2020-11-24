const passport = require('./auth')
function login(req,res,next){
    passport.authenticate('local',
        function(err, user) {
            if (err){
                next(err);
            }
            req.logIn(user, function(err) {
                if (err) {
                    next(new Error("Incorrect username or password"));
                    res.redirect('/login')
                    return;
                }
                if (user.name === 'admin') {
                    res.redirect('/adminMenu');
                }
                else {
                    res.redirect('/menu')
                }

            });
        }
    )(req, res, next);

}

function logout(req,res,next){
    req.logout();
    res.redirect('/')
}

module.exports.login = login
module.exports.logout = logout

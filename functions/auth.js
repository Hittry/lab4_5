
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const fullFunction = require('./generalFunc')

passport.use('local', new LocalStrategy({}, (username, password,done)=>{
    fullFunction.findName(username)
        .then( user => {
                if (!user || !bcrypt.compareSync(password, user.password)) return done(null, false);
                return done(null, user);
            }
        )
        .catch(err => {return done(err);})
}));

passport.use('registration', new LocalStrategy({}, (username, password, done)=>{

    fullFunction.findName(username)
        .then(ifFound=>{
            if (ifFound){
                return done(null, false, new Error('User with that name already exist'));
            }
            else {
                fullFunction.createUser(username, password)
                    .then(user => {
                        return done(null, user);
                    })
                    .catch(err => {console.log(err); done(null, false, new Error('error'));})
            }
        })
        .catch(err => {console.log(err); return done(null, false, new Error('error'));})
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(function(id,done){
    fullFunction.findId(id)
        .then(user=>{
            return done(null, user);
        })
        .catch(err => {return done(err);})
});

module.exports = passport;
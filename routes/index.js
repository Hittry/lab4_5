const express = require('express');
const router = express.Router();
const login = require('../functions/login')
const fullFunc = require('../functions/generalFunc')

const pug = require('pug')


router.get('/', (req,res,next)=>{
  res.render("../views/index.pug", {
    action: '/'
  })
})

router.get('/reg', (req,res,next)=>{
  if (!req.isAuthenticated()){
    res.render('../views/reg.pug', {
      action: '/reg'
    });}
  else res.render('../views/error.pug')
});

const passport= require('../functions/auth')
router.post('/reg', passport.authenticate('registration', {
  successRedirect: '/menu',
  failureRedirect: '/reg'
}));

router.get('/login', (req,res,next)=>{
  if (!req.isAuthenticated()){
    res.render('../views/login.pug', {
      action: '/login'
    });}
  else res.render('../views/error.pug')
});
router.post('/login', (req,res,next)=>{
  login.login(req,res,next);
});


router.get('/menu', CheckAuth, (req,res,next)=>{
  res.render("../views/menu.pug");
})

router.get('/adminMenu', CheckAuth, (req,res,next)=>{
    res.render("../views/adminMenu.pug");
})

router.get('/find', CheckAuth, (req,res)=>
    fullFunc.AllUsers({raw:true})
        .then(users=> {
          let na = "";
          let ik ="";
          let ps ="";
          let cr = "";
          let up = "";
          for (let i = 0; i < Object.keys(users).length; i++){
            na+= users[i].name + ' ';
            ik+= users[i].id+ ' ';
            ps+= users[i].password+ ' ';
            cr+= users[i].createdAt+ ' ';
            up+= users[i].updatedAt+ ' ';
          }
          na = na.split(' ');
          ik = ik.split(' ');
          ps = ps.split(' ');
          cr = cr.split(' ');
          up = up.split(' ');
          res.render('../views/datatable.pug', {
            //data: users,
            nam: na,
            ip: ik,
            pss: ps,
            cr: cr,
            upd: up
            });
            })
);

router.get('/logout', (req,res,next)=>{
  login.logout(req,res,next)
})

///////////Lab5//////////
router.get('/findName', CheckAuth, (req,res,next)=>{
    fullFunc.findName(req.user.name)
        .then(user =>{
                if (user)
                    res.json('Username: ' + user.name +
                        ' Password: ' + user.password)
            }
        )
        .catch(err=>{res.json('Error: ' + err.message);})
});

router.get('/chooseUser', CheckAuth, (req,res,next)=>{
    res.render("../views/chooseUser.pug");
})

router.get('/deleteUser', CheckAuth, (req,res,next)=>{
    let username = req.query.username
    fullFunc.findName(username)
        .then(user=>{
            if (user){
                fullFunc.deleteUser(username)
                    .then(user => {res.json(`User ${username} was successfully deleted`)})
                    .catch(err => {res.json('Error: ' + err.message)})
            }
            else res.json('We have not this user into the database');
        })
        .catch(err => {res.json('Error: ' + err.message)})
})

router.get('/ChooseUserForEdit', CheckAuth, (req,res,next)=>{
    res.render("../views/ChooseUserForEdit.pug");
})

router.get('/UserEditForStand', CheckAuth, (req,res,next)=>{
    res.render("../views/UserEditForStand.pug");
})

router.get('/userEdit', CheckAuth, (req, res,next)=>{
    let username = req.query.username;
    let password = req.query.password;
    if (password && username){
        fullFunc.editUser(username, password)
            .then(user => res.json('Editions successfully applied to ' + username))
            .catch(err => res.json('Error: ' + err.message))
    }
    else res.json("Sth wrong check your password and email")
})

router.get('/userEditStand', CheckAuth, (req, res,next)=>{
    let username = req.user.name;
    let password = req.query.password;
    if (password && username){
        fullFunc.editUser(username, password)
            .then(user => res.json('Editions successfully applied to ' + username))
            .catch(err => res.json('Error: ' + err.message))
    }
    else res.json("You need to set email and age in query")
})

router.get('*', function (req, res, next) {
  res.status(404).send("Not Found")
  next()
});

function CheckAuth(req,res,next){
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send("Not auth");
  next();
}

module.exports = router;
const db = require('./data').db
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt')

const User = require('../models/user')(db, Sequelize)

async function findName(username) {
    return await User.findOne({
        where: {
            name: username
        }
    });
}

async function AllUsers() {
    return await User.findAll();
}

async function findId(id){
    return await User.findOne({where: {id:id}});
}

async function createUser(username, password){
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    let user = User.build({
        name: username,
        password: hash,
    })
    return await user.save();
}

async function editUser(username, password){
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    findName(username)
        .then(user=>{
            user.password=hash;
            return user.save()
        })
}

async function deleteUser(username){
    findName(username)
        .then(user=>{
                user.destroy();
            }
        )
}

exports.AllUsers = AllUsers
exports.findName = findName
exports.createUser = createUser
exports.findId = findId
exports.editUser = editUser
exports.deleteUser = deleteUser

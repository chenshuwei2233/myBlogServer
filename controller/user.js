const exec = require('../db/mysql')

const getUserList = (username,page=0) => {
    let sql = `select * from users where 1=1 `
    if(username) {
        sql += `and username like '%${username}%' `
    }
    sql += `order by id `
    sql += `limit ${page},5;`
    return exec(sql)
}

const addUser = userData => {
    const username = userData.username
    const password = userData.password
    const sql = `insert into users (username,password) values ('${username}','${password}')`

    return exec(sql).then(addData => {
        return {
            id: addData.insertId
        }
    })
}

const delUser = id => {
    const sql = `delete from users where id='${id}';`
    return exec(sql).then(delData => {
        if(delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const userDetail = id => {
    const sql = `select * from users where id='${id}'`
    return exec(sql)
}

const updateUser = (id, userData) => {
    const username = userData.username
    const password = userData.password
    const sql = `update users set username='${username}',password='${password}' where id=${id}`
    return exec(sql).then(val => {
        if(val.affectedRows > 0) {
            return true
        }
        else {
            return false
        }
    })
}

const updateAvatar = (username,avatar) => {

    const sql = `update users set avatar='${avatar}' where username='${username}'`
    return exec(sql).then(val => {
        if(val.affectedRows > 0) {
            return true
        }
        else {
            return false
        }
    })
}

const Login = userData => {
    const username = userData.username
    const password = userData.password
    const sql = `select username,password  from users where username='${username}' and password='${password}'`
    return exec(sql).then(rows => {
        return rows[0] || '';
    })
}

const getAvatar = userData => {
    const userName = userData.name
    const sql = `select avatar from users where username='${userName}'`
    return exec(sql)
}

module.exports = {getUserList,addUser,delUser,userDetail,updateUser,Login,updateAvatar,getAvatar}
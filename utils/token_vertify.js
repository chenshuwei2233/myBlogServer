var jwt = require('jsonwebtoken')

var signkey = 'mes_qdhd_mobile_xhykjyxgs'

exports.setToken = function(username, password) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            name:username,
            password:password
        },signkey,{expiresIn: '0.5h'})
        resolve(token)
    })
}

exports.verToken = function(token) {
    return new Promise((resovle, reject) => {
        var info = jwt.verify(token.split(' ')[1],signkey)
        resovle(info)
    })
}


const env = process.env.NODE_ENV

let MYSQL_CONF 

if(env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'csw_my_blog'
    }
}

if(env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'csw_my_blog'
    }
}

module.exports = MYSQL_CONF
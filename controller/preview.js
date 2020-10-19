const exec = require('../db/mysql')

const getPreviewList = (title,pre=0,page=0) => {
    let sql = `select * from blogs where 1=1 `
    if(title) {
        sql += `and title like '%${title}%' `
    }
    if(pre==1) {
        sql += `and preview is not null `
    }
    sql += `order by id `
    sql += `limit ${page},5;`
    return exec(sql)
}

const delPreView = id => {
    const sql = `update blogs set preview=null  where id=${id};`
    return exec(sql).then(delData => {
        if(delData.affectedRows > 0) {
            return true
        }
        return false
    })
}
const updatePreView = (id, preview) => {

    const sql = `update blogs set preview='${preview}' where id='${id}'`
    return exec(sql).then(val => {
        if(val.affectedRows > 0) {
            return true
        }
        else {
            return false
        }
    })
}

const updateRotation = (id, userData) => {
    const rotation = userData.rotation
    const sql = `update blogs set rotation='${rotation}' where id=${id}`
    return exec(sql).then(val => {
        if(val.affectedRows > 0) {
            return true
        }
        else {
            return false
        }
    })
}

module.exports = { getPreviewList,delPreView,updatePreView,updateRotation }
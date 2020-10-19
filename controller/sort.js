const exec = require('../db/mysql')

const getSortList = (page = 0) => {
    let sql = `select * from sort where 1=1 `
    sql += `order by id `
    sql += `limit ${page},5;`
    return exec(sql)
}

const addSort = sortData => {
    const sort = sortData.sorts
    const sql = `insert into sort (sorts) values ('${sort}')`

    return exec(sql).then(addData => {
        return {
            id: addData.insertId
        }
    })
}

const delSort = id => {
    const sql = `delete from sort where id='${id}';`
    return exec(sql).then(delData => {
        if(delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const updateSort = (id, sortData) => {
    const sort = sortData.sorts
   
    const sql = `update sort set sorts='${sort}' where id=${id}`
    return exec(sql).then(val => {
        if(val.affectedRows > 0) {
            return true
        }
        else {
            return false
        }
    })
}
module.exports = { getSortList, addSort, delSort, updateSort }
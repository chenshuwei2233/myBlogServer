const exec = require('../db/mysql')

const getBlogList = (title,page=0) => {
    let sql = `select * from blogs where 1=1 `
    if(title) {
        sql += `and title like '%${title}%' `
    }
    sql += `order by id `
    if(page) {
        sql += `limit ${page},5;`
    }
    return exec(sql)
}

const addBlog = blogData => {
    const author = blogData.author
    const title = blogData.title
    const sort = blogData.sort
    const label = blogData.label
    const content = blogData.content
    const rotation = blogData.rotation
    const date = Date.now()
    const sql = `insert into blogs (author,title,sort,label,content,createDate,rotation) values ('${author}','${title}','${sort}'
    ,'${label}','${content}','${date}','${rotation}')`
    return exec(sql).then(addData => {
        return {
            id: addData.insertId
        }
    })
}
const blogDetail = id => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql)
}

const delBlog = id => {
    const sql = `delete from blogs where id='${id}';`
    return exec(sql).then(delData => {
        if(delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const updateBlog = (id, blogData) => {
    const author = blogData.author
    const title = blogData.title
    const sort = blogData.sort
    const label = blogData.label
    const content = blogData.content
    const date = Date.now()
    const sql = `update blogs set author='${author}',title='${title}',sort='${sort}',label='${label}',content='${content}',
    updateDate='${date}' where id=${id}`
    return exec(sql).then(val => {
        if(val.affectedRows > 0) {
            return true
        }
        else {
            return false
        }
    })
}

module.exports = {getBlogList,addBlog,blogDetail,delBlog,updateBlog}
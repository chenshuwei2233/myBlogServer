const exec = require('../db/mysql')

const getBlogList = (sort,page=0) => {
    let sql = `select * from blogs where 1=1 `
    if(sort) {
        sql += `and sort='${sort}' `
    }
    sql += `order by id `
    if(page) {
        sql += `limit ${page * 10},10;`
    }
    return exec(sql)
}

const getLabelBlogs = (label) => {
    let sql = `select * from blogs where label='${label}'`
    return exec(sql)
}

const getBlogDetail = id => {
    let sql = `select * from blogs where id='${id}'`
    return exec(sql)
}
//添加评论
const addComment = commentData => {    
    const title = commentData.title
    const name = commentData.name
    const content = commentData.content
    const date = Date.now()
    const avatarColor = commentData.avatarColor
    const sql = `insert into comment (title, name,content,createTime,avatarColor) values ('${title}','${name}'
    ,'${content}','${date}','${avatarColor}')`
    return exec(sql).then(addData => {
        return {
            id: addData.insertId
        }
    })
}
//获取评论
const getComment = title => {
    let sql = `select * from comment where title='${title}' order by id desc`
    return exec(sql)
}
//获取点赞数
const getPraise = id => {
    let sql = `select * from blogs where id='${id}'`
    return exec(sql)
}
//更新点赞数
const updatePraise = (id,commentData) => {
    let praise = commentData.praise
    let sql = `update blogs set praise='${praise}' where id='${id}';`
    return exec(sql)
}
//更新评论数 
const updateCommentNumber = (commentData) => {
    let title = commentData.title
    let commentNumber = commentData.commentNumber
    let sql = `update blogs set commentNumber='${commentNumber}' where title='${title}';`
    return exec(sql)
}
module.exports = { getBlogList,getLabelBlogs,getBlogDetail,addComment,
    getComment,getPraise,updatePraise,updateCommentNumber }

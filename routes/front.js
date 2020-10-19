var express = require('express');
var router = express.Router();

const { getBlogList,getLabelBlogs,getBlogDetail,
  addComment,getComment,getPraise,updatePraise,
  updateCommentNumber }  = require('../controller/front')

const { SuccessModel, ErrorModel} = require('../model/res_model')

//获取博客列表
router.get('/list', function(req, res, next) {
    let sort = req.query.sort || ''
    let page = req.query.page
    const result = getBlogList(sort,page)
    if(req.data) {
      console.log(req.data)
      return result.then(data => {
        res.json(new SuccessModel(data),)
      })
    } else {
      return res.json({
        msg: 'token验证失败',
        errno: -1
      })
    }
  });

router.get('/labelBlogs',function(req, res, next) {
  let label = req.query.label
  const result = getLabelBlogs(label)
  if(req.data) {
    return result.then(data => {
      res.json(new SuccessModel(data),)
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})

router.get('/blogDetail', function(req, res, next) {
  let id = req.query.id
  const result = getBlogDetail(id)
  if(req.data) {
    return result.then(data => {
      res.json(new SuccessModel(data))
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})

//添加评论
router.post('/addComment', (req, res, next) => {
  const result = addComment(req.body)
  if(req.data) {
    return result.then(data => {
      return res.json(new SuccessModel(data))
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})

//获取评论 
router.get('/blogComment', function(req, res, next) {
  let title = req.query.title
  const result = getComment(title)
  if(req.data) {
    return result.then(data => {
      res.json(new SuccessModel(data))
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})
//获取点赞数 
router.get('/blogPraise', function(req, res, next) {
  let id = req.query.id
  const result = getPraise(id)
  if(req.data) {
    return result.then(data => {
      res.json(new SuccessModel(data))
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})
//更新点赞数
router.post('/updatePraise', (req, res, next) => {
  const result =  updatePraise(req.query.id, req.body)
  if(req.data) {
    result.then(val => {
      if(val) {
        res.json(new SuccessModel())
        return 
      } 
      res.json(new ErrorModel('更新数据失败!'))
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})
//更新评论数 
router.post('/updateCommentNumber', (req, res, next) => {
  const result =  updateCommentNumber(req.body)
  if(req.data) {
    result.then(val => {
      if(val) {
        res.json(new SuccessModel())
        return 
      } 
      res.json(new ErrorModel('更新数据失败!'))
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})
module.exports = router
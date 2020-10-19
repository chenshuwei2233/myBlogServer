var express = require('express');
var router = express.Router();
const { getBlogList,
        addBlog,
        blogDetail,
        delBlog,
        updateBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel} = require('../model/res_model')
const formidate = require('formidable')
const fs = require('fs')

//获取博客列表
router.get('/list', function(req, res, next) {
  let title = req.query.title || ''
  let page = req.query.page
  const result = getBlogList(title,page)
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
//富文本编辑器上传图片
router.post('/editor', (req, res, next) => {
  var form = new formidate.IncomingForm();
  //设置文件上传地址
  form.uploadDir = './public/editor/'
  //执行回调函数的时候，表单已经全部接收完毕
  form.parse(req, function(err, fields, files) {
    var oldPath = files.myFileName.path;
    var extname = files.myFileName.name;
    var newPath = './public/editor/' + extname
    fs.rename(oldPath, newPath, function(err) {
      if(err) {
        res.send({errno: 1,data: []})
      }
      var myPath = newPath.replace('./public',"//localhost:3000")
      res.send({errno: 0,data: [myPath]})
    })
  })
})

//创建博客
router.post('/addBlog', (req, res, next) => {
  const result = addBlog(req.body)
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
//获取博客详情
router.get('/detail', (req, res, next) => {
  const result = blogDetail(req.query.id)
  if(req.data) {
    result.then(data => {
      res.json(new SuccessModel(data))
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})

//删除博客
router.post('/delBlog', (req, res, next) => {
  const result = delBlog(req.query.id)
  if(req.data) {
    result.then(val => {
      if(val) {
        res.json(new SuccessModel())
      } else {
        res.json(new ErrorModel('删除博客失败'))
      }
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})
//更新博客
router.post('/update', (req, res, next) => {
  const result =  updateBlog(req.query.id, req.body)
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

module.exports = router;

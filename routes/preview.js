var express = require('express');
var router = express.Router();

const { getPreviewList,delPreView,updatePreView,updateRotation }  = require('../controller/preview')
const { SuccessModel, ErrorModel} = require('../model/res_model')

const formiable = require('formidable')
var path = require('path');
var fs = require('fs')

router.get('/list', function(req, res, next) {
    let title = req.query.title || ''
    let pre = req.query.pre
    let page = req.query.page
    const result = getPreviewList(title,pre,page)
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

  router.post('/delPreView', (req, res, next) => {
    const result = delPreView(req.query.id)
    if(req.data) {
      result.then(val => {
        if(val) {
          res.json(new SuccessModel())
        } else {
          res.json(new ErrorModel('删除预览图失败'))
        }
      })
    } else {
      return res.json({
        msg: 'token验证失败',
        errno: -1
      })
    }
  })

  router.post('/upload', (req, res, next) => {
    let form = new formiable.IncomingForm()
    form.uploadDir = path.join(__dirname,'../public/preview')//设置静态资源路径
    form.keepExtensions = true //使用源文件的扩展名
    form.parse(req, (err,fields,files) => {
      if(err) return res.json(err)
      let extName = ''//文件后缀
      switch(files.file.type) {//这一步的目的是设置文件后缀
        case 'image/jepg':
          extName = 'jpg'
          break
        case 'image/png':
          extName = 'png'
          break
        case 'image/gif':
          extName = 'gif'
          break
        default:
          extName = 'jpg'
          break
      }
      let avatarName = `${fields.id}s_preview.${extName}`//根据传过来的用户名以及上面的后缀名拼接出新的头像
    
      let newPath = form.uploadDir + '/' + avatarName//获取头像的路径
      fs.rename(files.file.path,newPath,(err)=> {
        //这一步是重命名，files.file.path是原始文件路径,newPath是上方拼接出来的
        //同时，重命名还可以避免同一用户上传多个文件，占用服务资源
        if(err) return res.json({data: {code: 400, msg:'操作失败'}})
        const result = updatePreView(fields.id,`//192.168.0.108:3000/preview/${avatarName}`)
        result.then(val => {
          if(val) {
            res.json({
              data:{
                code: 200,
                msg: '操作成功',
                fileUrl: `/preview/${avatarName}`
              }
            })
            return
          } res.json({
            data:{
              code: 500,
              msg: 'something error'
            }
          })
  
        })
      })
    })
  })

  router.post('/update', (req, res, next) => {
    const result =  updateRotation(req.query.id, req.body)
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
var express = require('express');
var router = express.Router();
var settoken = require('../utils/token_vertify')
const { SuccessModel, ErrorModel } = require('../model/res_model')
const { getUserList,
        addUser,
        delUser,
        userDetail,
        updateUser,
        Login,
        updateAvatar,
        getAvatar
} = require('../controller/user')
const formiable = require('formidable')
var path = require('path');
var fs = require('fs')

/* GET users listing. */
router.get('/list', function(req, res, next) {
  let username = req.query.username || ''
  let page = req.query.page
  const result = getUserList(username,page)
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

router.post('/addUser', (req, res, next) => {
  const result = addUser(req.body)
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
router.post('/delUser', (req, res, next) => {
  const result = delUser(req.query.id)
  if(req.data) {
    result.then(val => {
      if(val) {
        res.json(new SuccessModel())
      } else {
        res.json(new ErrorModel('删除用户失败'))
      }
    })
  } else {
    return res.json({
      msg: 'token验证失败',
      errno: -1
    })
  }
})

router.get('/detail', (req, res, next) => {
  const result = userDetail(req.query.id)
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

router.post('/update', (req, res, next) => {
  const result =  updateUser(req.query.id, req.body)
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

router.post('/login', (req, res, next) => {
  
  const result = Login(req.body)
  const username = req.body.username
  const password = req.body.password
 
  result.then(val => {
    if(val.username) {
      settoken.setToken(username, password).then(data => {
        return res.json({token: data})
      })
    } else {
      return res.json(new ErrorModel())
    }
  })
})

router.get('/header', (req, res, next) => {
  getAvatar(req.data).then(row => {
    req.avatar = row[0].avatar
    console.log(req.avatar)
    if(req.data) {
      return res.json({
       username: req.data.name,
       avatar: req.avatar
      })
    } else {
      return res.json({
        msg: 'token验证失败',
        errno: -1
      })
    }
  })
  
})

router.post('/upload', (req, res, next) => {
  let form = new formiable.IncomingForm()
  form.uploadDir = path.join(__dirname,'../public/avatars')//设置静态资源路径
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
    let avatarName = `${fields.name}s_avatar.${extName}`//根据传过来的用户名以及上面的后缀名拼接出新的头像
  
    let newPath = form.uploadDir + '/' + avatarName//获取头像的路径
    fs.rename(files.file.path,newPath,(err)=> {
      //这一步是重命名，files.file.path是原始文件路径,newPath是上方拼接出来的
      //同时，重命名还可以避免同一用户上传多个文件，占用服务资源
      if(err) return res.json({data: {code: 400, msg:'操作失败'}})
      const result = updateAvatar(fields.name,`//localhost:3000/avatars/${avatarName}`)
      result.then(val => {
        if(val) {
          res.json({
            data:{
              code: 200,
              msg: '操作成功',
              fileUrl: `/avatars/${avatarName}`
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

module.exports = router;

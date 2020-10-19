var express = require('express');
var router = express.Router();

const { SuccessModel, ErrorModel } = require('../model/res_model')

const { getSortList,addSort,delSort,updateSort } = require('../controller/sort')

router.get('/list', function(req, res, next) {
    let page = req.query.page
    const result = getSortList(page)
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
  router.post('/addSort', (req, res, next) => {
    const result = addSort(req.body)
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

  router.post('/delSort', (req, res, next) => {
    const result = delSort(req.query.id)
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

  router.post('/update', (req, res, next) => {
    console.log(req.body)
    const result =  updateSort(req.query.id, req.body)
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
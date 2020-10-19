var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blog')
var sortRouter = require('./routes/sort')
var preViewRouter = require('./routes/preview')
var frontRouter = require('./routes/front')

var vertoken = require('./utils/token_vertify')
var expressJwt = require('express-jwt')

var app = express();

//解析token获取用户信息 
app.use(function(req, res, next) {
  var token = req.headers['authorization']
  if(token == undefined) {
    return next()
  }else {
    vertoken.verToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch(err => {
      return next()
    })
  }
})

//验证token 是否过期并规定哪些路由不用验证
app.use('/api',expressJwt({
  secret: 'mes_qdhd_mobile_xhykjyxgs',
  algorithms: ['HS256']
}).unless({
  path: ['/api/users/login']//除了这个地址，其他的URL都需要验证
}))
//当token失效时返回提示信息
app.use(function(err, req, res, next) {
  if(err.status == 401) {
    return res.status(401).send("token失效")
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/sorts',sortRouter);
app.use('/api/previews',preViewRouter);
app.use('/api/fronts',frontRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

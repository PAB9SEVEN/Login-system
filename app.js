var express=require('express');
var bodyParser=require('body-parser');
var expressValidator=require('express-validator');
var path=require('path');
var flash=require('connect-flash');
var session=require('express-session');
var exphs=require('express-handlebars');
var passport=require('passport');
var cookieParser=require('cookie-parser');
var bcrypt=require('bcryptjs');
var mongo=require('mongodb');
var mongoose=require('mongoose');

var LocalStrategy=require('passport-local').Strategy;
mongoose.connect('mongodb://localhost/passport');
var db=mongoose.connection;
//routing
var index=require('./routes/index');
var users=require('./routes/users');
var port=3000;

//
var app=express();
//var router=express.Router();



//engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','handlebars');
app.engine('handlebars',exphs({defaultLayout:'layout'}));
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//cookie parser
app.use(cookieParser());
//middle ware
//set static
app.use(express.static(path.join(__dirname,'public')));
app.use(session({ secret: 'secret' }));
//passport initialization
app.use(passport.initialize());
app.use(passport.session());
//express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
//express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//connect flash middleware
app.use(flash());

app.use(function(req,res,next){
    
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    
    next();
});
app.use('/',index);
app.use('/users',users);


app.listen(port,function(){
    console.log('server started');
    
})
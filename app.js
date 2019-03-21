const express = require('express')
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient: true,});
let db = mongoose.connection;

//Check connection
db.once('open',function() {
  console.log('Conneted to MongoDB');
});
//Check for db Errors
db.on('error',function(err){
  console.log(err);
});

const app = express();

const PORT = process.env.PORT || 3000;

//MORGAN Middleware
app.use(morgan('dev'));

//CORS Middleware
app.use(cors());

// Compression Middleware( compress all responses )
app.use(compression());

//Express Session Middleware
// app.use(session({
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true
// }));
app.use(session({ 
  secret: 'pnt dddd', 
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: true,
  saveUninitialized: true
}));
//set Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json());

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

    while (namespace.length) {
      formParam +='['+ namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//File Upload
app.use(fileUpload());

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Login
app.get('/login', function(req, res){
	res.render('login');
});

const user = require('./routes/user');
app.use('/user',user);
const api = require('./routes/api');
app.use('/api',api);
const api2 = require('./routes/api2');
app.use('/api2',api2);
const apiCrm = require('./routes/api-crm');
app.use('/api-crm',apiCrm);
//Authenticate Globally
app.use(function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/login');
});
 
//"start": "NODE_ENV=production node app.js",
const index = require('./routes/index');
const client = require('./routes/client');
const home = require('./routes/home');
const sale = require('./routes/sale');
const blog = require('./routes/blog');
const inquiry =  require('./routes/inquiry');
const vendor = require('./routes/vendor');
const settings = require('./routes/settings');
const products = require('./routes/products');
const repair = require('./routes/repair');
const cash = require('./routes/cash');
//const import_data = require('./routes/import');
const expenses = require('./routes/expenses');
//const pdf_file = require('./routes/pdf');


app.use('/',index);
app.use('/client',client);
app.use('/home',home);
app.use('/sale',sale);
app.use('/blog',blog);
app.use('/inquiry',inquiry);
app.use('/vendor',vendor);
app.use('/settings',settings);
app.use('/products',products);
app.use('/repair',repair);
app.use('/cash',cash);
//app.use('/import',import_data);
app.use('/expenses',expenses);
//app.use('/pdf',pdf_file);

//Start Server
app.listen(PORT, function(){
  console.log('Server started on port '+PORT+'....');
});

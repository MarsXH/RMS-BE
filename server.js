const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

const config = require('./src/config');

const port = process.env.PORT || 8899;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize()); // 使 passport 持久化，不只是session
app.use(passport.session());
app.use((req, res, next) => {
  req.passport = passport // 为了在中间件中可以调用到 passport
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method == 'OPTIONS') {
    return res.send(200);
  } else {
    next();
  }
});

const mongoHost  = `mongodb://${config.host}:${config.port || 27017}/${config.database}`
mongoose.Promise = global.Promise
mongoose.connect(mongoHost, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  config: {
    autoIndex: true,
  },
}).then(() => {
  console.log('connection established:', mongoHost)
}).catch(err => {
  console.error(err)
})

require('./src/common/passport-local')(passport);

// Route Section
require('./src/routes/authRouter')(app);
require('./src/routes/people')(app);
require('./src/routes/resource')(app);

app.listen(port, () => console.log(`Server running on PORT: ${port}`));
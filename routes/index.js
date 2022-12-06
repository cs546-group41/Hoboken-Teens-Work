const userRoute = require('./users');
const jobRoute = require('./jobs');
const loginRoute = require('./login');
const homepageRoute = require('./homepage');
const registerRoute = require('./register');
const logoutRoute = require('./logout');

const constructorMethod = (app) => {
  
  //server side check request
  app.use(function (req, res, next) {
    console.log(`${new Date().toUTCString()} ${req.method} ${req.originalUrl} Authenticate user: ${req.session.user!==undefined}`)
    next();
  })

  //routes
  app.use('/index', homepageRoute);
  app.use('/login', loginRoute);
  app.use('/user', userRoute);
  app.use('/job', jobRoute);
  app.use('/register', registerRoute);
  app.use('/logout', logoutRoute)

  //any differernt route will by redirect to index page
  app.use('*', (req, res) => {
    res.redirect("/index");
  });

};

module.exports = constructorMethod;

const userRoute = require('./users');
const jobRoute = require('./jobs');
const loginRoute = require('./login');
const homepageRoute = require('./homepage');
const registerRoute = require('./register');
const logoutRoute = require('./logout');
const path = require("path");

const constructorMethod = (app) => {
  
  //server side check request
  app.use(function (req, res, next) {
    var id = ""
    if (req.session.user){
      id = req.session.user.id
    }
    console.log(`${new Date().toUTCString()} ${req.method} ${req.originalUrl} user: ${id}`)
    next();
  })

  //routes
  app.use('/index', homepageRoute);
  app.use('/login', loginRoute);
  app.use('/user', userRoute);
  app.use('/job', jobRoute);
  app.use('/register', registerRoute);
  app.use('/logout', logoutRoute);
  
  app.use('/about', (req, res) =>{
    res.sendFile(path.resolve("static/About.html"))
  });

  //any differernt route will by redirect to index page
  app.use('*', (req, res) => {
    res.redirect("/index")
  });

};

module.exports = constructorMethod;

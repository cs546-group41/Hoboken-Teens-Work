const jobRoutes = require("./jobs");
const userRoutes = require("./users");
const path = require("path");

const constructorMethod = (app) => {
  // app.use("/jobs", jobRoutes);
  // app.use("/users", userRoutes);
  app.use("/", res.render("homepage", { title: "Homepage" }));
  app.use("*", res.sendFile(path.resolve("static/notfound.html")));
};

module.exports = constructorMethod;

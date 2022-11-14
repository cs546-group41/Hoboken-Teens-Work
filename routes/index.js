const postRoutes = require("./jobs");
const userRoutes = require("./users");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/jobs", postRoutes);
  app.use("/users", userRoutes);
  //   app.get("/about", (req, res) => {
  //     res.sendFile(path.resolve("static/about.html"));
  //   });

  app.use("*", (req, res) => {
    res.redirect("/jobs");
  });
};

module.exports = constructorMethod;

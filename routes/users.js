//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const validation = require("../validation");
router
  .route("/")
  .get(async (req, res) => {
    //
  })
  .post(async (req, res) => {
    try {
      const user = await req.body;
      console.log(user);
      user.firstName = validation.checkString(user.firstName);
      user.lastName = validation.checkString(user.lastName);
      validation.checkFirstName(user.firstName);
      validation.checkLastName(user.lastName);
      user.email = validation.checkString(user.email);
      validation.checkEmail(user.email);
      user.age = validation.checkAge(user.age);
      user.phoneNumber = validation.checkPhone(user.phoneNumber);
      user.hashedPassword = validation.checkPassword(user.hashedPassword);

      const result = await userData.createUser(
        user.firstName,
        user.lastName,
        user.email,
        user.age,
        user.phoneNumber,
        user.hashedPassword
      );
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  });

router
  .route("/:userId")
  .get(async (req, res) => {
    try {
      req.params.userId = validation.checkId(req.params.userId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const user = await userData.getUserById(req.params.userId);
      res.status(200).json(user);
    } catch (e) {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .put(async (req, res) => {
    let user = req.body;
    try {
      user.firstName = validation.checkString(user.firstName);
      user.lastName = validation.checkString(user.lastName);
      user.validation.checkFirstName(user.firstName);
      user.validation.checkLastName(user.lastName);
      user.email = validation.checkString(user.email);
      user.validation.checkEmail(user.email);
      user.age = validation.checkAge(user.age);
      user.phone = validation.checkPhone(user.phone);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      req.params.userId = validation.checkId(req.params.userId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      await userData.getUserById(req.params.userId);
    } catch (e) {
      return res.status(404).json({ error: "User not found" });
    }
    try {
      const updatedUser = await userData.editUser(
        user.firstName,
        user.lastName,
        user.email,
        user.age,
        user.phone
      );
      res.json(updatedUser);
    } catch (e) {
      res.status(400).send(e);
    }
  });

module.exports = router;

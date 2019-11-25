const express = require('express');
const router = express.Router();
const UserFakeModel = require('../models/UserFakeModel');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const checkAuthenticated = require('../middlewares/checkAuthenticated');

const passport = require("../passport-config");

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/users', (req, res) => {
  res.json(UserFakeModel);
});

router.post('/register', async (req, res) => {
  const user = { ...req.body, id: uuid() }
  try {
    const hashed = await bcrypt.hash(user.password, 10);
    user.password = hashed;
    UserFakeModel.push(user);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
})

router.post('/login', passport.authenticate('local', { successRedirect: "/", failureRedirect: "/login", failureFlash: true }));

router.get('/private-stuffs', checkAuthenticated, (req, res) => {
  res.send({ message: "You were deemed worthy to access this route Son!" });
});

module.exports = router;
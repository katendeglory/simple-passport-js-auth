const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const UserFakeModel = require("./models/UserFakeModel");

//function passed to passport.use()
//done is the verify callback, its value is flashed
//being a middleware, it has access to req.body, hence the username and the password
const authenticateUser = async (username, password, done) => {

  //Normally from mongo db
  const user = UserFakeModel.find(user => user.username === username);

  if (user == null) return done(null, false, { message: 'User does not exist!' });

  try {
    if (await bcrypt.compare(password, user.password)) return done(null, user);
    else return done(null, false, { message: 'Password Incorrect!' });
  } catch (error) {
    return done(error);
  }
}

//strategy configured
passport.use(new LocalStrategy(authenticateUser));

//serialize / deserialize 
passport.serializeUser((user, done) => {
  done(null, user.id);//Probably The user returned by the verify callback
});

passport.deserializeUser((id, done) => {
  const user = UserFakeModel.find(user => user.id === id);
  done(null, user);
});

module.exports = passport;
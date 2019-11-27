const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const UserFakeModel = require("./models/UserFakeModel");

//The verify callback
//Being a middleware, it has access to req.body
//req.body.username & req.body.password are passed to the verify callback 
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
  //This id will be stored as a cookie.
});

passport.deserializeUser((id, done) => {
  //The id from the cookie will be used to determine who the user by fetching him from the database
  //A user should be return. if everything goes well, then req.user != null & req.isAuthenticated() == true.
  const user = UserFakeModel.find(user => user.id === id);
  done(null, user);
});

module.exports = passport;
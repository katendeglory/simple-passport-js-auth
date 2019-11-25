//ENV VARIABLES
process.env.NODE_ENV !== 'production' && require('dotenv').config();

//MAIN IMPORTS
const express = require('express');
const app = express();
const flash = require('express-flash');
const session = require('express-session');

//VIEW ENGINE
app.set('view engine', 'ejs');

//PASSPORT-JS
const passport = require('./passport-config');

//MIDDLEWARES
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.get('/', (req, res) => res.render('index', { name: req.user ? req.user.name : 'Lena', isAuth: req.isAuthenticated() }));
app.use('/', require('./routes/users'));

//SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listenning on Port ${port}`));
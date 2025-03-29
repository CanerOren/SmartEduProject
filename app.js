// 9:58
import methodOverride from 'method-override';
import express from 'express';
import mongoose from 'mongoose';
import ejs from 'ejs';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';


import pageRoute from './routes/pageRoute.js';
import courseRoute from './routes/courseRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();

// Connect DB
mongoose.connect('mongodb://localhost/smartedu-db')
  .then(()=>{console.log('Succesfully connected MongoDB')})
  .catch((err)=>{console.log(`Connection error : ${err}`)});

//  Template Engine
app.set("view engine","ejs");

// Global Variable
global.userIN= null;

// Middlewares

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({mongoUrl:'mongodb://localhost/smartedu-db'})
}));
app.use(flash());
app.use((req,res,next)=>{
  res.locals.flashMessages= req.flash();
  next();
});
app.use(
  methodOverride('_method',{
    methods:['POST','GET']
  })
);


// Routes
app.use('*',(req,res,next)=>{
  userIN=req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/categories',categoryRoute);
app.use('/users',userRoute);
app.use('/courses',courseRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

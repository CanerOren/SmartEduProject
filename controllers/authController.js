import bcrypt from 'bcrypt';
import {validationResult } from 'express-validator';

import User from '../models/User.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';


const createUser = async (req,res)=>{
    try{
        const user = await User.create(req.body);
        req.flash('success','Account Created Succesfully');
        res.status(201).redirect('/login');
    }catch (error) {
        const errors = validationResult(req); 
        console.log(errors);
        console.log(errors.array()[0].msg); 
        for(let i=0 ; i< errors.array().length; i++){
            req.flash("error", `${errors.array()[i].msg}`);
        }
        

        return res.status(400).redirect('/register');
    };
};

const loginUser = async (req,res) =>{
    try{
        const { email, password } = req.body;

    // Kullanıcıyı veritabanında bul
    const user = await User.findOne({ email });

    if (!user) {
        req.flash("error","User is Not Exist!!!");
      return res.status(400).redirect('/login');
    }

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      req.flash("error","Your Password is Not Correct!");
      return res.status(400).redirect('/login');
    };

    
   // USER SESSION 
    req.session.userID= user._id;
    res.status(200).redirect('/users/dashboard');

    }catch(error){
        res.status(400).json({
            status:'fail',
            error: error.message
        });
    };
};

const logoutUser = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });
};

const getDashboardPage = async (req,res)=>{
    const user = await User.findOne({_id:req.session.userID}).populate('courses');
    const categories = await Category.find();
    const courses = await Course.find({user:req.session.userID})
    res.status(200).render('dashboard',{
        page_name:'dashboard',
        user,
        categories,
        courses
    });
};

export default {createUser,loginUser,logoutUser,getDashboardPage};
import Course from '../models/Course.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

const createCourse = async (req, res) => {
  try {
  const course = await Course.create({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    user:req.session.userID
  });
  
    req.flash('success',`${course.name} has been created successfully`);
    res.status(201).redirect('/courses' )
  } catch (error) {
    req.flash("error",`Something Happened!!`);
    return res.status(400).redirect('/courses');
  }
};

const getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;

    let filter = {};

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      }
    }

    if (query) {
       
    }

    const courses = await Course.find(filter)
      .sort('-createdAt')
      .populate('user');

    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
      categorySlug
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message
    });
  }
};


const getCourse = async (req,res)=>{
  try{
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({slug: req.params.slug}).populate('user');
    const categories = await Category.find();

    res.status(200).render('course-single',{
      course,
      page_name: 'courses',
      categories,
      user
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error
    });
  }
};

const enrollCourse= async(req,res) =>{
  try{
    const user= await User.findById(req.session.userID);

    user.courses.push(({_id:req.body.course_id}));
    await user.save();
    res.status(200).redirect('/users/dashboard');
  }catch(error){
    res.status(400).json({
      status:'fail',
      error: error.message
    });
  };
};

const releaseCourse = async (req,res)=>{
  try{
    const user = await User.findById(req.session.userID);
    user.courses.pull({_id:req.body.course_id});
    await user.save();

    res.status(200).redirect('/users/dashboard');
  }catch (error){ 
    res.status(400).json({
      status:'fail',
      error: error.message
    });
  };
};

const deleteCourse = async (req,res) =>{
  try{
    
    const course=await Course.findOneAndDelete({slug:req.params.slug});
    const usersToUpdate= await User.find({courses:course._id});
    for (let user of usersToUpdate){
      user.courses.pull(course._id);
      await user.save();
    };
    req.flash("error",`${course.name} has been deleted successfully`);

    res.status(200).redirect('/users/dashboard');
  }catch (error){
     console.error(`Delte course error: ${error}`);
     res.status(500).send('An error occurred while dleting the course');
  };
};

const updateCourse = async (req,res) =>{
  try{
    const course= await Course.findOne({slug:req.params.slug});
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.slug = req.body.slug;

    course.save();

    res.status(200).redirect('/users/dashboard');
  }catch (error){
    res.status(400).json({
      status:'fail',
      error:error.message
    });
  };
};

export default {createCourse,getAllCourses,getCourse,enrollCourse,releaseCourse,deleteCourse,updateCourse};
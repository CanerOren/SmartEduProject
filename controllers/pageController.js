import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const getIndexPage =(req, res) => {
  console.log(req.session.userID);
  res.status(200).render('index', {
    page_name: 'index',
  });
};

const getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

const getRegisterPage= (req,res)=>{
  res.status(200).render('register',{
    page_name: 'register'
  });
};

const getLoginPage = (req,res)=>{
  res.status(200).render('login',{
    page_name: 'login'
  });
};

const getContactPage = (req,res) =>{
  res.status(200).render('contact',{
    page_name:'contact'
  });
};

const sendEmail = async (req, res) => {
  try {
    const user = process.env.EMAIL_USER;
    const password = process.env.EMAIL_PASSWORD;

    const outputMessage = `
      <h1>Email Details </h1>
      <ul>
        <li>Name: ${req.body.name} </li>
        <li>Email: ${req.body.email} </li>
      </ul>
      <h1>Message</h1>
      <p>${req.body.message}</p>
    `;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: password,
      },
    });

    await transporter.sendMail({
      from: `"Smart EDU Contact Form" <${user}>`,
      to: "rondurod@hotmail.com",
      subject: "Smart EDU Contact Form New Message ✔",
      html: outputMessage,
    });

    console.log("Message sent successfully");

    req.flash('success','We Received your message succesfully');

    res.status(200).redirect('/contact');
  } catch (error) {
    req.flash("error",`Something happened!!`);
    console.error("Email sending failed:", error);
    res.status(500).redirect('/contact');
  }
};

export default {getAboutPage, getIndexPage,getRegisterPage,getLoginPage,getContactPage,sendEmail};

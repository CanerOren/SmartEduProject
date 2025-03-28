import Category from '../models/Category.js';

const createCategory = async (req,res)=>{
    try{
        const category = await Category.create(req.body);

        res.status(201).redirect('/users/dashboard');
    }catch(error){
        res.status(400).json({
            status: 'fail',
            error: error.message
        });
    };
};

const deleteCategory = async (req,res)=>{
    try{
        await Category.findByIdAndDelete(req.params.id);

        res.status(200).redirect('/users/dashboard');
    }catch (error){
        res.status(400).json({
            status:'fail',
            error:error.message
        });
    };
};

export default {createCategory,deleteCategory};
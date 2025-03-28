import mongoose from 'mongoose';
import bcrypt, { hash } from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type:String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        require:true
    },
    role:{
        type: String,
        enum: ["student","teacher","admin"],
        default: "student"
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }]
});

UserSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.hash(user.password, 10, (error,hash) =>{
        if(error){
            return next(error);
        };
        user.password=hash;
        next();
    });
});

const User = mongoose.model('User',UserSchema);

export default User;

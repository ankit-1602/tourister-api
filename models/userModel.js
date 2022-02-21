const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const validator=require('validator')

const userSchema=new Schema({
    name:{
        type:String,
        require:[true,'Please tell us your name']
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    password:{
        type:String,
        required:true,
        minLength:[8,'Password should be atleast 8 characters'],
        select : false
    },
    passwordConfirm:{
        type:String,
        required:true,
        // This only works on save
        validate:{
            validator:function(el){
                return el===this.password;
            },
            message:'Passwords are not the same'
        }
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    photo:{
        type:String,
        //required:true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    } 
})

userSchema.pre('save',async function(next){
    //I
    if(!this.isModified('password'))
        return next();

    //Hash the password at cost of 10
    this.password=await bcrypt.hash(this.password,12)

    //Delete Confirm Password
    this.passwordConfirm=undefined
    next()
})

userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew)
        return next()

    this.passwordChangedAt=Date.now()-1000
    next()
})

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    next()
})

userSchema.methods.correctPassword=async function(
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(52).toString('hex')
    this.passwordResetToken=crypto
                            .createHash('sha256')
                            .update(resetToken)
                            .digest('hex')

    this.passwordResetExpires=Date.now() + 10*60*1000;
    return resetToken;
}

const User=mongoose.model('User',userSchema);
module.exports=User;
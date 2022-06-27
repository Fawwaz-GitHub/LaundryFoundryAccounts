const userModel = require("../Models/userModel");
const jwt = require('jsonwebtoken')

const maxAge = 14*24*60*60;

const createToken = (id) => {
    return jwt.sign({id},"final project",{
        expiresIn: maxAge,
    })
}

const handleErrors = (err) => {
    let errors = {name: "",mobile: "",address: "",email:"", password:""};

    if (err.message === "incorrect Email")
        errors.email = " That email is not registered";

    if (err.message === "incorrect password")
        errors.email = " That password is incorrect";

    if(err.code===11000) {
        errors.email = "Email is already registered"
        return errors;
    }

    if(err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

module.exports.signup = async ( req, res, next ) => {
    try{
        const {name,mobile,address,email,password} = req.body;
        const user = await userModel.create({name,mobile,address,email,password});
        const token  = createToken(user._id);

        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        });
        res.status(201).json({user: user._id, created: true});
    }catch (err){
        console.log(err)
        const errors = handleErrors(err);
        res.json({ errors, created: false})
    }
};

module.exports.login = async (req, res, next) => {
    try{
        const {email,password} = req.body;
        const user = await userModel.login(email,password);
        const token  = createToken(user._id);

        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        });
        res.status(200).json({user: user._id, created: true});
    }catch (err){
        console.log(err)
        const errors = handleErrors(err);
        res.json({ errors, created: false})
    }
};
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User , {Role}from "../models/user.model"

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
};

export const registerUser = async (userData) => {

    const {name, email, password, role} = userData;

    const exist = await User.fondOne({email});
    if(exist) {
        const error = new Error("User Already Exist");
        error.statuscode = 400;
        throw error;
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const user =  await User.create({
        name,
        email,
        password : hasedPassword,
        role: role || Role.CUSTOMER,
        isApproved : (role || Role.CUSTOMER) !==Role.ORGANIZER
    });

     return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id.toString()),
    };

}

export const loginUser = async(email, password) => {
    const user = await User.findOne({email});

    if(!user) {
        const error = new Error("user not registered");
        error.statusCode = 400;
        throw error; 
    }

    if(user && (await bcrypt.compare(password, User.password))) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            token: generateToken(user._id.toString()),
        };
    }else {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
}

export const getMe = async (userId) => {
    const user = await User.findById(userId).select(-password);
    if (!user) throw new Error("User not found");
    return user;
}


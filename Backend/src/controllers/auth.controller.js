import * as authServices from "../services/auth.services.js";

export const register = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await authServices.registerUser(userData);
        res.status(201).json({success: true, data: user})
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next ) => {
    try {
        const {email, password} = req.body;
        const user = await authServices.loginUser(email, password);
        res.status(200).json({success: true, data: user})
    } catch (error) {
        next(error);
    }
} 

export const getMe = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        next(error)
    }
}
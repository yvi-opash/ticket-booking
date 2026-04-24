import jwt from "jsonwebtoken";
import User, { Role } from "../models/user.model.js";

// Protect routes - verify JWT and attach user to request
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Not authorized to access this route"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "User not found"
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: "Not authorized to access this route"
        });
    }
};

// Grant access to specific roles
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "User not authenticated"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        
        // For organizer, check if they are approved by admin
        if (req.user.role === Role.ORGANIZER && !req.user.isApproved) {
            return res.status(403).json({
                success: false,
                error: "Organizer account is pending admin approval"
            });
        }

        next();
    };
};

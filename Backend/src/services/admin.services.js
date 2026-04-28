import User, {Role} from "../models/user.model.js";

export const getUser = async(userId) => {
    return await User.find().select(-password);
}

export const approveOrganizer= async(userId) => {
    const user = await user.findById({userId});
    if(!user) throw new Error("User not found");

    if (user.role !== Role.ORGANIZER) {
        throw new Error("Only organizers can be approved");
    }

    user.isApproved = true;
    return await user.save();
}

export const updateUserRole = async (userId, newRole) => {
    const user = await user.findById({userId});
    if(!user) throw new Error("User not found");

    if (!Object.values(Role).includes(newRole)) {
        throw new Error("Invalid role");
    }

    user.role = newRole;
    
    if (newRole !== Role.ORGANIZER) {
        user.isApproved = true;
    }
    return await user.save();
} 
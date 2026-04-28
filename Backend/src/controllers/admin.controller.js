import * as adminServices from "../services/admin.services.js";


export const getUser = async (req, res, next) => {
    try {
        const users = await adminServices.getUser();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

export const approveOrganizer = async(req, res,next) => {
    try {
        const {id} = req.params;
        const user = await adminServices.approveOrganizer(id);
        res.status(200).json({success: true, data: user, message: "Organizer approved successfully"});
    } catch (error) {
        next(error)
    }
}

export const updateUserRole = async(req, res, next) => {
    try {
        const {id} = req.params;
        const {role} = req.body;

        if(!role) {
            return res.status(400).json({ success: false, message: "Role is required" });
        }

        const user = await adminService.updateUserRole(id, role);
        res.status(200).json({ success: true, data: user, message: "User role updated successfully" });

        
    } catch (error) {
        next(error)
    }
}
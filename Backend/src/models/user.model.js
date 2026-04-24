import mongoose from "mongoose"

export const Role = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    ORGANIZER: "organizer"
}

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.CUSTOMER,
        required: true
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== Role.ORGANIZER; 
    },
}
}, {timestamps: true}
)

const User = mongoose.model("User", userSchema);

export default User
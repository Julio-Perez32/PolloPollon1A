import adminModel from "../models/admin.js";

const adminController = {}

adminController.getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find();
        res.json(admins)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

adminController.updateAdmin = async (req, res) => {
    try {
        const { name, email, password, isVerified, loginAttempts, timeOut } = req.body;
        await adminModel.findByIdAndUpdate(req.params.id, {
            name, email, password, isVerified, loginAttempts, timeOut
        }, { new: true })

        res.json({ message: "Admin updated" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

adminController.deleteAdmin = async (req, res) => {
    try {
        await adminModel.findByIdAndDelete(req.params.id)
        res.json({ message: "Admin deleted" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export default adminController

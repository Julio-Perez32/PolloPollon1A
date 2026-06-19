import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import adminModel from "../models/admin.js";
import { config } from "../../config.js";

const loginAdminController = {}

loginAdminController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userfound = await adminModel.findOne({ email });
        if (!userfound) return res.status(404).json({ message: "Admin not found" });

        if (userfound.timeOut && userfound.timeOut > Date.now()) {
            return res.status(403).json({ message: "Cuenta Bloqueada" });
        }

        const isMatch = await bcrypt.compare(password, userfound.password);

        if (!isMatch) {
            userfound.loginAttempts = (userfound.loginAttempts || 0) + 1;

            if (userfound.loginAttempts >= 3) {
                userfound.timeOut = Date.now() + 15 * 60 * 1000;
                userfound.loginAttempts = 0;
                await userfound.save();
                return res.status(403).json({ message: "Cuenta Bloqueada por 15 minutos" });
            }

            await userfound.save();
            return res.status(401).json({ message: "Contraseña Incorrecta" });
        }

        // success
        userfound.loginAttempts = 0;
        userfound.timeOut = null;
        await userfound.save();

        const token = jsonwebtoken.sign({ id: userfound._id, userType: "admin" }, config.JWT.secret, { expiresIn: "7d" });

        res.cookie("authCookie", token);
        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.log("error: " + error);
        res.status(500).json({ message: "Error al iniciar sesión, internal server error" });
    }
}

export default loginAdminController

import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import adminModel from "../models/admin.js";
import { config } from "../../config.js";

const registerAdminsController = {}

registerAdminsController.register = async (req, res) => {
    //#1- Solicitar los datos a registrar
    const { name, email, password, isVerified, loginAttempts, timeOut } = req.body;

    try {
        //Verificar si el admin ya existe
        const existAdmin = await adminModel.findOne({ email });
        if (existAdmin) {
            return res.status(400).json({ message: "Admin already exist" });
        }

        //Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        //Generamos un código aleatorio
        const verificationCode = crypto.randomBytes(3).toString("hex");

        //Generamos un token para guardar el código aleatorio junto a la info de registro
        const tokenCode = jsonwebtoken.sign(
            {
                email,
                verificationCode,
                name,
                password: passwordHash,
                isVerified,
                loginAttempts,
                timeOut,
            },
            config.JWT.secret,
            { expiresIn: "15m" },
        );

        // Guardamos el token en las cookies, con una duración de 15 minutos
        res.cookie("verificationToken", tokenCode, { maxAge: 15 * 60 * 1000 });

        //Enviar ese código por correo
        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            },
        });

        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Verificación de cuenta admin",
            text:
                "Para verificar tu cuenta admin, utiliza este código: " +
                verificationCode +
                " expira en 15 minutos",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error " + error);
                return res.status(500).json({ message: "error" });
            }
            res.status(200).json({ message: "Admin registered, verify your email" });
        });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "internal server error" });
    }
}

// Verify code endpoint
//VERIFICAR EL CÓDIGO QUE LE ACABAMOS DE ENVIAR
registerAdminsController.verifyCode = async (req, res) => {
    try {
        //#1 Solicitamos el código que escribieron en el frontend
        const { verificationCodeRequest } = req.body;

        //#2- Obtener el token de las cookies
        const token = req.cookies.verificationToken;

        console.log(token);

        //#3- Ver que código está en el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const {
            email,
            verificationCode: storedCode,
            name,
            password: passwordHash,
            isVerified,
            loginAttempts,
            timeOut,
        } = decoded;

        //Paso final: comparar el código que el usuario escribe
        //con el código que está en el token
        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: "Invalid code" });
        }

        //Guardamos todo en la base de datos
        const newAdmin = new adminModel({
            name,
            email,
            password: passwordHash,
            isVerified: true,
            loginAttempts,
            timeOut,
        });

        //Guardamos todo en la base de datos
        await newAdmin.save();

        //si el código está bien, entonces, colocamos el campo
        //"isVerified" en true
        const admin = await adminModel.findOne({ email });
        admin.isVerified = true;
        await admin.save();
        //
        res.clearCookie("verificationToken");

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default registerAdminsController

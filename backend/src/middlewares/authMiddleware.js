import jsonwebtoken from "jsonwebtoken";
import {config} from "../../config.js";


export const validateAuthCookie = (allowedTypes =[]) =>{
    return (req, res, next) =>{
        try{

            //#1 extraer el token que esta en la cookie ya que en esta esta el tipo de usuario que inicio sesion
            
            const {authCookie} = req.cookies;
            if(!authCookie){
                return res.status(403).json({ message: "no hay cookie, la autorizacion es requerida" });
            }

            const decoded = jsonwebtoken.verify(authCookie, config.JWT.secret);
            if(!allowedTypes.includes(decoded.userType)){
                return res.status(403).json({ message: "El tipo de usuario no tiene permisos para acceder a este recurso" });
            }

            next()

        } catch (error) {
            res.status(401).json({ message: "Invalid or missing authentication cookie" });  
        }
    }
}
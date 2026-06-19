/*
    Campos:
        name:
        email:
        password:
        isVerified:
        loginAttempts:
        timeOut:
*/

import { Schema, model } from "mongoose"

const adminSchema = new Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        
    },
    isVerified: {
        type: Boolean,
        
    },
    loginAttempts: {
        type: Number,
        
    },
    timeOut: {
        type: Date,
        
    }
}, {
    timestamps: true,
    strict: false
})

//"Admins" es el nombre de la colección que se guarda en la DB
export default model("Admins", adminSchema)

import fetch from "node-fetch"; // node-fetch is a library that allows us to make HTTP requests in Node.js, similar to the fetch API in the browser. We use it to interact with the Wompi API.
import { config } from "../../config.js";

//Functions array
const wompiController = {}

//Generate token
wompiController.generateToken = async (req, res) => {
    try {
        //#1- Make the request to Wompi API
        const response = await fetch("https://id.wompi.sv/connect/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams ({
                grant_type: config.wompi.grant_type,
                audience: config.wompi.audience,
                client_id: config.wompi.client_id,
                client_secret: config.wompi.client_secret
            })
        })

        if(!response.ok){
            const error = await response.text();
            return res.status(500).json({error})
        }

        const data = await response.json();
        return res.status(200).json(data)
    } catch (error) {
        console.log("error: " + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

//Test transaction (This will be used the whole year)
wompiController.paymentTest = async (req, res) => {
    try {
        //#1- Request the data
        const {token, formData} = req.body;

        //#2- Make the request to Wompi API
        const response = await fetch("https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })

        // #3- Response control
        if(!response.ok){
            const error = await response.text()
            return res.status(500).json({error})
        }

        const data = await response.json()
        return res.status(200).json(data)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

//Real transaction
wompiController.payment3DS = async (req, res) => {
    try {
        //#1- Request the data and the token
        const {token, formData} = req.body; //formData is the data from the form, and token is the access token we generated in the previous function.

        //#2- Make the request to Wompi API
        const response = await fetch("https://api.wompi.sv/TransaccionCompra/3Ds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })

        // #3- Response control
        if(!response){
            const error = await response.text()
            return res.status(500).json({error})
        }

        if(!response.ok){
            const error = await response.text()
            return res.status(500).json({error})
        }


        const data = await response.json()
        return res.status(200).json(data)
    } catch (error) {
        console.log("error: " + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default wompiController;
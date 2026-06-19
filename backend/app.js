//Importar express
import express from 'express';
import productsRouter from './src/routes/products.js';
import branchesRouter from './src/routes/branches.js';
import employeesRouter from './src/routes/employees.js';
import reviewsRouter from './src/routes/reviews.js';
import customerRouter from './src/routes/customers.js';
import registerCustomerRouter from "./src/routes/registerCustomer.js";
import loginCustomerRouter from "./src/routes/loginCustomer.js";
import logoutRouter from './src/routes/logout.js';
import recoveryPasswordRouter from './src/routes/recoveryPassword.js';
import limiter from './src/middlewares/limiter.js';
import banners from "./src/routes/banners.js"
import cartRouter from "./src/routes/cart.js"
import deliveryDriversRoutes from './src/routes/deliveryDrivers.js';
import wompiRoutes from "./src/routes/wompi.js"
import { validateAuthCookie } from './src/middlewares/authMiddleware.js';
import adminsRouter from './src/routes/admins.js';
import loginAdminRouter from './src/routes/loginAdmin.js';
import registerAdminRouter from './src/routes/registerAdmin.js';
import cors from 'cors'; 
//Importante 
import cookieParser from 'cookie-parser';

//Ejecutar express
const app = express();

//Use cors is for allow cross-origin requests, which is necessary when the frontend and backend are hosted on different domains or ports. It enables the frontend to make API calls to the backend without being blocked by the browser's same-origin policy.
app.use(cors({
    origin: ['http://localhost:5173', 'https://localhost:5174'], // This is the URL of the frontend application that is allowed to access the backend API.
    //Allows the sending of cookies and other credentials in cross-origin requests, which is necessary for authentication and session management.
    credentials: true
}));
 
//Cookie parser allows us to parse the cookies sent by the client in the request headers and make them easily accessible in our route handlers. This is particularly useful for handling authentication tokens, session IDs, and other data stored in cookies. By using cookie-parser, we can read and manipulate cookies in our Express application, enabling features like user authentication and personalized experiences based on cookie data.
app.use(cookieParser());

//Acepta JSON 
app.use(express.json());

app.use(limiter);

//Creamos los endpoints
app.use("/api/products", productsRouter)
app.use("/api/branches", branchesRouter)
app.use("/api/employees", validateAuthCookie(['admin']), employeesRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/customers", customerRouter)
app.use("/api/registerCustomers", registerCustomerRouter)
app.use("/api/loginCustomer", loginCustomerRouter)
app.use("/api/logout", logoutRouter)
app.use("/api/recoveryPassword", recoveryPasswordRouter)
app.use("/api/banners", banners)
app.use("/api/cart", cartRouter)
app.use("/api/wompi", wompiRoutes)
app.use("/api/deliveryDrivers", deliveryDriversRoutes)
app.use("/api/admins", validateAuthCookie(['admin']), adminsRouter)
app.use("/api/loginAdmin", loginAdminRouter)
app.use("/api/registerAdmin", registerAdminRouter)

export default app;
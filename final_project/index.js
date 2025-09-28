const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
    // Check if the session has an access token
    const token = req.session.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No access token found in session" });
    }

    // Verify the JWT token
    jwt.verify(token, "your_jwt_secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized: Invalid access token" });
        }

        // Token is valid, you can attach user info to request if needed
        req.user = decoded;
        next(); // allow the request to continue
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

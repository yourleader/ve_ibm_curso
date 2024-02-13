const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next) {
//Write the authenication mechanism here

const authHeader = req.headers.authorization;
{

    if (authHeader) {

const token = authHeader.split(' ')[1];



jwt.verify(token,'tu_clave_secreta', (err,user) => {

    
    if (err){
        
        console.log(err);
        return res.sendStatus(403);
        
    }
    
    req.user = user;
    console.log("User ID is " + user.id);
    next();
    
});

}else{
     
    res.sendStatus(401)
}

};
});
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));


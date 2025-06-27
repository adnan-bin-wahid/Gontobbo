const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;


const server = http.createServer(app);
console.log("jwt token", process.env.JWT_SECRET); 

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});


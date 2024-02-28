const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');

//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

const limiter=rateLimit({windowMs:10*60*1000,max:500});

//Route files
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
const appointments=require('./routes/appointments');

const app=express();

//Body parser
app.use(express.json());

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

//Mount routers
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);


//Cookie Parser
app.use(cookieParser());

const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,console.log('Server running in ',process.env.NODE_ENV,' mode on port ',PORT));

//Handle Unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);

//Close server and exit program
    server.close(()=>process.exit(1));
});
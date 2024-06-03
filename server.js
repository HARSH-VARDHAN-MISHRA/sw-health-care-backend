const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {connectDb} = require('./configure/db');
dotenv.config()
// const { route } = require('./routes/allRoutes');
// const router = require('./routes/allRoutes');
const categoryRouter = require('./routes/allRoutes');

connectDb()
const port = process.env.PORT

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set(express.static("public"))
app.use("/api/v1",categoryRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to SW Health care")
})

app.listen(port,()=>{
    console.log("Our Server is running on port",port);
})


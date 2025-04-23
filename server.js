const express = require('express');
const db = require('./db');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
var session = require('express-session')

const cors = require('cors');

const app = express();
app.use(express.json());
// app.use('/api/json-only', express.json());
app.use(cors({
    origin : "http://localhost:5501",
    credentials : true
}));

app.use(session({
    secret: 'test1234',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly : true,
        secure : false,
        maxAge : 1000 * 60 * 60
    }
  }))

app.use("/product", productRouter);
app.use("/user", userRouter);

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(3000, ()=>{
    console.log("서버 실행 중");
})
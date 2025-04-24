const express = require('express');
const db = require('./db');
const boardRouter = require('./routes/board');

var session = require('express-session')

const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
    origin : "http://localhost:5501",
    credentials : true
}));

app.use("/board", boardRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(3000, ()=>{
    console.log("서버 실행 중");
})
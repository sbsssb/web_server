const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.get("/board/list", async (req, res) => {
    try {
        let [list] = await db.query("SELECT * FROM BOARD");
        console.log(list);
        res.json({
            message : "result",
            list : list
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

app.get("/board/view", async (req, res) => {
    let {BOARDNO} = req.query;
    try { 
        
        let [list] = await db.query("SELECT * FROM BOARD WHERE BOARDNO = " + BOARDNO);
        console.log("SELECT * FROM BOARD WHERE BOARDNO = " + BOARDNO);
        res.json({
            message : "result",
            info : list[0]
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

// app.get("/board/delete", async (req, res) => {
//     let {BOARDNO} = req.query;
//     try { 
//         console.log("DELETE FROM BOARD WHERE BOARDNO = " + BOARDNO);
//         let result = await db.query("DELETE FROM BOARD WHERE BOARDNO = " + BOARDNO);
//         res.json({
//             message : "result",
//             result : result
//         });
//     } catch (error) {
//         console.log("에러 발생");
//         res.status(500).send("Server Error");
//     }
// })

app.get("/board/delete", async (req, res) => {
    let {BOARDNO} = req.query;
    try { 
        console.log("DELETE FROM BOARD WHERE BOARDNO = " + BOARDNO);
        await db.query("DELETE FROM BOARD WHERE BOARDNO = " + BOARDNO);
        res.json({
            message : "삭제되었습니다.",
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

app.listen(3000, ()=>{
    console.log("서버 실행 중");
})
const express = require('express');
const db = require('../db');
const router = express.Router();

router.get("/", async (req, res) => {
    let {menu} = req.query;  // ← 여기를 req.body → req.query 로 변경
    try {
        let sql = "";
        if(menu == "top") {
            sql = "SELECT * FROM tbl_board B INNER JOIN tbl_user U ON B.userId = U.userId WHERE CNT >= 20";
        } else {
            sql = "SELECT * FROM tbl_board B INNER JOIN tbl_user U ON B.userId = U.userId";
        }

        let [list] = await db.query(sql);
        res.json({
            message : "result",
            list : list,
        });

        // let sql = "SELECT * FROM tbl_board B INNER JOIN tbl_user U ON B.userId = U.userId";
        // let [list] = await db.query(sql);
        
        // res.json({
        //     message : "result",
        //     list : list,
        // });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.get("/:boardNo", async (req, res) => {
    let {boardNo} = req.params;
    try {
        let sql = "SELECT * FROM tbl_board B INNER JOIN tbl_user U ON B.userId = U.userId WHERE boardNo = ?";
        let [list] = await db.query(sql, [boardNo]);

        let query = "UPDATE TBL_BOARD SET cnt = cnt+1 WHERE boardNo = ?";
        await db.query(query, [boardNo]);
        
        res.json({
            message : "result",
            info : list[0],
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

// router.put("/:boardNo", async (req, res) => {
//     let {boardNo} = req.params;
//     try{
//         let query = "UPDATE TBL_BOARD SET cnt = cnt+1 WHERE boardNo = ?";
//         await db.query(query, [boardNo]);
        
//     }catch(err){
//         console.log("에러 발생!");
//         res.status(500).send("Server Error");
//     }
// })

router.delete("/:boardNo", async (req, res) => {
    let {boardNo} = req.params;
    try {
        let query = "DELETE FROM TBL_BOARD WHERE boardNo = ?"
        let result = await db.query(query, [boardNo]);
        res.json({
            message : "삭제되었습니다",
            result : result
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.put("/:boardNo", async (req, res) => {
    let {boardNo} = req.params;
    let {title, contents} = req.body;
    try {
        let query = "UPDATE TBL_BOARD SET "
                    + "title=?, contents=?, udatetime=NOW() "
                    + "WHERE boardNo = ?"
        await db.query(query, [title, contents, boardNo]);
        res.json({
            message : "수정되었습니다.",
        });
    } catch (error) {
        console.log("에러 발생", error);
        res.status(500).send("Server Error");
    }
})

router.post("/", async (req, res) => {
    let {title, contents} = req.body;
    try{
        let query = "INSERT INTO TBL_BOARD(title, contents, cnt, cdatetime, udatetime, userId) VALUES(?,?,0,NOW(),NOW(),'user001')";
        let [board] = await db.query(query, [title, contents]);
        res.json({
            message : "등록되었습니다.",
        });
    }catch(err){
        console.log("에러 발생!", err);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
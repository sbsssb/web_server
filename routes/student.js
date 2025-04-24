const express = require('express');
const db = require('../db');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let sql = "SELECT * FROM STUDENT";
        let [list] = await db.query(sql);
        
        res.json({
            message : "result",
            list : list,
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.get("/:stu_no", async (req, res) => {
    let {stu_no} = req.params;
    try {
        let sql = "SELECT * FROM STUDENT WHERE STU_NO = ?";
        let [list] = await db.query(sql, [stu_no]);
        
        res.json({
            message : "result",
            info : list[0],
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

module.exports = router;
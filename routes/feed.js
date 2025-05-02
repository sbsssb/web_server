const express = require('express');
const db = require('../db');
const authMiddleware = require('../auth');
const router = express.Router();

// 1. 패키지 추가
const multer = require('multer');

// 2. 저장 경로 및 파일명
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// api 호출
router.post('/upload', upload.array('file'), async (req, res) => {
    let {feedId} = req.body;
    const files = req.files;
    // const filename = req.file.filename; 
    // const destination = req.file.destination; 
    try{
        let results = [];
        for(let file of files){
            let filename = file.filename;
            let destination = file.destination;
            let query = "INSERT INTO TBL_FEED_IMG VALUES(NULL, ?, ?, ?)";
            let result = await db.query(query, [feedId, filename, destination]);
            results.push(result);
        }
        res.json({
            message : "result",
            result : results
        });
    } catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
});


// api
router.get("/", async (req, res) => {
    let { userId } = req.query;
    try{
        let sql = "SELECT * FROM TBL_FEED";
        let imgSql = "SELECT * FROM TBL_FEED F "
                    + "INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID ";
        if(userId) {
            sql += " WHERE USERID = '" + userId + "'";
            imgSql += " WHERE USERID = '" + userId + "'";
        }

        let [list] = await db.query(sql);
        let [imgList] = await db.query(imgSql);
        res.json({
            message : "result",
            list : list,
            imgList : imgList
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    try{
        let sql = "SELECT * FROM TBL_FEED WHERE ID = " + id;
        let [list] = await db.query(sql);
        res.json({
            message : "result",
            feed : list[0]
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    let { id } = req.params;
    try{
        let sql = "DELETE FROM TBL_FEED WHERE ID = " + id;
        let result = await db.query(sql);
        res.json({
            message : "result",
            result : result
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let { userId, content } = req.body;
    try{
        let sql = "UPDATE TBL_FEED SET USERID = ?, CONTENT = ? WHERE ID = ?";
        let result = await db.query(sql, [userId, content, id]);
        res.json({
            message : "result",
            result : result
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})


router.post("/", async (req, res) => {
    let { userId, content } = req.body;
    try{
        let sql = "INSERT INTO TBL_FEED VALUES(NULL, ?, ?, NOW())";
        let result = await db.query(sql, [userId, content]);
        res.json({
            message : "result",
            result : result[0]
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})


module.exports = router;
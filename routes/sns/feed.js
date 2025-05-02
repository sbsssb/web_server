const express = require('express');
const db = require('../../db');
const authMiddleware = require('../../auth');
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
        let thumbnail = "Y";
        for(let file of files){
            let filename = file.filename;
            let destination = file.destination;
            let query = "INSERT INTO TBL_FEED_IMG VALUES(NULL, ?, ?, ?, ?)";
            let result = await db.query(query, [feedId, filename, destination, thumbnail]);
            results.push(result);
            thumbnail = "N";
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

router.post("/", async (req, res) => {
    let { email, title, content } = req.body;
    try{
        let sql = "INSERT INTO TBL_FEED VALUES(NULL, ?, ?, ?, NOW())";
        let result = await db.query(sql, [email, title, content]);
        res.json({
            message : "result",
            result : result[0]
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.get("/", async (req, res) => {
    try{
        let sql = "SELECT * FROM TBL_FEED F "
                + "INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID "
                + "WHERE THUMBNAILYN = 'Y'";
        let [list] = await db.query(sql);
        res.json({
            message : "result",
            list : list
        });
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    try{
        let sql = "SELECT * FROM TBL_FEED WHERE ID = " + id;
        let imgSql = "SELECT * FROM TBL_FEED_IMG WHERE FEEDID = " + id;
        let [list] = await db.query(sql);
        let [imgList] = await db.query(imgSql);
        res.json({
            message : "result",
            feed : list[0],
            imgList : imgList
        });
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
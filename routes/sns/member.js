const express = require('express');
const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 1. 패키지 추가
const multer  = require('multer')

// 2. 저장 경로 및 파일명
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    let {email} = req.body;
    const filename = req.file.filename; 
    const destination = req.file.destination; 
    try{
        let query = "UPDATE TBL_MEMBER SET PROFILEIMG = ? WHERE EMAIL = ?";
        let result = await db.query(query, [destination+filename, email]);
        res.json({
            message : "result",
            result : result
        });
    } catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
});

const JWT_KEY = "show-me-the-money";
router.post("/", async (req, res) => {
    let {email, pwd} = req.body;
    try{
        let query = "SELECT email, userName, phone, pwd FROM TBL_MEMBER WHERE EMAIL = ?";
        let [user] = await db.query(query, [email]);
        let result = {};
        if(user.length > 0){
            let isMatch = await bcrypt.compare(pwd, user[0].pwd);
            if(isMatch){
                // 세션 값 저장
                let payload = {
                    sessionEmail : user[0].email,
                    sessionName : user[0].userName,
                    sessionPhone : user[0].phone
                }
                const token = jwt.sign(payload, JWT_KEY, {expiresIn : '1h'});
    
                result = {
                    message : "로그인 성공!",
                    success : true,
                    token : token
                }
            } else {
                result = {
                    message : "비밀번호 확인하셈"
                }
            }
            
        } else {
            result = {
                message : "아이디 확인하셈"
            }
        }
        res.json(result);
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.get("/:email", async (req, res) => {
    let { email } = req.params;
    try{
        let [list] = await db.query("SELECT * FROM TBL_MEMBER WHERE EMAIL = '" + email + "'");
        res.json({
            message : "result",
            info : list[0]
        });
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})


router.post("/join", async (req, res) => {
    let {email, pwd, userName, addr, phone, birth, intro} = req.body;
    try{
        let hashPwd = await bcrypt.hash(pwd, 10);
        let query = "INSERT INTO TBL_MEMBER VALUES(?,?,?,?,?,?,?,null,NOW(),NOW())";
        let [user] = await db.query(query, [email, hashPwd, userName, addr, phone, birth, intro]);
        res.json({})
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

module.exports = router;
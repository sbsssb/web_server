const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_KEY = "testtesttesttesttesttesttesttest"; // 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.
router.post("/", async (req, res) => {
    let {userId, pwd} = req.body;
    try{
        let query = "SELECT userId, pwd, userName, phone, status FROM TBL_USER WHERE USERID = ?";
        let [user] = await db.query(query, [userId]);
        let result = {};
        if(user.length > 0){
            let pwdResult = await bcrypt.compare(pwd, user[0].pwd);
            if(pwdResult) {
                let payload = {
                    userId : user[0].userId,
                    userName : user[0].userName,
                    userPhone : user[0].phone,
                    userStatus : user[0].status,
                }
                const token = jwt.sign(payload, JWT_KEY, {expiresIn : '1h'});
                console.log(req.session);
                result = {
                    message : "로그인 성공!",
                    token 
                }
            } else {
                result = {
                    message : "비밀번호를 확인하세요",
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


module.exports = router;
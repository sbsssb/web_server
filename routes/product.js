const express = require('express');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const db = require('../db');
const authMiddleware = require('../auth')
const router = express.Router();


router.get("/", async (req, res) => {
    let {pageSize, offset} = req.query;
    try {
        let sql = "SELECT * FROM TBL_PRODUCT LIMIT ? OFFSET ?";
        let [list] = await db.query(sql, [parseInt(pageSize), parseInt(offset)]);
        let [count] = await db.query("SELECT COUNT(*) AS cnt FROM TBL_PRODUCT");
        
        res.json({
            message : "result",
            list : list,
            count : count[0].cnt
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.get("/:productId", async (req, res) => {
    let {productId} = req.params;
    console.log(productId);
    try {
        let [list] = await db.query(`
                                SELECT P.*, F.filePath 
                                FROM TBL_PRODUCT P
                                LEFT JOIN TBL_PRODUCT_FILE F ON P.productId = F.productId
                                WHERE P.productId = ?
                            `, [productId]);
        console.log(list);
        res.json({
            message : "result",
            info : list[0]
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }

})

router.post("/", upload.single('file'), async (req, res) => {
    let {productName, description, price, stock, category} = req.body;
    let file = req.file;

    console.log("파일 업로드 정보:", file);
    console.log(productName, description, price, stock, category);
    try {
        let query = "INSERT INTO TBL_PRODUCT VALUES(NULL,?,?,?,?,?,'Y',NOW(), NOW())"
        let [result] = await db.query(query, [productName, description, price, stock, category]);
        
        // 새로 생성된 productId 가져오기
        const productId = result.insertId;

        // 2. 파일이 있는 경우 파일 정보 저장
        if (file) {
            let fileQuery = `
                INSERT INTO TBL_PRODUCT_FILE (productId, fileName, filePath)
                VALUES (?, ?, ?)
            `;
            await db.query(fileQuery, [productId, file.filename, file.path]); // 또는 file.path
        }

        res.json({
            message : "success",
            result : result
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

// authMiddleware 추가 -> 삭제 요청했을 때 authMiddleware 먼저 실행됨
router.delete("/:productId", authMiddleware, async (req, res) => {
    let {productId} = req.params;
    console.log(productId);
    try {
        let query = "DELETE FROM TBL_PRODUCT WHERE productId = ?"
        let result = await db.query(query, [productId]);
        res.json({
            message : "삭제되었습니다",
            result : result
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.put("/:productId", async (req, res) => {
    let {productId} = req.params;
    let {productName, description, price, stock, category} = req.body;
    try {
        let query = "UPDATE TBL_PRODUCT SET "
                    + "productName=?, description=?, price=?, stock=?, category=? "
                    + "WHERE productId = ?"
        let result = await db.query(query, [productName, description, price, stock, category, productId]);
        res.json({
            message : "수정되었습니다.",
            result : result
        });
    } catch (error) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

module.exports = router;
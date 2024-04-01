const authMiddleware = require("../middleware/auth/auth")
const express = require('express');
const router = express.Router();

router.get("/isAuth", authMiddleware.mid_auth, (req, res) =>{
    res.json({ userEmail : req.user_email})
} )

module.exports = router;

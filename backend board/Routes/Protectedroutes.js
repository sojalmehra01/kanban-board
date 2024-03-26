// routes/protected.js
const express = require('express');
const router = express.Router();
const { supabaseMiddleware } = require('@supabase/supabase-js');
const supabase = require('../Supabaseclient'); // Adjust the path as necessary

// Example protected route
router.get('/protected', supabaseMiddleware(supabase), (req, res) => {
    res.json({ message: 'This is a protected route' });
});

module.exports = router;

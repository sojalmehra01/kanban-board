// const express = require('express');
// const router = express.Router();
// const User = require('../DB/User'); // Adjust the path as necessary

// // Registration
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = new User({ username, password });
//         await user.save();
//         res.status(201).json({ message: 'Registration successful' });
//     } catch (error) {
//         res.status(500).json({ error: 'Registration failed' });
//     }
// });

// // Login
// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });

//         if (!user) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         }
//         if (user.password !== password) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         }
//         // Assuming you have a way to generate a token or handle sessions
//         // For example, generating a JWT token
//         // const token = generateToken(user);
//         // res.json({ token });
//         res.json({ message: 'Login successful' });
//     } catch (error) {
//         res.status(500).json({ error: 'Login failed' });
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const supabase = require('../SupabaseClient'); // Adjust the path as necessary

// Registration
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, error } = await supabase.auth.signIn({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        // Assuming you want to return a token or some user info
        // Supabase handles session management, so you might not need to manually generate tokens
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

module.exports = router;

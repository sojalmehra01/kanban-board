// cookieHandler.js

const cookieParser = require('cookie-parser');

// Middleware to use cookie-parser
exports.useCookieParser = (app) => {
    app.use(cookieParser());
};

// Function to set a cookie
exports.setCookie = (res, name, value, options = {}) => {
    res.cookie(name, value, options);
};

// Function to get a cookie
exports.getCookie = (req, name) => {
    return req.cookies[name];
};

// Function to delete a cookie
exports.deleteCookie = (res, name, options = {}) => {
    res.cookie(name, '', { ...options, maxAge: 0 });
};

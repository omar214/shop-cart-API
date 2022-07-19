const jwt = require('jsonwebtoken')
const SEC_KEY = process.env.JWT_SECRET_KEY || 'secret key';

// Create
const createToken = (payload) => {
    // what ever data you want to sign could be added to this payload
    payload = { id, isAdmin, email }
    const token = jwt.sign(
        payload,
        SEC_KEY,
        { expiresIn: maxAge }
    );
    return token;
};

// Verify
const verifyToken = (req, res, next) => {
    // if we add "bearer token"
    // const token = req.headers.authorization.split(' ')[1]
    // const token = req.header.authorization


    const token = req.headers.authorization;
    if (!token)
        return res.status(401).json({ msg: 'no token' })

    try {
        const decoded = jwt.verify(token, SEC_KEY)
        req.body.email = decoded.email
        next();
    } catch (err) {
        res.status(401).json({ msg: 'not authorised' })
    }
}

module.exports = {
    createToken,
    verifyToken
};
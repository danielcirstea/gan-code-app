const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (token && (token.startsWith('bearer ') || token.startsWith('Bearer '))) token = token.slice(7, token.length);

    if (token === 'dGhlc2VjcmV0dG9rZW4=') return next();

    return res.status(401).json({
        success: false,
        message: 'Auth token is not supplied or invalid.'
    });
};

module.exports = {
    verifyToken
};
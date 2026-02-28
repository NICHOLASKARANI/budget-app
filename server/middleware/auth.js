export const verifyToken = (req, res, next) => {
    // For testing, we'll create a mock user
    req.user = { id: 1, username: 'testuser' };
    next();
};

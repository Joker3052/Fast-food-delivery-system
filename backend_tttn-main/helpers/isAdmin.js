const isAdminMiddleware = (req,res,next) => {
    if(req.user.isAdmin) return next()
    else return res.status(403).json({ message: "You are not admin"})
}
module.exports = isAdminMiddleware;
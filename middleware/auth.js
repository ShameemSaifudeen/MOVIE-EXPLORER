
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next(); 
    } else {
        res.redirect('/login')
    }
}
export function redirectIfAuthenticated(req, res, next) {
    if (req.session) {
        // res.redirect('/'); 
        next()
    } else {
        next(); 
    }
}



export default isAuthenticated;

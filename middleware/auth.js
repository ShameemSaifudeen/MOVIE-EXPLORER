
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        next(); 
    } else {
        res.redirect('/login')
    }
}
export function redirectIfAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        res.redirect('/'); 
    } else {
        next(); 
    }
}



export default isAuthenticated;

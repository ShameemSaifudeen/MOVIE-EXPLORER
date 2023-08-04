
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        next(); 
    } else {
        res.redirect('/login')
    }
}
export function redirectIfAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        res.redirect('/');  // Redirect to home page if user is already logged in
    } else {
        next(); 
    }
}



export default isAuthenticated;

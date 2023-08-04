function isAuthenticated(req, res, next) {
    console.log(req.session);
    if (req.session.userId) {
        next(); 
    } else {
        res.redirect('/')
    }
}
export function redirectIfAuthenticated(req, res, next) {
    if (req.session.userId) {
        res.redirect('/home'); 
    
    } else {
        next(); 
    }
}



export default isAuthenticated;

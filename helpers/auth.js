var isAuthenticated = function(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
    }
    res.send(401,{ success : false, message : 'not authenticated' });

}

var isNotLoggedIn = function(req, res, next) {
    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

var isLoggedIn = function(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log("isloggedin")
    if (req.isAuthenticated()){
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = {
  isAuthenticated: isAuthenticated,
  isLoggedIn: isLoggedIn,
  isNotLoggedIn: isNotLoggedIn
}

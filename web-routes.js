module.exports = function(__dirname) {
    function WebRoutes() {}

    // GET /index, /
    WebRoutes.index_redirect = function(req, res) {
        res.redirect('/welcome');
    };

    // GET /welcome
    WebRoutes.welcome = function(req, res) {
        res.sendFile(__dirname + '/views/main.html');
    };

    // GET /login
    WebRoutes.login = function(req, res) {

    };
    return WebRoutes;
};
module.exports = function(__dirname) {
    function WebRoutes() {}

    // GET /index, /
    WebRoutes.index_redirect = function(req, res) {
        res.redirect('/welcome');
    };

    // GET /index, /
    WebRoutes.extension_check_redirect = function(req, res) {
        res.redirect('/effic_extension_check.html');
    };

    // GET /welcome
    WebRoutes.welcome = function(req, res) {
        res.sendFile(__dirname + '/views/main.html');
    };

    // GET /facebook_message/?time_started=<number as string>
    WebRoutes.facebook_message = function(req, res) {
        res.render(__dirname + '/views/facebook_message', {
            time_started : req.query.time_started
        });
    };
    return WebRoutes;
};
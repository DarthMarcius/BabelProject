module.exports = {
    listenToRoutes: function(app, handlebars) {
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

        app.get('/', function (req, res) {
            res.render('home', {
                name: "homepage",
                title: "Welcome to issue tracker",
                ifCond: function(v1, v2, options) {
                    if(v1 === v2) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                }
            });
        });
    }
}
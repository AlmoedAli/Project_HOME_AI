const homeRouter = require('./user/home');

function route(app) {
    app.use('/', homeRouter);
}

module.exports = route;
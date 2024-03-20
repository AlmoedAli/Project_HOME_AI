const exampleRouter = require('./user/example');

function route(app) {
    app.use('/', exampleRouter);
}

module.exports = route;
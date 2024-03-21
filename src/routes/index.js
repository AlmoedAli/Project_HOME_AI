const exampleRouter = require('./user/example');
const equipmentRouter = require('./user/equipment');

function route(app) {
    app.use('/', exampleRouter);
    app.use('/equipment', equipmentRouter);
}

module.exports = route;
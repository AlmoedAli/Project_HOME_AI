const exampleRouter = require('./user/example');
const equipmentRouter = require('./user/equipment');
const equipmentModify = require('./user/equipment_modify');

function route(app) {
    app.use('/', exampleRouter);
    app.use('/equipment', equipmentRouter);
    app.use('/equipment_modify',equipmentModify)
}

module.exports = route;
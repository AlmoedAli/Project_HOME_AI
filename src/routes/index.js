const homepageRouter = require('./user/homepage');
const equipmentRouter = require('./user/equipment');
const equipmentModify = require('./user/equipment_modify');
const sensorRouter = require('./user/sensor');

function route(app) {
    app.use('/', homepageRouter);
    app.use('/equipment', equipmentRouter);
    app.use('/sensor', sensorRouter);
    app.use('/equipment_modify',equipmentModify)
}

module.exports = route;
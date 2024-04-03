const homepageRouter = require('./user/homepage');
const equipmentRouter = require('./user/equipment');
const sensorRouter = require('./user/sensor');

function route(app) {
    app.use('/', homepageRouter);
    app.use('/equipment', equipmentRouter);
    app.use('/sensor', sensorRouter);
}

module.exports = route;

const homepageRouter = require('./user/homepage');
const equipmentRouter = require('./user/equipment');
const sensorRouter = require('./user/sensor');
const notificationRouter = require('./user/notification');

function route(app) {
    app.use('/', homepageRouter);
    app.use('/equipment', equipmentRouter);
    app.use('/sensor', sensorRouter);
    app.use('/notification', notificationRouter);
}

module.exports = route;

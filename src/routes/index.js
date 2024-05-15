const homepageRouter = require('./user/homepage');
const equipmentRouter = require('./user/equipment');
const sensorRouter = require('./user/sensor');
const notificationRouter = require('./user/notification');
const LoginRouter = require('./user/login')
const SignUpRouter = require('./user/signup')
const ProfileRouter = require('./user/profile')

function route(app) {
    app.use('/', homepageRouter);
    app.use('/equipment', equipmentRouter);
    app.use('/sensor', sensorRouter);
    app.use('/notification', notificationRouter);
    app.use('/login',LoginRouter)
    app.use('/signup',SignUpRouter)
    app.use('/profile',ProfileRouter)
}

module.exports = route;

const example = require('../../models/example');

class ExampleController {
    index(req, res, next) {
        res.render('user/example', {
            layout: 'main'
        })
    }
}

module.exports = new ExampleController;
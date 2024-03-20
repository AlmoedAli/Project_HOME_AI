const example = require('../../models/example');

class ExampleController {
    index(req, res, next) {
        res.render('user/example', {
            layout: 'main',
            variable: [{"a": true, "b": "show"}, {"a": false, "b": "hide"}]
        })
    }
}

module.exports = new ExampleController;
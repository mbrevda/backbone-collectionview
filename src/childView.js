var Backbone = require('backbone'),
    _ = require('underscore')

module.exports = Backbone.View.extend({
    constructor: function() {
        Backbone.View.apply(this, arguments);
        this.listenTo(this.model, 'remove', this.remove)

        this.render()
    }
})

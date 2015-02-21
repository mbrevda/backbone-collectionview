var Backbone = require('backbone'),
    _ = require('underscore'),
    KinView = require('backbone-kinview'),
    ChildView = require('./childView.js')

module.exports = KinView.extend({
    constructor: function() {
        // super()
        KinView.apply(this, arguments)

        // defaults
        this.collection = null
        this.filters = {}

        this.on('filter', this.rerenderChildren, this)

        // process arguments, if received
        var options = arguments[0] || {}

        this.childView = options.childView || ChildView
        if (options.collection) {
            this.setCollection(options.collection)
        }
    },
    // datasource handling
    setCollection: function(collection) {
        // stop listening to the current collection, if there is one
        if (this.collection) {
            this.stopListening(this.collection)
        }

        // clear all child elements
        this.children.removeAll()

        this.collection = collection

        this.collection.each(this.addChild, this)
        this.listenTo(this.collection, 'add', _.bind(this.addChild, this))
        this.listenTo(this.collection, 'sort', this.addChild, this)
    },
    addChild: function(model) {
        if (!this.filter(model)) {
            return false
        }
        return this.add({
            view: new this.childView({model: model})
        })
    },
    rerenderChildren: function() {
        this.children.removeAll()

        this.collection.each(this.addChild, this)
    },

    // filtering functions
    addFilter: function(name, filter) {
        this.filters[name] = filter
        this.trigger('filter')
    },
    removeFilter: function(name) {
        delete this.filters[name]
        this.trigger('filter')
    },
    clearFilters: function() {
        this.filters = {}
    },
    filter: function(model) {
        // retuns true if there are no filter
        // https://github.com/jashkenas/underscore/blob/master/underscore.js#L239
        return _.every(this.filters, function(filter) {
            return filter(model)
        }, this)
    },
    filtered: function() {
        return this.collection.filter(this.filter, this)
    }
})

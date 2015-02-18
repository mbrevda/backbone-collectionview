var Backbone = require('backbone'),
    KinView = require('backbone-kinview')

module.exports = KinView.extend({
    constructor: function(opts) {
        // super()
        //this.constructor.__super__.constructor.apply(this, arguments)
        KinView.apply(this, arguments)

        this.filters = {}
        this.on('filter', this.rerenderChildren, this)

        if (opts && opts.collection) {
            this.setCollection(opts.collection)

        }
    },
    
    // datasource handling
    setCollection: function(collection) {
        if (!(collection instanceof Backbone.Collection)) {
            throw new Error('Invalid collection passed!')
        }
        
        // stop listening to the current collection, if there is one
        if (this.collection) {
            this.stopListening(this.collection)
        }
        
        // clear all child elements
        this.removeAll()

        this.collection = collection

        _.each(this.collection, this.addChild, this)
        this.listenTo(this.collection, 'add', _.bind(this.addChild, this))
        //this.listenTo(this.collection, 'sort', this.appendChild, this)
    },
    addChild: function(model) {
        return this.add({
            view: new this.childView({model: model})
        })
    },
    rerenderChildren: function() {
        this.removeAll()
        if (!(this.children instanceof Backbone.Collection)) {
            return false
        }

        this.children.each(_.bind(this.addChild, this))
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
        return _.every(this.filters, function(filter) {
            return filter(model)
        })
    },
    filtered: function() {
        return this.collection.every(this.filters, function(filter) {
            return filter(model)
        }, this)
    }
})

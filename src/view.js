var Backbone = require('backbone'),
    _ = require('underscore'),
    KinView = require('backbone-kinview'),
    ChildView = require('./childView.js')

module.exports = KinView.extend({
    childView: ChildView,
    constructor: function() {
        // super()
        KinView.apply(this, arguments)

        // defaults
        this.collection = null
        this.filters = {}
        this.sort = null
        this.page = {
            offset: null,
            limit: 25
        }
        this.on('rerender', this.renderChildren, this)

        // process arguments, if received
        var options = arguments[0] || {}

        this.setCollection(options.collection || new Backbone.Collection())
        
    },
    // datasource handling
    setCollection: function(collection) {
        // stop listening to the current collection, if there is one
        if (this.collection) {
            this.stopListening(this.collection)
        }

        this.collection = collection

        this.renderChildren()

        this.listenTo(this.collection, 'add', _.bind(this.addChild, this))
        this.listenTo(this.collection, 'reset', this.renderChildren, this)
    },
    addChild: function(model) {
        // dont bother if this model wont pass the filters anyway
        if (!this.filter(model)) return false

        // we need to do a full re-render if there is a sorter or pagination
        if (this.sort || this.page.offset) return this.trigger('rerender')

        return this.append(model)
    },
    append: function(model) {
        // calling append directly will bypass all sorting/filtering/paging
        // call addChild instead
        return this.add({
            view: new this.childView({model: model})
        })
    },
    renderChildren: function() {
        this.children.removeAll()

        // process collection
        var models =
            _.isEmpty(this.filters)
            ? this.collection.models.slice()
            : this.collection.filter(this.filter, this)

        // sort
        if (this.sort) models.sort(this.sort)

        var chain = _(models).chain()

        // page
        chain = _.isNull(this.page.offset)
            ? chain
            : chain.rest(this.page.offset).first(this.page.limit)

        // append whatever is left to the view
        chain.each(this.append, this)

    },

    // filtering functions
    addFilter: function(name, filter) {
        this.filters[name] = filter
        this.trigger('rerender')
    },
    removeFilter: function(name) {
        delete this.filters[name]
        this.trigger('rerender')
    },
    clearFilters: function() {
        this.filters = {}
        this.trigger('rerender')
    },
    filter: function(model) {
        // returns true if there are no filter
        // https://github.com/jashkenas/underscore/blob/master/underscore.js#L239
        return _.every(this.filters, function(filter) {
            return filter(model)
        }, this)
    },
    filtered: function() {
        return this.collection.filter(this.filter, this)
    },

    // paging function
    setPage: function(offset, limit) {
        // dont do anything if there is nothing to do
        if (_.isNull(this.page.offset) && _.isNull(offset)) return true

        // set the offset (i.e. the page)
        this.page.offset = _.isNumber(offset) || _.isNull(offset) ? offset : null

        // set the limit (i.e. items per page)
        if (arguments.length > 1) {
            this.page.limit = _.isNumber(limit) ? limit : 25
        }

        this.trigger('rerender')
    },

    // sorting functions
    setSort: function(val) {
        this.sort = val
        this.trigger('rerender')
    }
})

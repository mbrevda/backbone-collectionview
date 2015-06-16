var Backbone = require('backbone'),
    _ = require('underscore'),
    KinView = require('backbone-kinview'),
    ChildView = require('./childView.js')

module.exports = KinView.extend({
    childView: ChildView,
    constructor: function() {
        // defaults
        this.collection = null
        this.filters = {}
        this.sort = null
        this.page = {
            offset: null,
            limit: 25
        }

        // super()
        KinView.apply(this, arguments)

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
        // calling append() directly will bypass all sorting/filtering/paging
        // instead, call addChild()
        return this.add({
            view: new this.childView({model: model})
        })
    },
    renderChildren: function() {
        this.children.removeAll()
        this.getCurrentChildren(this.append, this)
    },
    getCurrentChildren: function(done, context) {
        var children = []

        // process collection
        var hasFilters = !_.isEmpty(this.filters)
        var hasPage    = !_.isNull(this.page.offset)
        var models =
            this.sort
            ? this.collection.models.slice()
            : this.collection.models
        
        // no point in continuing if we dont have models
        if (!models || models.length === 0) return false

        // sort
        if (this.sort && hasPage) models.sort(this.sort)

        // page and append
        var start = 0, end = models.length
        if (hasPage) {
            start = this.page.offset || 0
            end   = (this.page.limit || 25) + start
            // dont overshoot the amount of elements
            end = Math.min(end, models.length)
        }

        for (var i = start; i < end; i++) {
            // if there are no filters, just add the model
            if (!hasFilters) {children.push(models[i]); continue}

            // otherwise, if this model passes the filter, add it to the results
            if (this.filter(models[i])) {children.push(models[i]); continue}

            // if were going to reject this model, increment the end value so
            // that we can test one more model from the collection, but dont
            // let the end value to be longer than the length of the array
            if (hasPage) end = Math.min(end + 1, models.length)
        }
        
        // when filtering, we prefer to sort the filtered collection after filtering
        // as its probably smaller. When paging, however, this is improper as 
        // pagination is generally desired after sorting and filtering
        if (!hasPage && this.sort ) children.sort(this.sort)
            
        if (typeof done == 'function') return children.forEach(done, context)
        return children
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

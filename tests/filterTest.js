var should     = require('should'),
    Backbone   = require('backbone'),
    View       = require('../'),
    ChildView  = require('../').childView

describe('Filters', function(){
    beforeEach(function() {
        // data
        this.collection = new Backbone.Collection([
                {foo: 'bar0'},
                {foo: 'bar1'},
                {foo: 'bar2'}
        ])

        // create child view
        var childView = ChildView.extend({
            render: function() {
                this.$el.text(this.model.get('foo'))
            }
        })

        // create view
        var MyView = View.extend({childView: childView})
        this.view = new MyView({
            collection: this.collection
        })
    })

    it('addFilter()', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('foo', function(){})
        this.view.filters.foo.should.be.type('function')
    })

    it('removeFilter()', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('foo', function(){})
        this.view.removeFilter('foo')

        ;(this.view.filters['foo'] === undefined).should.be.ok
    })

    it('filter() true', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('true', function(value){
            return value == 'foo'
        })

        this.view.filter('foo').should.be.true
    })

    it('clearFilters()', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('foo', function(){})
        this.view.clearFilters()
        this.view.filters.should.be.empty
    })

    it('filter() return false', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('true', function(value){
            return false
        })

        this.view.filter('foo').should.be.false
    })

    it('filtered() should return an array of models', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('true', function(model){
            return model.get('foo') !== 'bar2'
        })

        this.view.filtered().should.be.instanceof(Array).and.have.lengthOf(2)
    })

    it('filter names may contain spaces', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('some name', function(){})
        this.view.removeFilter('some name')

        Object.keys(this.view.filters).length.should.eql(0)
    })

    it('Adding a filter should rerender the children, filtered', function() {
        this.view.childView = ChildView.extend({
            render: function() {
                this.$el.text(this.model.get('foo'))
            }
        })

        this.view.$el.html().should
            .equal('<div>bar0</div><div>bar1</div><div>bar2</div>')

        this.view.addFilter('foo', function(model) {
            return model.get('foo') !== 'bar2'
        })

        this.view.$el.html().should.equal('<div>bar0</div><div>bar1</div>')
    })

    it('Removing a filter should rerender the children, filtered', function() {
        var string = '<div>bar0</div><div>bar1</div><div>bar2</div>'

        this.view.setCollection(this.collection)
        this.view.$el.html().should.equal(string)

        this.view.addFilter('foo', function(model) {
            return model.get('foo') !== 'bar2'
        })

        this.view.$el.html().should.equal('<div>bar0</div><div>bar1</div>')

        this.view.removeFilter('foo')
        this.view.$el.html().should.equal(string)
    })

    it('Should allow a filter even before a colleciton is set', function(){
        this.view.addFilter('foo', function(model){
            return model.get('foo') !== 'bar2'
        })
        this.view.setCollection(this.collection)

        this.view.$el.html().should.equal('<div>bar0</div><div>bar1</div>')
    })

})

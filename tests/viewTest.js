var should = require('should'),
	Backbone = require('backbone'),
	View = require('../')

describe('View', function(){
    beforeEach(function() {
        this.view = new View()
        this.collection = new Backbone.Collection([
                {foo: 'bar0'},
                {foo: 'bar1'},
                {foo: 'bar2'}
            ])
    })

    it('addFilter()', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('foo', function(){})
        this.view.filters['foo'].should.be.type('function')
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

	it('collections can be passed as an opt', function() {
		var view = new View({
			collection: new Backbone.Collection()
		})

		view.collection.should.be.an.instanceOf(Backbone.Collection)
	})

	it('collections can be passed after initialization', function() {
		var view = new View()
		view.setCollection(new Backbone.Collection())

		view.collection.should.be.an.instanceOf(Backbone.Collection)
	})

	it('Stop listening to collection before its replaced', function(done) {
		var collection1 = new Backbone.Collection(),
			collection2 = new Backbone.Collection(),
			view = new View({collection: collection1})

		collection2.on('test', done)

		view.listenTo(collection1, 'test', function() {
			throw new Error('Still listening to collection1')
		})

		view.setCollection(collection2)

		collection1.trigger('test')
		collection2.trigger('test')
	})
})

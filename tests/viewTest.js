var should = require('should'),
	Backbone = require('backbone'),
	View = require('../'),
	ChildView = require('../').childView

describe('View', function(){
    beforeEach(function() {
        this.view = new View()
        this.collection = new Backbone.Collection([
                {foo: 'bar0'},
                {foo: 'bar1'},
                {foo: 'bar2'}
            ])
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

	it('collections will be rendered when there are no filters', function() {
		var childView = ChildView.extend({
			render: function() {
				this.$el.text(this.model.get('foo'))
			}
		})

		var MyView = View.extend({childView: childView})
		var view = new MyView({collection: this.collection})

		view.$el.children().eq(0).text().should.equal('bar0')
		view.$el.children().eq(1).text().should.equal('bar1')
		view.$el.children().eq(2).text().should.equal('bar2')
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

	it('Child shouldnt render if it wont pass the filter', function(){
		this.view.setCollection(this.collection)
		this.view.addFilter('foo', function(model){
			return model.get('foo') !== 'bar3'
		})

		var f = this.collection.add({foo: 'bar3'})
		this.view.$el.children().length.should.equal(3)
	})

	it('Should render child on add', function(){
		this.view.setCollection(this.collection)
		this.collection.add({foo: 999})

		this.view.$el.children().length.should.equal(4)
	})

    it('getCurrentCollection() should return a current array of models', function(){
        this.view.setCollection(this.collection)
        this.view.addFilter('true', function(model){
            return model.get('foo') !== 'bar2'
        })

        this.view.getCurrentChildren().should.be.instanceof(Array).and.have.lengthOf(2)
    })
})

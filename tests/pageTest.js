var should = require('should'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    View = require('../'),
    ChildView = require('../').childView

describe('Page', function(){
    beforeEach(function() {
        // create child view
        var childView = ChildView.extend({
            render: function() {
                this.$el.text(this.model.get('foo'))
            }
        })

        // create data
        var data = _.map(_.range(100), function(val){return {foo: val}})
        this.collection = new Backbone.Collection(data)

        // create view
        var MyView = View.extend({childView: childView})
        this.view = new MyView({
            collection: this.collection
        })

    })

    it('Do nothing if null is passes', function(){
        this.view.setPage(null)

        _.isNull(this.view.page.offset).should.be.ok
    })

    it('Valid args are passed', function(){
        this.view.setPage(0, 20)

        this.view.page.offset.should.equal(0)
        this.view.page.limit.should.equal(20)
    })

    it('Reset if null is passes', function(){
        this.view.setPage(0, 20)

        this.view.page.offset.should.equal(0)
        this.view.page.limit.should.equal(20)

        this.view.setPage(null)

        _.isNull(this.view.page.offset).should.be.ok
    })

    it('Page should default to a limit of 25 if invalid arg is passed', function(){
        this.view.setPage(0, 'hello')

        this.view.page.limit.should.equal(25)
    })

    it('First page setPage(0, 20)', function(){
        this.view.setPage(0, 20)

        this.view.$el.children().length.should.equal(20)
        this.view.$el.children().eq(10).text().should.equal('10')
    })

    it('Second page setPage(20, 20)', function(){
        this.view.setPage(20, 20)

        this.view.$el.children().length.should.equal(20)
        this.view.$el.children().eq(10).text().should.equal('30')
    })

    it('Reset page page(null)', function(){
        this.view.setPage(20, 20)

        this.view.$el.children().length.should.equal(20)

        this.view.setPage(null)
        this.view.$el.children().length.should.equal(100)
    })

    it('Invalid args page("sss")', function(){
        this.view.setPage('sss')

        this.view.$el.children().length.should.equal(100)
    })
})

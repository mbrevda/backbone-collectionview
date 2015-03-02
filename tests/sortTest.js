var should = require('should'),
Backbone = require('backbone'),
View = require('../'),
ChildView = require('../').childView

describe('Sort', function(){
    beforeEach(function() {
        this.view = new View()

        this.collection = new Backbone.Collection([
            {foo: 'bar0'},
            {foo: 'bar1'},
            {foo: 'bar2'}
        ])
    })

    it('should sort the view', function(){
        var childView = ChildView.extend({
            render: function() {
                this.$el.text(this.model.get('foo'))
            }
        })

        var MyView = View.extend({childView: childView})
        var view = new MyView({collection: this.collection})

        // simple reverse string sort
        view.setSort(function(model1, model2){
            var b = model1.get('foo')
            var a =  model2.get('foo')
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        })

        view.$el.children().eq(0).text().should.equal('bar2')
        view.$el.children().eq(1).text().should.equal('bar1')
        view.$el.children().eq(2).text().should.equal('bar0')
    })

    it('Removing a sorter should rerender', function(){
        var childView = ChildView.extend({
            render: function() {
                this.$el.text(this.model.get('foo'))
            }
        })

        var MyView = View.extend({childView: childView})
        var view = new MyView({collection: this.collection})

        // simple reverse string sort
        view.setSort(function(model1, model2){
            var b = model1.get('foo')
            var a =  model2.get('foo')
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        })

        view.$el.children().eq(0).text().should.equal('bar2')
        view.$el.children().eq(1).text().should.equal('bar1')
        view.$el.children().eq(2).text().should.equal('bar0')

        view.setSort(null)

        view.$el.children().eq(0).text().should.equal('bar0')
        view.$el.children().eq(1).text().should.equal('bar1')
        view.$el.children().eq(2).text().should.equal('bar2')
    })

    it('Rerender view if child is added and sort is set', function(done){
        this.view.setCollection(this.collection)

        this.view.setSort(function(){return true})
        this.view.on('rerender', done)


        this.collection.add({foo: 666})
    })
})

# CollectionView
**CollectionView** is a [Backbone.js](http://backbonejs.org/) view that provides full 
lifecycle support for any element, including autorendering of children elements.
It also adds **sorting, filtering, and pagination**. It remains 
simple, fluent, and idiomatic by relying on [KinView](https://github.com/mbrevda/backbone-kinview)
for the underlying view management.

# Installation

CollectionView has been designed to `require`'d by [browserify](http://browserify.org/),
and is currently only supported in that environment. To install:

```
npm install backbone-collectionview --save
```

# Code

## CI
CollectionView continuous integrations is handled by Wercker:
[![wercker status](https://app.wercker.com/status/194111aeb3f08fedd7af263f0fc793d3/s "wercker status")](https://app.wercker.com/project/bykey/194111aeb3f08fedd7af263f0fc793d3)

## Testing
CollectionView maintains 100% test coverage. To manually run the tests, install with with --dev (as above) and run:

```
gulp testc
```

You can generate a HTML code coverage report by appending the `--html` switch

## Issues
Issues can be opened in the [usual location](https://github.com/mbrevda/backbone-collectionview/issues), pull requests welcome!

# Usage
 
## Getting started
Getting started with CollectionView is as simple as creating a new Backbone view:

```js
var CollectionView = require('backbone-collectionview')

var table = CollectionView.extend({
    // regular Backbone.View opts here
})

```

Passing a collection to the view will allow the view to auto-append all items of the collection to the table and manage their lifecycle including adding items as they get added to the collection, appending the items to the table, and cleaning up when the child view is removed. To pass a collection to the table:

```js
var CollectionView = require('backbone-collectionview')

var table = CollectionView.extend({
    collection: new Backbone.Collection([/* models */])
    // regular Backbone.View opts here
})
```
note: `view.setCollection(collection)` can also be called to (re)set the views collection

## Filtering & Sorting
CollectionView has built in support for filtering the collection data appended to the view. 

### Filtering data
To set a filter, a function should be passed to the view:

```js
view.addFilter('name', function(){/* do something */})
```

Filter functions should return a boolean value. Only models with truthy values on ALL filters will be shown.

A view can have multiple filters. To add more filters, just call `addFilter()` as necessary. Note, multiple filters will be treaded as AND's (not as OR's), and as above - ALL filters must return true for a model to be displayed.

A filter can be removed by calling `removeFilter('name')`.

Whenever a filter is added or removed, the table will be re-filtered. If rows have been added that aren't part of the collection, they will inadvertently be removed.

### Sorting rows
####sorting is not yet implemented

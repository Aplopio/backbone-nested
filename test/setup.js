//Backbone.Model.prototype.relationAttribute = 'relations';

var Person = Backbone.Model.extend({
    schema: {}
});

var Page = Backbone.Model.extend({
    schema: {}
});

var Pages = Backbone.Collection.extend({
    model: Page
});


var Book = Backbone.Model.extend({
    schema: {
        author: {
            type: 'related',
            _constructor: Person
        },
        pages: {
            type: 'related',
            _constructor: Pages
        },
        released_on: {
            type: 'datetime',
            _constructor: Date
        }
    }
});

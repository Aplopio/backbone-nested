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
            constructor: Person
        },
        pages: {
            type: 'related',
            constructor: Pages
        },
        released_on: {
            type: 'datetime',
            constructor: Date
        }
    }
});

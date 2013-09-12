//Backbone.Model.prototype.relationAttribute = 'relations';

var Book = Backbone.Model.extend({
    schema: {
        author: {
            type: 'related',
            constructor: Backbone.Model
        },
        pages: {
            type: 'related',
            constructor: Backbone.Collection
        },
        released_on: {
            type: 'datetime',
            constructor: Date
        }
    }
});

//Backbone.Model.prototype.relationAttribute = 'relations';

var Book = Backbone.Model.extend({
	relations: {
		"author": Backbone.Model,
		"pages" : Backbone.Collection
	}
});

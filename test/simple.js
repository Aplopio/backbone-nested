/*global describe, beforeEach, afterEach, it, expect,
 jasmine, Book, Book1 */
describe("Simple Tests", function() {
    var book;

    beforeEach(function() {
        this.addMatchers({
            toBeInstanceOf: function(expected) {
                return this.actual instanceof expected;
            }
        });
        book = new Book();

        book.set({
          "author": {
            "name" : "Heber J. Grant",
            "title": "President",
            "age"  : "47"
          },
          "pages": [
            {
                number: 1,
                words: 500
            },
            {
                number: 2,
                words: 450
            }
          ]
        });
    });

    it("Should build a model relation", function() {
        expect(book.get('author').get('name')).toEqual('Heber J. Grant');
        expect(book.get('author').get('title')).toEqual('President');
        expect(book.get('author').get('age')).toEqual('47');
    });

    it("Should set the model relation for already constructed value", function() {
        book.set({
            author: new Person({
                name : "Viky",
                title: "UX engineer",
                age  : 47
            })
        });
        expect(book.get('author').get('name')).toEqual('Viky');
    });

    it("Should trigger change when the value of model relation is changed", function() {
        var spy = jasmine.createSpy();
        book.on( 'change', spy );

        book.set({
            author: new Person({
                id: 'new_id',
                name : "Viky",
                title: "UX engineer",
                age  : 47
            })
        });
        expect(spy).toHaveBeenCalled();
    });

    it("Should build a collection relation", function() {
        expect(book.get('pages').length).toBe(2);
        expect(book.get('pages').at(0).get('number')).toBe(1);
        expect(book.get('pages').at(1).get('number')).toBe(2);
        expect(book.get('pages').at(0).get('words')).toBe(500);
        expect(book.get('pages').at(1).get('words')).toBe(450);
    });

    it("Should work for any constructor", function() {
        book.set({
            released_on: '2013-09-12T07:07:00.825Z'
        });
        //console.log(book.get('released_on'));
        expect(book.get('released_on')).toBeInstanceOf(Date);
        expect(book.get('released_on').getFullYear()).toEqual(2013);
    });

    it("Should do nothing about null", function() {
        book.set('released_on', null);
        expect(book.get('released_on')).toBe(null);
    });

    it("Should do nothing about undefined", function() {
        book.set('released_on', undefined);
        expect(book.get('released_on')).toBe(undefined);
    });

    it("Should retain the original value for related field provided with non-object value", function() {
        var orig_val = book.get( 'author' );
        book.set('author', 'Viky');
        expect(book.get('author')).toBe(orig_val);
    });

    it("Should set the value as such when related field provided with non-object value and there is no previous value", function() {

        book.schema.foreword_by = {
            type: 'related',
            _constructor: Person
        };
        book.set('foreword_by', 'Viky');
        expect(book.get('foreword_by')).toBe('Viky');
    });

    it("Should provide backwards references to the parent models", function() {
        expect(book.get('author').parent).toEqual(book);
        expect(book.get('pages').at(0).collection.parent).toEqual(book);
    });

    it("Should merge in new properties into an existing relation", function() {
        var author = book.get('author');

        book.set({
            'author': {
                'city': "SLC"
            }
        });

        expect(book.get('author')).toBe(author);
        expect(book.get('author').get('name')).toBe('Heber J. Grant');
        expect(book.get('author').get('city')).toBe('SLC');
    });

    it("Should deconstruct model references", function() {
        var author = book.get('author');
        book.unset('author');

        expect(author.parent).not.toBeDefined();
    });

    it("Should add new models into a relation which is a collection", function() {
        book.get( 'pages' ).reset([
            {
                id: 1,
                number: 3,
                words: 600
            }
        ]);
        expect(book.get('pages').length).toBe(1);

        book.set({
            pages: [
                {
                    id: 1,
                    number: 10,
                    words: 800
                },
                {
                    id: 2,
                    number: 4,
                    words: 500
                }
            ]
        });
        expect(book.get('pages').length).toBe(2);
    });

    it("Should merge new models into a relation which is a collection", function() {
        book.set({
          "pages": [
              {
                  number: 3,
                  words: 600
              }
          ]
        });

        expect(book.get('pages').length).toBe(3);
    });

    it("Should merge values into models which already exist in a sub collection", function() {
        book.set({
          "pages": [
              {
                  id: 1,
                  number: 3,
                  words: 600
              }
          ]
        });


        book.set({
          "pages": [
              {
                  id: 1,
                  test: "test"
              }
          ]
        });

        expect(book.get('pages').length).toBe(3);
        expect(book.get('pages').at(2).get('test')).toBe('test');
        expect(book.get('pages').at(2).get('words')).toBe(600);
    });

    it("Should remove models which no longer exist in a sub collection", function() {
        book.set({
          "pages": [
              {
                  id: 1,
                  number: 3,
                  words: 600
              }
          ]
        });


        book.set({
          "pages": [
              {
                  id: 2,
                  test: "test"
              }
          ]
        });

        expect(book.get('pages').length).toBe(3);
        expect(book.get('pages').at(2).get('test')).toBe('test');
        expect(book.get('pages').at(2).get('words')).not.toBe(600);
        expect(book.get('pages').at(2).id).toBe(2);
    });

    it("Should trigger reset events on nested collection relations", function() {
        var Thing = Backbone.Model.extend();

        var spy = jasmine.createSpy();

        var Things = Backbone.Collection.extend({
          model: Thing,

          initialize: function() {
            this.on('reset', spy);
          }
        });

        var Bucket = Backbone.Model.extend({
            schema: {
                things: {
                    type: 'related',
                    _constructor: Things
                }
            }
        });

        var Buckets = Backbone.Collection.extend({
          model: Bucket
        });

        var buckets = new Buckets();
        buckets.reset([
          {
            name: 'a',
            things: [{num: 1}, {num: 2}]
          },
          {
            name: 'b',
            things: [{num: 1}, {num: 2}]
          }
        ]);

        expect(spy).toHaveBeenCalled();
    });

    it("Should recursively call .toJSON for related fields", function() {
        var json = book.toJSON();
        expect(json.pages[0].number).toEqual(1);

        var emptyBook = new Book();
        expect(emptyBook.toJSON()).toEqual({});
    });

    it("Should work for fields whose values have no .toJSON", function() {
        book.schema.keywords = {
            type: 'list'
        };
        book.set({ keywords: ['javascript', 'backbone'] });

        var json = book.toJSON();
        expect(json.keywords.toJSON).not.toBeDefined();
        expect(json.keywords).toBeInstanceOf(Array);
    });
});

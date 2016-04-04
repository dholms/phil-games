var statement = new Statement("All cows are mammals");

describe("createElement", function() {
    it("be able to create the DOM element from text", function(){
        var element = statement.createElement(statement.text);
        var testText = '<div class="statement"><span class="word">All</span><span class="space">&nbsp;</span><span class="word">cows</span><span class="space">&nbsp;</span><span class="word">are</span><span class="space">&nbsp;</span><span class="word">mammals</span>.</div>'
        var testElem = $(testText)
        expect(element).toEqual(testElem);
    });
});

describe("incrCategory", function() {
    it("be able to increment the internal representation of its current category", function(){
        expect(statement.category).toEqual(1);
        expect(statement.color).toEqual('blue');
        statement.incrCategory();
        expect(statement.category).toEqual(2);
        expect(statement.color).toEqual('red');
        statement.incrCategory();
        expect(statement.category).toEqual(3);
        expect(statement.color).toEqual('green');
    });
});

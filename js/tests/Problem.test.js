var user = new User();
var categories = [{'plural':"squibs"},{'plural':"muggles"},{'plural':"purebloods"}];
var premises = ["some 1 are 2","no 2 are 3"];
var conclusion = "some 2 are not 3";

var generateJSON = function(cats, prems, con){
    var temp = {
        categories: cats,
        premises: prems,
        conclusion: con
    }
    return temp;
}

//Take representative sample of problem structures and test for correct venn diagram construction/evaluation

var problemJSON = generateJSON(categories,premises,conclusion);
var prob = new Problem(problemJSON, user);

describe("createVennsShaded1", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob.venns[1][0]).toEqual([false,false,false,false,false,true,true]);
    });
});

describe("createVennsSelected1", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,1,0,0,1]);
        expect(prob.venns[1][1]).toEqual([0,0,0,1,0,0,0]);
    });
});

describe("evaluateConclusion1", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(true);
    });
});

//second iteration
premises = ["some 1 are 2 and 3", "all 2 are 3"];
problemJSON = generateJSON(categories,premises,conclusion);
prob = new Problem(problemJSON, user);

describe("createVennsShaded2", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob.venns[1][0]).toEqual([false,true,false,true,false,false,false]);
    });
});

describe("createVennsSelected2", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,0,0,0,1]);
        expect(prob.venns[1][1]).toEqual([0,0,0,0,0,0,1]);
    });
});

describe("evaluateConclusion2", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(false);
    });
});

//third iteration
premises = ["no 1 are not 2 and 3", "all not 2 are 3"];
conclusion = "all 1 are 2";
problemJSON = generateJSON(categories,premises,conclusion);
prob = new Problem(problemJSON, user);

describe("createVennsShaded3", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,false,true,false,false]);
        expect(prob.venns[1][0]).toEqual([true,false,false,false,true,false,false]);
    });
});

describe("createVennsSelected3", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob.venns[1][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion3", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(true);
    });
});


//fourth iteration
premises = ["no not 1 are 2 and 3", "all not 2 are 3"];
conclusion = "all not 1 are 2";
problemJSON = generateJSON(categories,premises,conclusion);
prob = new Problem(problemJSON, user);

describe("createVennsShaded4", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,false,false,true,false]);
        expect(prob.venns[1][0]).toEqual([true,false,false,false,false,true,false]);
    });
});

describe("createVennsSelected4", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob.venns[1][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion4", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(false);
    });
});

//fifth iteration
premises = ["some 1 are 2", "some 3 are 2 and not 1"];
conclusion = "some 2 exist";
problemJSON = generateJSON(categories,premises,conclusion);
prob = new Problem(problemJSON, user);

describe("createVennsShaded5", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob.venns[1][0]).toEqual([false,false,false,false,false,false,false]);
    });
});

describe("createVennsSelected5", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,1,0,0,1]);
        expect(prob.venns[1][1]).toEqual([0,0,0,1,0,2,1]);
    });
});

describe("evaluateConclusion5", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(true);
    });
});

//sixth iteration
premises = ["no 1 are 2", "no 2 are 3", "no 1 are not 2 and not 3"];
conclusion = "all 1 are 3";
problemJSON = generateJSON(categories,premises,conclusion);
prob = new Problem(problemJSON, user);

describe("createVennsShaded6", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,true,false,false,true]);
        expect(prob.venns[1][0]).toEqual([false,false,false,true,false,true,true]);
        expect(prob.venns[2][0]).toEqual([true,false,false,true,false,false,true]);
    });
});

describe("createVennsSelected6", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob.venns[1][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob.venns[2][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion6", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(true);
    });
});

//seventh iteration
premises = ["no 1 are 2", "no 2 are 3", "no 1 are not 2 and not 3"];
conclusion = "all 1 are 3 and 2";
problemJSON = generateJSON(categories,premises,conclusion);
prob = new Problem(problemJSON, user);

describe("createVennsShaded7", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,true,false,false,true]);
        expect(prob.venns[1][0]).toEqual([false,false,false,true,false,true,true]);
        expect(prob.venns[2][0]).toEqual([true,false,false,true,false,true,true]);
    });
});

describe("createVennsSelected7", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob.venns[1][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob.venns[2][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion7", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(false);
    });
});

//eigth iteration
premises = ["some 1 are 2 and not 3", "no 2 are 3", "no 1 are not 2 and not 3"];
conclusion = "some not 3 are 2 and 1";
problemJSON = generateJSON(categories,premises,conclusion);
prob = new Problem(problemJSON, user);

describe("createVennsShaded8", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob.venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob.venns[1][0]).toEqual([false,false,false,false,false,true,true]);
        expect(prob.venns[2][0]).toEqual([true,false,false,false,false,true,true]);
    });
});

describe("createVennsSelected8", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob.venns[0][1]).toEqual([0,0,0,1,0,0,0]);
        expect(prob.venns[1][1]).toEqual([0,0,0,1,0,0,0]);
        expect(prob.venns[2][1]).toEqual([0,0,0,1,0,0,0]);
    });
});

describe("evaluateConclusion8", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob.evaluateConclusion()).toEqual(true);
    });
});



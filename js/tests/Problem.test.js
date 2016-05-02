var user = new User();
var categories = [{'plural':"squibs"},{'plural':"muggles"},{'plural':"purebloods"}];
var premises = [null,null,null,null,null,null,null,null];
premises[0] = ["some 1 are 2","no 2 are 3"];
premises[1] = ["some 1 are 2 and 3", "all 2 are 3"];
premises[2] = ["no 1 are not 2 and 3", "all not 2 are 3"];
premises[3] = ["no not 1 are 2 and 3", "all not 2 are 3"];
premises[4] = ["some 1 are 2", "some 3 are 2 and not 1"];
premises[5] = ["no 1 are 2", "no 2 are 3", "no 1 are not 2 and not 3"];
premises[6] = ["no 1 are 2", "no 2 are 3", "no 1 are not 2 and not 3"];
premises[7] = ["some 1 are 2 and not 3", "no 2 are 3", "no 1 are not 2 and not 3"];
var conclusion = [null,null,null,null,null,null,null,null];
conclusion[0]= "some 2 are not 3";
conclusion[1]= "some 2 are not 3";
conclusion[2]= "all 1 are 2";
conclusion[3]= "all not 1 are 2";
conclusion[4]= "some 2 exist";
conclusion[5]= "all 1 are 3";
conclusion[6]= "all 1 are 3 and 2";
conclusion[7]= "some not 3 are 2 and 1";
var JSON = [null,null,null,null,null,null,null,null];
var prob = [null,null,null,null,null,null,null,null];



var generateJSON = function(cats, prems, con){
    var temp = {
        categories: cats,
        premises: prems,
        conclusion: con
    }
    return temp;
}

for (var i = 0; i < 8; i++){
    JSON[i] = generateJSON(categories,premises[i],conclusion[i]);  
    prob[i] = new Problem(JSON[i],user); 
}

//Take representative sample of problem structures and test for correct venn diagram construction/evaluation


describe("createVennsShaded1", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[0].venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob[0].venns[1][0]).toEqual([false,false,false,false,false,true,true]);
    });
});

describe("createVennsSelected1", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[0].venns[0][1]).toEqual([0,0,0,1,0,0,1]);
        expect(prob[0].venns[1][1]).toEqual([0,0,0,1,0,0,0]);
    });
});

describe("evaluateConclusion1", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[0].evaluateConclusion()).toEqual(true);
    });
});

//second iteration
describe("createVennsShaded2", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[1].venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob[1].venns[1][0]).toEqual([false,true,false,true,false,false,false]);
    });
});

describe("createVennsSelected2", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[1].venns[0][1]).toEqual([0,0,0,0,0,0,1]);
        expect(prob[1].venns[1][1]).toEqual([0,0,0,0,0,0,1]);
    });
});

describe("evaluateConclusion2", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[1].evaluateConclusion()).toEqual(false);
    });
});

//third iteration
describe("createVennsShaded3", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[2].venns[0][0]).toEqual([false,false,false,false,true,false,false]);
        expect(prob[2].venns[1][0]).toEqual([true,false,false,false,true,false,false]);
    });
});

describe("createVennsSelected3", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[2].venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob[2].venns[1][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion3", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[2].evaluateConclusion()).toEqual(true);
    });
});


//fourth iteration
describe("createVennsShaded4", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[3].venns[0][0]).toEqual([false,false,false,false,false,true,false]);
        expect(prob[3].venns[1][0]).toEqual([true,false,false,false,false,true,false]);
    });
});

describe("createVennsSelected4", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[3].venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob[3].venns[1][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion4", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[3].evaluateConclusion()).toEqual(false);
    });
});

//fifth iteration
describe("createVennsShaded5", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[4].venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob[4].venns[1][0]).toEqual([false,false,false,false,false,false,false]);
    });
});

describe("createVennsSelected5", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[4].venns[0][1]).toEqual([0,0,0,1,0,0,1]);
        expect(prob[4].venns[1][1]).toEqual([0,0,0,1,0,2,1]);
    });
});

describe("evaluateConclusion5", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[4].evaluateConclusion()).toEqual(true);
    });
});

//sixth iteration
describe("createVennsShaded6", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[5].venns[0][0]).toEqual([false,false,false,true,false,false,true]);
        expect(prob[5].venns[1][0]).toEqual([false,false,false,true,false,true,true]);
        expect(prob[5].venns[2][0]).toEqual([true,false,false,true,false,false,true]);
    });
});

describe("createVennsSelected6", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[5].venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob[5].venns[1][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob[5].venns[2][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion6", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[5].evaluateConclusion()).toEqual(true);
    });
});

//seventh iteration
describe("createVennsShaded7", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[4].venns[0][0]).toEqual([false,false,false,true,false,false,true]);
        expect(prob[4].venns[1][0]).toEqual([false,false,false,true,false,true,true]);
        expect(prob[4].venns[2][0]).toEqual([true,false,false,true,false,true,true]);
    });
});

describe("createVennsSelected7", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[6].venns[0][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob[6].venns[1][1]).toEqual([0,0,0,0,0,0,0]);
        expect(prob[6].venns[2][1]).toEqual([0,0,0,0,0,0,0]);
    });
});

describe("evaluateConclusion7", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[6].evaluateConclusion()).toEqual(false);
    });
});

//eigth iteration
describe("createVennsShaded8", function() {
    it("create internal represenation of shaded areas of venns from premises", function(){
        expect(prob[7].venns[0][0]).toEqual([false,false,false,false,false,false,false]);
        expect(prob[7].venns[1][0]).toEqual([false,false,false,false,false,true,true]);
        expect(prob[7].venns[2][0]).toEqual([true,false,false,false,false,true,true]);
    });
});

describe("createVennsSelected8", function() {
    it("create internal represenation of selected areas of venns from premises", function(){
        expect(prob[7].venns[0][1]).toEqual([0,0,0,1,0,0,0]);
        expect(prob[7].venns[1][1]).toEqual([0,0,0,1,0,0,0]);
        expect(prob[7].venns[2][1]).toEqual([0,0,0,1,0,0,0]);
    });
});

describe("evaluateConclusion8", function(){
    it("check the validity of conclusion from internal venns",function(){
        expect(prob[7].evaluateConclusion()).toEqual(true);
    });
});



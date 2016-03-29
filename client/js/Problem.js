/* 
 * Creates Venn diagrams in the form of two boolean arrays from premise statments
 */
 var Problem = function(problem){
    this.categories = [];
    for(var i = 0; i < problem.categories.length; i++){
        this.categories.push(problem.categories[i].plural);
    }
    this.currCategory = 0;
    this.premises = problem.premises;
    this.venns = [];
    this.createVenns(this.premises);
    this.statements = [];
    this.vennDiagram = new Venn(5, 5, 80, this.categories);
    this.createStatements();
    this.currPremise = 0;
    this.conclusion = problem.conclusion;
    var self = this;

    //attach listeners to buttons and enter key
    $('#vennCheckButton').click(this.checkVenn.bind(this));
    $('#catCheckButton').show();
    $('#catCheckButton').click(this.checkCategories.bind(this));
    $(document).keydown(function(e){
        console.log();
        var key = e.which || e.keyCode;
        if (key === 13) {
            self.submit();
        }
    });
};

//Handles enter key press and calls the correct checking method
Problem.prototype.submit = function(){
    if (this.currCategory >= 3){
        this.checkVenn();
    } else{
        this.checkCategories();
    }
}

//function called while drawing venn from selected categories
//currently draws unconditionally
Problem.prototype.checkCategories = function(){
    if(this.currCategory >= 3){
        return;
    }
    var category = this.categories[this.currCategory];
    var correct = true;
    for(var i =0; i < this.statements.length; i++){
        if(!this.statements[i].isHighlightedCorrectly(category)){
            correct = false;
        }
    }

    if(correct){
        this.currCategory++;
        for(var i=0; i < this.statements.length; i++){
            if(this.currCategory >= 3){
                this.statements[i].deactivate();
            } else{
                this.statements[i].incrCategory();
            }
        }
        this.vennDiagram.drawCircle(this.currCategory);
        $(".alert").hide();
        if(this.currCategory >= 3){
            this.startVenn();
        }
    } else{
        $("#statements-wrong").show();
    }
}

Problem.prototype.startVenn = function(){
    this.vennDiagram.activate();
    $("#statements-right").show();
    this.statements[this.currPremise].addArrow();
    $('#vennCheckButton').show();
    $('#catCheckButton').hide();
}

//check if current user venn matches markup of any premise
//output premise matched
Problem.prototype.checkVenn = function(){
    var match = true;
    for (var j = 0; j < this.venns[this.currPremise][0].length; j++){
        if (this.vennDiagram.shaded[j] != this.venns[this.currPremise][0][j]){ 
            match = false;
            break;
        }
    }
    if (match){
        $("#venn-wrong").hide();
        this.statements[this.currPremise].removeArrow();
        this.currPremise++;
        if(this.currPremise >= this.statements.length){
            $('#venn-right').show();
            $('#vennCheckButton').hide();
            this.vennDiagram.deactivate();
            this.showConclusion();
        } else{
            this.statements[this.currPremise].addArrow();
        }
    } else{
        $("#venn-wrong").show();
    }
}

Problem.prototype.replaceCategories = function(s){
    var statement = s;
    statement = statement.replace("1", this.categories[0]);
    statement = statement.replace("2", this.categories[1]);
    statement = statement.replace("3", this.categories[2]);
    return statement;
}

Problem.prototype.showConclusion = function(){
    $('#conclusion-container').show();
    var conclusion = this.replaceCategories(this.conclusion);
    $('#conclusion').append(conclusion);
}

//Convert problem skeleton and category names into grammatical premises
//Create Statement objects with grammatical premises
//Currently passes hardcoded premises
Problem.prototype.createStatements = function(){
    for(var i = 0; i < this.premises.length; i++){
        var statement = this.replaceCategories(this.premises[i]);
        this.statements.push(new Statement(statement));
    }
};

//outputs venn diagram arrays via alert
//order: premise 1 shade, premise 1 select, premise 2 shade ... user shade, user select
//for debugging purposes
Problem.prototype.spit = function(){
    for (var i = 0; i < this.venns.length; i++){
        alert(this.venns[i][0]);
        alert(this.venns[i][1]);
    }
    alert(this.vennDiagram.shaded);
    alert(this.vennDiagram.marked);
};
     
//creates lists of shaded/selected at each premise stage
//should be called in constructor
//currently needs a little bit of tightening the logic
Problem.prototype.createVenns = function(states){
    
    //create Venn for each premise
    var numPremises = states.length;
    for (var i = 0; i < numPremises; i++){
        
        //init shade/select arryas
        var newVennShade = [false,false,false,false,false,false,false];
        var newVennSelect = [false,false,false,false,false,false,false,false,false,false];
        if (i > 0){
            newVennShade = this.venns[i-1][0].slice();
            newVennSelect = this.venns[i-1][1].slice();
        }


        //parse statement into words, assign opperators and categories
        var splicedState = states[i].split(" ");
        var opp = splicedState[0];
        splicedState.splice(0,1);
        var firstCat = splicedState[0];
        var firstNegated = false;
        if (firstCat == "not"){
            firstCat = splicedState[1];
            firstNegated = true;
            splicedState.splice(0,1);
        }
        splicedState.splice(0,2);
        var secondCat = splicedState[0];
        var secondNegated = false;
        if (secondCat == "not"){
            secondCat = splicedState[1];
            secondNegated = true;
            splicedState.splice(0,1);
        }
        splicedState.splice(0,1);
        var thirdCat = null;
        var thirdNegated = false;
        var secondOpp = null;
        if (splicedState.length > 0){
           secondOpp = splicedState[0];
           thirdCat = splicedState[1];
           if (thirdCat == "not"){
               thirdCat = splicedState[2];
               thirdNegated = true;
           }
        }
        
        //check
        /*
        alert(opp);
        alert(firstCat);
        alert(secondCat);
        alert(secondOpp);
        alert(thirdCat);
        */

        //Define segments of the venn diagram
        var A,B,C,AB,BC,AC,ABC;
        ABC = 6;
        if (firstCat == 1){
            A = 0;
            BC = 5;
            if (secondCat == 2){
                B = 1;
                AB = 3;
                C = 2;
                AC = 4;
            }
            else{
                B = 2;
                C = 1;
                AB = 4;
                AC = 3;   
            }
        } 
        else if (firstCat == 2){
            A = 1;
            BC = 4;
            if (secondCat == 1){
                B = 0;
                AB = 3;
                C = 2;
                AC = 5;
            }
            else{
                B = 2;
                C = 0;
                AB = 5;
                AC = 3;   
            }
        
        }
        else if (firstCat == 3){
            A = 2;
            BC = 3;
            if (secondCat == 2){
                B = 1;
                AB = 5;
                C = 0;
                AC = 4;
            }
            else{
                B = 0;
                C = 1;
                AB = 4;
                AC = 5;   
            }
        }
        
        
        //determine shading/selecting
        switch(opp){
            case "all":
                if (thirdCat!=null){
                    switch(secondOpp){
                        case "and":
                            if (secondNegated){
                                
                                //shade AB, AC, ABC
                                if (thirdNegated){
                                    newVennShade[AB] = true;
                                    newVennShade[AC] = true;
                                    newVennShade[ABC] = true;
                                }
                                //shade A, AB, ABC
                                else{
                                    newVennShade[A] = true;
                                    newVennShade[AB] = true;
                                    newVennShade[ABC] = true;
                                }
                            }
                            else{
                                //shade A, AC, ABC
                                if (thirdNegated){
                                    newVennShade[A] = true;
                                    newVennShade[AC] = true;
                                    newVennShade[ABC] = true;
                                }
                                //shade A, AB, AC
                                else{
                                    newVennShade[A] = true;
                                    newVennShade[AB] = true;
                                    newVennShade[AC] = true;
                                }
                            }
                        break;
                        case "or":
                            if (secondNegated){
                                //shade A, ABC
                                if (thirdNegated){
                                    newVennShade[A] = true;
                                    newVennShade[ABC] = true;
                                }
                                //shade AC, AB
                                else{
                                    newVennShade[AC] = true;
                                    newVennShade[AB] = true;
                                }
                            }
                            else{
                                if (thirdNegated){
                                    newVennShade[AC] = true;
                                    newVennShade[AB] = true;
                                }
                                else{
                                    newVennShade[A] = true;
                                    newVennShade[ABC] = true;
                                }
                            }
                        break;  
                    }
                }
                else{
                    if (firstNegated){
                        //shade BC, ABC
                        if (secondNegated){
                            newVennShade[BC] = true;
                            newVennShade[ABC] = true;
                        }
                        //shade C, AC
                        else{
                            newVennShade[C] = true;
                            newVennShade[AC] = true;     
                        }
                    }
                    else{
                        //shade AB, ABC
                        if (secondNegated){
                            newVennShade[AB] = true;
                            newVennShade[ABC] = true;
                        }
                        //shade A, select AB, ABC
                        else{
                            newVennShade[A] = true;
                            newVennSelect[AB] = true;
                            newVennSelect[ABC] = true;
                        }
                    }
                }
            break;
            case "some":
                if (thirdCat!=null){
                    switch(secondOpp){
                        case "and":
                            if (secondNegated){
                                if (thirdNegated){
                                    newVennSelect[A] = true;
                                }
                                else{
                                    newVennSelect[AC] = true;
                                }
                            }
                            else{
                                if (thirdNegated){
                                    newVennSelect[AB] = true;
                                }
                                else{
                                    newVennSelect[ABC] = true;
                                }
                            }
                        break;
                        /*
                        case "or":
                            if (secondNegated){
                                if (thirdNegated){
                                    newVennShade[A] = true;
                                    newVennShade[ABC] = true;
                                }
                                else{
                                    newVennShade[AC] = true;
                                    newVennShade[AB] = true;
                                }
                            }
                            else{
                                if (thirdNegated){
                                    newVennShade[AC] = true;
                                    newVennShade[AB] = true;
                                }
                                else{
                                    newVennShade[A] = true;
                                    newVennShade[ABC] = true;
                                }
                            }
                        break;  
                        */
                    }
                }
                else{
                    if (firstNegated){
                        //select C
                        if (secondNegated){
                            newVennSelect[C] = true;
                        }
                        //select B, BC
                        else{
                            newVennSelect[B] = true;
                            newVennSelect[BC] = true;
                        }
                    }
                    else{
                        //select A, AC
                        if (secondNegated){
                        newVennSelect[A] = true;
                        newVennSelect[AC] = true;     
                        }
                        //select AB, ABC
                        else{
                            newVennSelect[AB] = true;
                            newVennSelect[ABC] = true;
                        }
                    }
                }
            break;
            case "no":
                if (thirdCat!=null){
                }
                else{
                    if (firstNegated){
                        //shade C
                        if (secondNegated){
                            newVennShade[C] = true;
                        }
                        //shade B, BC
                        else{
                            newVennShade[B] = true;
                            newVennShade[BC] = true;
                        }
                    }
                    else{
                        //shade AC, A
                        if (secondNegated){
                            newVennShade[AC] = true;
                            newVennShade[A] = true;
                        }
                        //shade AB, ABC
                        else{
                            newVennShade[AB] = true;
                            newVennShade[ABC] = true;
                        }
                    }
                }
            break;
        }
        //create new pair of boolean arrays, add to venns
        var lists = [];
        lists.push(newVennShade);
        lists.push(newVennSelect);
        this.venns.push(lists);
    } 
}
/* 
 * Creates Venn diagrams in the form of two boolean arrays from premise statments
 */
 var Problem = function(statements){
    this.statements = statements;
    this.venns = [];
    var self = this;
    
    //outputs venn diagram arrays via alert
    this.spit = function(){
        for (var i = 0; i < this.venns.length; i++){
            alert(this.venns[i][0]);
            alert(this.venns[i][1]);
        }
    };
     
    createVenns = function(states){
        
        //create Venn for each premise
        var numPremises = states.length;
        for (var i = 0; i < numPremises; i++){
            
            //init shade/select arryas
            var newVennShade = [false,false,false,false,false,false,false];
            var newVennSelect = [false,false,false,false,false,false,false,false,false,false];
            
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
            alert(opp);
            alert(firstCat);
            alert(secondCat);
            alert(secondOpp);
            alert(thirdCat);
        
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
            self.venns.push(lists);
        } 
    }(this.statements);
 };

$(document).ready(function(){
    
    //hardcode premises
    var statementList = ["some 2 are 3 and 1","no 1 are 3"];
    
    //display premises in html
    var body = $("body");
    body.empty();
      for (var i = 0; i < statementList.length; i++){ 
        body.append($("<p>"+statementList[i]+"</p>"));
    }
    
    //init problem with hardcoded premises
    var p = new Problem(statementList);
    var states = p.statements;
  
    //display venn lists
    p.spit();
});
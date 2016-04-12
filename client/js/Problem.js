/*
 * Creates Venn diagrams in the form of two boolean arrays from premise statments
 */
 var Problem = function(problem, user){
    this.user = user;
    this.categories = [];
    for(var i = 0; i < problem.categories.length; i++){
        this.categories.push(problem.categories[i].plural);
    }
    this.currCategory = 0;
    this.selectedCategories = [];
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
    $('#validButton').click(self.checkValid.bind(self));
    $('#invalidButton').click(self.checkInvalid.bind(self));
    $('#catCheckButton').click(this.checkCategories.bind(this));
    $('#vennRevertButton').click(this.revertVenn.bind(self));
    $('#newProblemButton').click(this.replace.bind(self));
    $(document).on('keydown', function(e){
        var key = e.which || e.keyCode;
        if (key === 13) {
            self.submit();
        }
    });
};

Problem.prototype.replace = function(){
    var self = this;
    $('.statements').html("");
    $('#conclusion').html("");
    $('.alert').hide();
    $('.check').each(function(){
        $(this).replaceWith($(this).clone());
    });
    $('#newProblemButton').hide();
    $(document).off();
    $('#conclusion-container').hide();
    var newCanvas = $('<canvas id="c" height = "300px" width = "500px"></canvas>');
    $('canvas').replaceWith(newCanvas);
    canvas = newCanvas.get(0);
    ctx = canvas.getContext("2d");
    this.user.getProblem();
}

Problem.prototype.checkInvalid = function(){
    var correct = !this.evaluateConclusion();
    $('#newProblemButton').show();
    $('#conclusion-buttons').hide();
    $("#conclusion-right").hide();
    $("#conclusion-wrong").hide();
    if(correct){
        $("#conclusion-right").show();
    } else{
        $("#conclusion-wrong").show();
    }
}

Problem.prototype.checkValid = function(){
    var correct = this.evaluateConclusion();
    $('#conclusion-buttons').hide();
    $("#conclusion-right").hide();
    $("#conclusion-wrong").hide();
    $('#newProblemButton').show();
    if(correct){
        $("#conclusion-right").show();
    } else{
        $("#conclusion-wrong").show();
    }
}

//Handles enter key press and calls the correct checking method
Problem.prototype.submit = function(){
    if (this.selectedCategories.length >= 3){
        this.checkVenn();
    } else{
        this.checkCategories();
    }
}

//function called while drawing venn from selected categories
//currently draws unconditionally
Problem.prototype.checkCategories = function(){
    if(this.selectedCategories.length >= 3){
        return;
    }
    var correct = false;
    var correctCat = -1;
    var missed;
    for(var i = 0; i < this.categories.length; i++){
        var category = this.categories[i];
        var match = true;
        missed = false;
        for(var j = 0; j < this.statements.length; j++){
            var highlight = this.statements[j].isHighlightedCorrectly(category);
            if(highlight===0){
                match = false;
                break;
            } else if(highlight===1){
                missed = true;
            } else{

            }
        }
        if(match && this.selectedCategories.indexOf(category) < 0 && !missed){
            correct = true;
            correctCat = i;
            this.selectedCategories.push(category);
            break;
        }
    }
    var catNum = this.selectedCategories.length;
    if(correct){
        for(var i=0; i < this.statements.length; i++){
            if(catNum >= 3){
                this.statements[i].deactivate();
            } else{
                this.statements[i].incrCategory();
            }
        }
        var lastCat = this.selectedCategories[catNum-1];
        var toDraw = this.categories.indexOf(lastCat) + 1;
        this.vennDiagram.drawCircle(toDraw);
        $(".alert").hide();
        if(catNum >= 3){
            this.startVenn();
        }
    } else{
        if(missed){
            $("#statements-wrong").hide();
            $("#statements-missed").show();
        } else{
            $("#statements-wrong").show();
            $("#statements-missed").hide();
        }
    }
}

Problem.prototype.startVenn = function(){
    this.vennDiagram.activate();
    $("#statements-right").show();
    this.statements[this.currPremise].addArrow();
    $('#vennCheckButton').show();
    $('#vennRevertButton').show();
    $('#catCheckButton').hide();
}

Problem.prototype.revertVenn = function(){
    this.vennDiagram.revertMarkup();
    this.vennDiagram.colorVenn();
}

//check if current user venn matches markup of any premise
//output premise matched
Problem.prototype.checkVenn = function(){
    var match = true;
    var shadedCheck = this.venns[this.currPremise][0];
    var selectedCheck = this.venns[this.currPremise][1];
    for (var j = 0; j < shadedCheck.length; j++){
        if (this.vennDiagram.shaded[j] != shadedCheck[j]){
            match = false;
            break;
        }
    }
    for (var j = 0; j < selectedCheck.length; j++){
        for (var k = 0; k < selectedCheck.length; k++){
            if (selectedCheck[k] == selectedCheck[j] && this.vennDiagram.marked[k] != this.vennDiagram.marked[j]){
                match = false;
                break;

            }
            if (this.vennDiagram.marked[k] == this.vennDiagram.marked[j] && selectedCheck[k] != selectedCheck[j]){
                match = false;
                break;
            }
        }
    }


    if (match){
        $("#vennRevertButton").html('Revert');
        $("#venn-wrong").hide();
        this.vennDiagram.saveMarkup();
        this.statements[this.currPremise].removeArrow();
        this.currPremise++;
        if(this.currPremise >= this.statements.length){
            $('#venn-right').show();
            $('#vennCheckButton').hide();
            $("#vennRevertButton").hide();
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
    $('#conclusion-buttons').show();
    var conclusion = this.replaceCategories(this.conclusion);
    var splicedCon = conclusion.split(" ");
    if (splicedCon[1] == 'not'){
        splicedCon.splice(1,1);
        splicedCon[1] = "non-" + splicedCon[1];
    }
    conclusion = splicedCon.join(" ");
    $('#conclusion').append(conclusion);
}

//Convert problem skeleton and category names into grammatical premises
//Create Statement objects with grammatical premises
//Currently passes hardcoded premises
Problem.prototype.createStatements = function(){
    for(var i = 0; i < this.premises.length; i++){
        var statement = this.replaceCategories(this.premises[i]);
        var spliced = statement.split(" ");
        if (spliced[1] == "not"){
            spliced.splice(1,1);
            spliced[1] = "non-" + spliced[1];
        }
        var final = spliced.join(" ");
        //this.statements.push(new Statement(statement));
        this.statements.push(new Statement(final));
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

//determines if 1 or 2 segments passed are selected
//expects null for index2 if 1 segment desired
//will return false if selected region is part of multiple select (unless region is segment1+segment2)
Problem.prototype.checkSelected = function(selected, index1, index2){
    var value = selected[index1];
    if (index2 == null){
        if (value <= 0) return false;
        for (var i = 0; i < selected.length; i++){
            if (i != index1 && selected[i] == value) return false;
        }
    }
    else{
        var value2 = selected[index2];
        if (value == value2){
            if (value == 0) return false;
            for (var i = 0; i < selected.length; i++){
                if (i != index1 && i != index2 && selected[i] == value) return false;
            }
        }
        else{
            if (value == 0){
                for (var i = 0; i < selected.length; i++){
                    if (i != index2 && selected[i] == value2) return false;
                }
            }
            else if (value2 == 0){
                for (var i = 0; i < selected.length; i++){
                    if (i != index1 && selected[i] == value) return false;
                }
            }
            else{
                var cushion = true;
                for (var i = 0; i < selected.length; i++){
                    if (i != index1 && selected[i] == value) cushion = false;
                }
                for (var i = 0; i < selected.length; i++){
                    if (i != index2 && selected[i] == value2) return cushion;
                }
            }


        }
    }
    return true;
}

//returns a unique integer to use in select arrays
Problem.prototype.maxValue = function(selected){
    var max = 0;
    for (var i = 0; i < selected.length; i++){
        max = Math.max(selected[i], max);
    }
    return max;
}

//does a lot of branching 'if' statements to see if conclusion is logically entailed by internal venns
Problem.prototype.evaluateConclusion = function(){
    var splicedCon = this.conclusion.split(" ");
    var opp = splicedCon[0];
    splicedCon.splice(0,1);
    var firstCat = splicedCon[0];
    var firstNegated = false;
    var secondOpp = null;
    var secondCat = null;
    var thirdCat = null;
    var exist = false;
    var secondNegated = false;
    var thirdNegated = false;
    if (firstCat == "not"){
        firstCat = splicedCon[1];
        firstNegated = true;
        splicedCon.splice(0,1);
    }
    splicedCon.splice(0,1);
    if (splicedCon[0] == 'and'){
        secondOpp = 'and';
    }
    if (splicedCon[0] == 'exist'){
        exist = true
    }
    else{
        splicedCon.splice(0,1);
        var secondCat = splicedCon[0];
        if (secondCat == "not"){
            secondCat = splicedCon[1];
            secondNegated = true;
            splicedCon.splice(0,1);
        }
        splicedCon.splice(0,1);
        if (splicedCon.length > 0){
            if (splicedCon[0] == 'exist'){
                exist = true;
            }
            else{
                if (secondOpp == null) secondOpp = splicedCon[0];
                thirdCat = splicedCon[1];
                if (thirdCat == "not"){
                    thirdCat = splicedCon[2];
                    thirdNegated = true;
                }
            }
        }
    }
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

    switch(opp){
        case "all":
                if (thirdCat!=null){
                    switch(secondOpp){
                        case "and":
                            if (firstNegated){
                                if (secondNegated){
                                    //shade B, C, BC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[C] == true && this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade B, BC
                                    else{
                                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade C, BC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[C] == true && this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade B, C
                                    else{
                                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[C] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //shade AB, AC, ABC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[AC] == true && this.vennDiagram.shaded[ABC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade A, AB, ABC
                                    else{
                                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[A] == true && this.vennDiagram.shaded[ABC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade A, AC, ABC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[A] == true && this.vennDiagram.shaded[AC] == true && this.vennDiagram.shaded[ABC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade A, AB, AC
                                    else{
                                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[AC] == true && this.vennDiagram.shaded[A] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        break;
                        case "or":
                            if (firstNegated){
                                if (secondNegated){
                                    //shade BC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade B, C
                                    else{
                                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[C] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade B, C
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[C] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade BC
                                    else{
                                        if (this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //shade A, ABC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[A] == true && this.vennDiagram.shaded[ABC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade AC, AB
                                    else{
                                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[AC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade AB, AC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[AC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade A, ABC
                                    else{
                                        if (this.vennDiagram.shaded[A] == true && this.vennDiagram.shaded[ABC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        break;
                    }
                }
            else{
                if (firstNegated){
                    //shade B, BC
                    if (secondNegated){
                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[BC] == true){
                            return true;
                        }
                        else{
                            return false;
                        }

                    }
                    //shade C
                    else{
                        if (this.vennDiagram.shaded[C] == true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }
                else{
                    //shade AB, ABC
                    if (secondNegated){
                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[ABC] == true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                    //shade A, AC
                    else{
                        if (this.vennDiagram.shaded[A] == true && this.vennDiagram.shaded[AC] == true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }
            }
        break;

        case "some":

                if (thirdCat!=null){

                    switch(secondOpp){
                        case "and":
                            if (firstNegated){
                                if (secondNegated){

                                    //impossible
                                    if (thirdNegated){
                                        return false;
                                    }

                                    //select C
                                    else{
                                        return this.checkSelected(this.vennDiagram.marked, C, null);
                                    }
                                }
                                else{
                                    //select B
                                    if (thirdNegated){
                                        return this.checkSelected(this.vennDiagram.marked, B, null);
                                    }
                                    //select BC
                                    else{
                                        return this.checkSelected(this.vennDiagram.marked, BC, null);
                                    }
                                }
                            }
                            else{
                                if (secondNegated){

                                    //select A
                                    if (thirdNegated){
                                        return this.checkSelected(this.vennDiagram.marked, A, null);
                                    }

                                    //select AC
                                    else{
                                        return this.checkSelected(this.vennDiagram.marked, AC, null);
                                    }
                                }
                                else{
                                    //select AB
                                    if (thirdNegated){
                                        return this.checkSelected(this.vennDiagram.marked, AB, null);
                                    }
                                    //select ABC
                                    else{
                                        return this.checkSelected(this.vennDiagram.marked, ABC, null);
                                    }
                                }
                            }
                        break;
                        /*
                        case "or":

                        //NOT HANDLED

                            if (secondNegated){
                                //shade A, ABC
                                if (thirdNegated){
                                    return this.checkSelected(this.vennDiagram.marked, A, null);
                                }
                                //shade AC, AB
                                else{
                                    return this.checkSelected(this.vennDiagram.marked, A, null);
                                }
                            }
                            else{
                                if (thirdNegated){
                                    return this.checkSelected(this.vennDiagram.marked, A, null);
                                }
                                else{
                                    return this.checkSelected(this.vennDiagram.marked, A, null);
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
                        return this.checkSelected(this.vennDiagram.marked, C, null);
                    }
                    //select B, BC
                    else{
                        return this.checkSelected(this.vennDiagram.marked, B, BC);
                    }
                }
                else{
                    //select A, AC
                    if (secondNegated){
                        return this.checkSelected(this.vennDiagram.marked, A, AC);
                    }
                    //select AB, ABC
                    else{
                        return this.checkSelected(this.vennDiagram.marked, AB, ABC);
                    }
                }
            }
        break;

        case "no":
                if (thirdCat!=null){
                    switch(secondOpp){
                        case "and":
                            if (firstNegated){
                                if (secondNegated){
                                    //Impossible
                                    if (thirdNegated){
                                        return false;
                                    }
                                    //shade C
                                    else{
                                        if (this.vennDiagram.shaded[C] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade B
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[B] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade BC
                                    else{
                                        if (this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //shade A
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[A] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade AC
                                    else{
                                        if (this.vennDiagram.shaded[AC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade AB
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[AB] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade ABC
                                    else{
                                        if (this.vennDiagram.shaded[ABC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        break;
                        case "or":
                            if (firstNegated){
                                if (secondNegated){
                                    //shade B, C
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[C] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade BC
                                    else{
                                        if (this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade BC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[BC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade B, C
                                    else{
                                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[C] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //shade AB, AC
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[AC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade ABC, A
                                    else{
                                        if (this.vennDiagram.shaded[ABC] == true && this.vennDiagram.shaded[A] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                                else{
                                    //shade ABC, A
                                    if (thirdNegated){
                                        if (this.vennDiagram.shaded[ABC] == true && this.vennDiagram.shaded[A] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                    //shade AB, AC
                                    else{
                                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[AC] == true){
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        break;
                    }
                }
            else{
                if (firstNegated){
                    //shade C
                    if (secondNegated){
                        if (this.vennDiagram.shaded[C] == true){
                           return true;
                        }
                        else{
                            return false;
                        }
                    }
                    //shade BC, B
                    else{
                        if (this.vennDiagram.shaded[B] == true && this.vennDiagram.shaded[BC] == true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }
                else{
                    //shade A, AC
                    if (secondNegated){
                        if (this.vennDiagram.shaded[A] == true && this.vennDiagram.shaded[AC] == true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                    //shade AB, ABC
                    else{
                        if (this.vennDiagram.shaded[AB] == true && this.vennDiagram.shaded[ABC] == true){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }
            }
        break;
    }

}



//does a lot of branching 'if' statements to create internal representations of venn diagrams
//venns are stored in pairs of arrays corresponding to shaded regions and selected regions
//venns are created premise by premise
Problem.prototype.createVenns = function(states){

    //loop for each premise
    var numPremises = states.length;
    for (var i = 0; i < numPremises; i++){

        //init shade/select arryas
        var newVennShade = [false,false,false,false,false,false,false];
        var newVennSelect = [0,0,0,0,0,0,0];

        //new array builds on previous arrays, init to most recent completed premise
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


        //Define segments of the venn diagram
        var A,B,C,AB,BC,AC,ABC;
        ABC = 6;
        if (firstCat == 1){
            A = 0;
            BC = 5;
            if (secondCat == 2){
                B = 1;
                AB = 3;
                AABB = 7;
                C = 2;
                AC = 4;
                AACC = 8;
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
            BBCC = 7;
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
                            if (firstNegated){
                                if (secondNegated){

                                    //shade B, C, BC
                                    if (thirdNegated){
                                        newVennShade[B] = true;
                                        newVennShade[C] = true;
                                        newVennShade[BC] = true;
                                    }
                                    //shade B, BC
                                    else{
                                        newVennShade[B] = true;
                                        newVennShade[BC] = true;
                                    }
                                }
                                else{
                                    //shade C, BC
                                    if (thirdNegated){
                                        newVennShade[C] = true;
                                        newVennShade[BC] = true;
                                    }
                                    //shade B, C
                                    else{
                                        newVennShade[B] = true;
                                        newVennShade[C] = true;
                                    }
                                }
                            }
                            else{
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
                            }
                        break;
                        case "or":
                            if (firstNegated){
                                if (secondNegated){
                                    //shade BC
                                    if (thirdNegated){
                                        newVennShade[BC] = true;
                                    }
                                    //shade B, C
                                    else{
                                        newVennShade[C] = true;
                                        newVennShade[B] = true;
                                    }
                                }
                                else{
                                    //shade B, C
                                    if (thirdNegated){
                                        newVennShade[C] = true;
                                        newVennShade[B] = true;
                                    }
                                    //shade BC
                                    else{
                                        newVennShade[BC] = true;
                                    }
                                }
                            }
                            else{
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
                                    //shade AC, AB
                                    if (thirdNegated){
                                        newVennShade[AC] = true;
                                        newVennShade[AB] = true;
                                    }
                                    //shade A, ABC
                                    else{
                                        newVennShade[A] = true;
                                        newVennShade[ABC] = true;
                                    }
                                }
                            }
                        break;
                    }
                }
                else{
                    if (firstNegated){
                        //shade BC, B
                        if (secondNegated){
                            newVennShade[BC] = true;
                            newVennShade[B] = true;
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
                        //shade A, AC
                        else{
                            newVennShade[A] = true;
                            newVennShade[AC] = true;
                        }
                    }
                }
            break;
            case "some":
                var newVal = this.maxValue(newVennSelect) + 1;
                if (thirdCat!=null){
                    switch(secondOpp){
                        case "and":
                            if (firstNegated){
                                if (secondNegated){
                                    //do nothing
                                    if (thirdNegated){

                                    }
                                    //select C
                                    else{
                                        newVennSelect[C] = newVal;
                                    }
                                }
                                else{
                                    //select B
                                    if (thirdNegated){
                                        newVennSelect[B] = newVal;
                                    }
                                    //select BC
                                    else{
                                        newVennSelect[BC] = newVal;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //select A
                                    if (thirdNegated){
                                        newVennSelect[A] = newVal;
                                    }
                                    //select AC
                                    else{
                                        newVennSelect[AC] = newVal;
                                    }
                                }
                                else{
                                    //select AB
                                    if (thirdNegated){
                                        newVennSelect[AB] = newVal;
                                    }
                                    //select ABC
                                    else{
                                        newVennSelect[ABC] = newVal;
                                    }
                                }
                            }
                        break;

                        case "or":
                            if (firstNegated){
                                if (secondNegated){
                                    //select B, C
                                    if (thirdNegated){
                                        newVennSelect[B] = newVal;
                                        newVennSelect[C] = newVal;
                                    }
                                    //select BC
                                    else{
                                        newVennSelect[BC] = newVal;
                                    }
                                }
                                else{
                                    //select BC
                                    if (thirdNegated){
                                        newVennSelect[BC] = newVal;
                                    }
                                    //select B, C
                                    else{
                                        newVennSelect[B] = newVal;
                                        newVennSelect[C] = newVal;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //select AB, AC
                                    if (thirdNegated){
                                        newVennSelect[AB] = newVal;
                                        newVennSelect[AC] = newVal;
                                    }
                                    //select ABC, A
                                    else{
                                        newVennSelect[ABC] = newVal;
                                        newVennSelect[A] = newVal;
                                    }
                                }
                                else{
                                    //select ABC, A
                                    if (thirdNegated){
                                        newVennSelect[ABC] = newVal;
                                        newVennSelect[A] = newVal;
                                    }
                                    //select AB, AC
                                    else{
                                        newVennSelect[AB] = newVal;
                                        newVennSelect[AC] = newVal;
                                    }
                                }
                            }
                        break;

                    }
                }
                else{
                    if (firstNegated){
                        //select C
                        if (secondNegated){
                            newVennSelect[C] = newVal;
                        }
                        //select B, BC
                        else{
                            newVennSelect[B] = newVal;
                            newVennSelect[BC] = newVal;
                        }
                    }
                    else{
                        //select A, AC
                        if (secondNegated){
                            newVennSelect[A] = newVal;
                            newVennSelect[AC] = newVal;
                        }
                        //select AB, ABC
                        else{
                            newVennSelect[AB] = newVal;
                            newVennSelect[ABC] = newVal;
                        }
                    }
                }
            break;
            case "no":
                if (thirdCat!=null){
                    switch(secondOpp){
                        case "and":
                            if (firstNegated){
                                if (secondNegated){
                                    //always true
                                    if (thirdNegated){
                                        return true;
                                    }
                                    //shade C
                                    else{
                                        newVennShade[C] = true;
                                    }
                                }
                                else{
                                    //shade B
                                    if (thirdNegated){
                                        newVennShade[B] = true;
                                    }
                                    //shade BC
                                    else{
                                        newVennShade[BC] = true;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //shade A
                                    if (thirdNegated){
                                        newVennShade[A] = true;
                                    }
                                    //shade AC
                                    else{
                                        newVennShade[AC] = true;
                                    }
                                }
                                else{
                                    //shade AB
                                    if (thirdNegated){
                                        newVennShade[AB] = true;
                                    }
                                    //shade ABC
                                    else{
                                        newVennShade[ABC] = true;
                                    }
                                }
                            }
                        break;

                        case "or":
                            if (firstNegated){
                                if (secondNegated){
                                    //shade B, C
                                    if (thirdNegated){
                                        newVennShade[B] = true;
                                        newVennShade[C] = true;
                                    }
                                    //shade BC
                                    else{
                                        newVennShade[BC] = true;
                                    }
                                }
                                else{
                                    //shade BC
                                    if (thirdNegated){
                                        newVennShade[BC] = true;
                                    }
                                    //shade B, C
                                    else{
                                        newVennShade[B] = true;
                                        newVennShade[C] = true;
                                    }
                                }
                            }
                            else{
                                if (secondNegated){
                                    //shade AB, AC
                                    if (thirdNegated){
                                        newVennShade[AB] = true;
                                        newVennShade[AC] = true;
                                    }
                                    //shade ABC, A
                                    else{
                                        newVennShade[ABC] = true;
                                        newVennShade[A] = true;
                                    }
                                }
                                else{
                                    //shade ABC, A
                                    if (thirdNegated){
                                        newVennShade[ABC] = true;
                                        newVennShade[A] = true;
                                    }
                                    //shade AB, AC
                                    else{
                                        newVennShade[AB] = true;
                                        newVennShade[AC] = true;
                                    }
                                }
                            }
                        break;
                    }
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

        for (var l = 0; l < newVennSelect.length; l++){
            if (newVennShade[l] == true) newVennSelect[l] = 0;
        }

        //add arrays to venns
        var lists = [];
        lists.push(newVennShade);
        lists.push(newVennSelect);
        this.venns.push(lists);
    }

}

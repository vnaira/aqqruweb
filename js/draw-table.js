
let priority = ['High', 'Medium', 'Low'];

function drawTable(prior = priority) {

    goalsObj = JSON.parse(localStorage.getItem('goalObject'));

    if(goalsObj) {
        goals = goalsObj.goals;
        console.log(reorderGoals(goalsObj.goals));
    } else {
        alert("Server error, the page will be reloaded");
        setTimeout(function () {
            window.location.reload(1);
        }, 2000);
    }
    years = calculateYearGrid(goalsObj.profile.birthdate);

    // create table left side
    priorityContent = '<div class="row">';
    for(var p = 0; p < prior.length; p++){
        priorityContent += '<div class="col-md-4 text-center">'+ prior[p]+'</div>';
    }
    priorityContent+= '</div>';
    $('.verticaltext_content').append(priorityContent);



    document.getElementById("table-canvas").innerHTML = "";

    table = document.createElement("table");
    table.className = "table goals-table table-responsive";
    row = table.insertRow();

    var percentage = 80/(goals.length - 1);

    var calcWidth;
    var calcHeight;

    canvasWidth = $('#table-canvas').width();


    for (var count = 0; count < prior.length; count++) {
        // cell loop
        var stepCell = Math.floor(years.length/11);
        tdWidth = canvasWidth/11/stepCell;
        for (let i = 0; i < years.length; i++) {

            var cell = row.insertCell();

            var cellContent = "";
            if(i % stepCell == 0){cell.setAttribute('data-style', 'leftBorder');}
            cell.setAttribute('data-priority', prior[count]);
            cell.setAttribute('data-target', years[i]);
            cell.style.width = tdWidth.toFixed(0) + 'px';

                for (goalItem = 0; goalItem < goals.length; goalItem++) {

                    var goalDate = newFormatDate(goals[goalItem].date);

                    cell.setAttribute('data-type', goals[goalItem].goal_type);

                    if ( goalDate.year == years[i] && goals[goalItem].priority === prior[count]) {

                    calcWidth = 120 + (percentage * goalItem);
                    calcHeight = calcWidth - 38;
                        cellContent += "<div draggable='true' class='draggable radialProgressBar ";
                        cellContent += "\' id=\'" + goals[goalItem].id + "\'" + " data-status-year='" + goalDate.year + "\'" +
                            "data-status-priority='" + goals[goalItem].priority + "\'" + "style='width: "+
                            calcWidth+ "px; " + " height:"+ calcWidth +
                            "px; margin-top: "+"-"+calcWidth+ "px; margin-left: "+"-"+
                            calcHeight +"px;"+ progrssAchievability(goals[goalItem].achievability,goals[goalItem].state ) +
                            "'><div class='overlay' style='width:" + calcHeight + "px; height:"+ calcHeight +
                            "px'><p class='goal-name-overlay'>" + goals[goalItem].name +
                            "</p><p><small>" + "$" + goals[goalItem].amount + "</small></p></div></div>";
                    }
            }
            cell.className = "dropzone";
            cell.innerHTML = cellContent;
        }
        // end of cell loop

        row.className = "priority-" + prior[count];
        row = table.insertRow();
    }

    // ATTACH TABLE TO CONTAINER
    document.getElementById("table-canvas").appendChild(table);
    $('.verticaltext_content').show();
    drawGridLabels(years);

}

function drawGridLabels(years) {
    table = document.createElement("table");
    table.className = "table grid-labels table-responsive";
    row = table.insertRow();

    var stepCell = Math.floor(years.length/11);
    for (let i = 0; i < years.length; i++) {
        var cellLabel = "";
        if(i % stepCell == 0){
            var cell = row.insertCell();

            cellLabel += "<span class='years'>"+ years[i]+"</span>";
            cell.innerHTML = cellLabel;
            cell.setAttribute('width', Math.ceil(canvasWidth /11)+1 +'px');
        }
    }
    document.getElementById("grid-labels").appendChild(table);
}


var dragged;
var old_state;

  document.addEventListener("dragstart", function (event) {
    dragged = event.target;
    old_state = {
        priority: dragged.getAttribute("data-status-priority"),
        year: dragged.getAttribute('data-status-year'),
    };

  }, false);

  document.addEventListener("dragend", function (event) {
    // reset the transparency
    event.target.style.opacity = "";
  }, false);

  /* events fired on the drop targets */
  document.addEventListener("dragover", function (event) {
    // prevent default to allow drop
    event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function (event) {
    if (event.target.className == "dropzone") {

    }
  }, false);

  document.addEventListener("dragleave", function (event) {
    if (event.target.className == "dropzone") {
      event.target.style.background = "";
    }
  }, false);

  document.addEventListener("drop", function (event) {
    event.preventDefault();
    if (event.target.className == "dropzone") {
      dragged.parentNode.removeChild(dragged);
      event.target.appendChild(dragged);
    }

    dragged.setAttribute('data-status-priority', event.target.getAttribute('data-priority'));
    dragged.setAttribute('data-status-year', event.target.getAttribute('data-target'));
    dragged.setAttribute('data-status-month', event.target.getAttribute('data-target-month'));
   
    // open save changes modal

    // redraw table grid after each drop
    //   setTimeout(function(){ drawTable(date_array, goalsObj); }, 2000);


  }, false);



function newFormatDate(date) {
  if(date){
    var d = new Date(date);
    var dateObj = {month: d.getMonth()+1, year: d.getFullYear()};
    return dateObj;
  }
  return false;
}

function goalClick() {
    var objects = document.querySelectorAll('.radialProgressBar');

    if(objects){
        [].forEach.call(objects, function (el) {
            el.addEventListener("click", function () {
                $('#effect-of-changes').modal('show');
            }, false);
        });
    }
}


function calculateYearGrid(dateBirth) {
    years = [];
    var nowYear = (new Date()).getFullYear();
    var retirementYear = (new Date(dateBirth)).getFullYear() + 118;
    for (var i = nowYear; i <= retirementYear; i++ ){
        years.push(i);
    }
    return years;

}

function progrssAchievability(achievValue, state) {
    var styleValue = "";
    var colorS = generateColor(state);
    if( achievValue <= 50 ){
        styleValue = "background-image: linear-gradient(" + (90 - achievValue * 3.6) +
            "deg," + lightenDarkenColor(colorS,80) + " 50%, transparent 50%), linear-gradient(90deg, " +
            colorS +  " 50%, " + lightenDarkenColor(colorS,80) + " 50%);";
    }else {
        styleValue = "background-image: linear-gradient(90deg,"+ colorS +" 50%, transparent 50%), linear-gradient("+
            (270 - achievValue * 3.6) +"deg, "+ colorS +" 50%, "+ lightenDarkenColor(colorS, 80)+" 50%);";
    }
    return styleValue;
}


function generateColor(wellnessState) {
    var currentRed = 0;
    var currentGreen = 0;
    var currentBlue = 0;
    var red = [231.0, 78.0, 78.0];
    var yellow = [255.0, 185.0, 0.0];
    var green = [78.0, 211.0, 177.0];

    if (wellnessState) {
        currentRed = wellnessState[ 0 ] * red[ 0 ] + wellnessState[ 1 ] * yellow[ 0 ] + wellnessState[ 2 ] * green[ 0 ];
        currentGreen = wellnessState[ 0 ] * red[ 1 ] + wellnessState[ 1 ] * yellow[ 1 ] + wellnessState[ 2 ] * green[ 1 ];
        currentBlue = wellnessState[ 0 ] * red[ 2 ] + wellnessState[ 1 ] * yellow[ 2 ] + wellnessState[ 2 ] * green[ 2 ];
    }

    return rgbToHex(Math.round(currentRed),Math.round(currentGreen),Math.round(currentBlue));
}


var lightenDarkenColor = function (col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) {
        r = 255;
    } else if (r < 0) {
        r = 0;
    }
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) {
        b = 255;
    } else if (b < 0) {
        b = 0;
    }
    var g = (num & 0x0000FF) + amt;
    if (g > 255) {
        g = 255;
    } else if (g < 0) {
        g = 0;
    }
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function reorderGoals(goalsObject) {
    return goalsObject.sort((a, b) => (a.amount > b.amount) ? 1 : -1);
}


let changedObj = {
    "profiles": [
        {
            "id": "8a423708-0e70-4302-9bd8-7b67fa749151",
            "birthdate": "1955-04-02T07:35:53"
        },
        {
            "id": "b70ce029-88d8-4598-a467-01c8c180d7b8",
            "birthdate": "2014-04-02T07:35:53"
        },
        {
            "id": "04b1d362-fd18-4849-9ee4-5b764e0b9f80",
            "birthdate": "2017-04-02T07:35:53"
        }
    ],
    "active_changed_goals":[
        {
            "id": "968f6828-a81a-4cfc-9b94-d2f343157822",
            "object_type": "car_goal"
        },
        {
            "id": "ce35ce1b-3056-4c13-9bc8-4fdc6e1da0d0",
            "object_type": "house_goal"
        }
    ],
    "initial_avatar_result": {
        "state": [
            0.0,
            1.0,
            0.0
        ],
        "wellnesscore": 14
    },
    "initial_goals":[
        {
            "id": "968f6828-a81a-4cfc-9b94-d2f343157822",
            "person_id": "8a423708-0e70-4302-9bd8-7b67fa749151",
            "date": "2021-04-01T00:00:00",
            "goal_type": "retirement_goal",
            "name": "Car",
            "amount": 20972.0,
            "priority": "Low",
            "achievability": 58.0,
            "state": [
                0.0,
                1.0,
                0.0
            ]
        },
        {
            "id": "ce35ce1b-3056-4c13-9bc8-4fdc6e1da0d0",
            "person_id": "b70ce029-88d8-4598-a467-01c8c180d7b8",
            "date": "2022-04-01T00:00:00",
            "goal_type": "retirement_goal",
            "name": "retirement",
            "amount": 267072.0,
            "priority": "Medium",
            "achievability": 60.0,
            "state": [
                0.0,
                1.0,
                0.0
            ]
        },
        {
            "id": "ce35ce1b-3056-4c13-9bc8-4fdc6e1da0d0",
            "person_id": "8a423708-0e70-4302-9bd8-7b67fa749151",
            "date": "2028-04-01T00:00:00",
            "goal_type": "house_goal",
            "name": "House",
            "amount": 267072.0,
            "priority": "High",
            "achievability": 60.0,
            "state": [
                0.0,
                0.998,
                0.002
            ]
        }
    ],
    "changed_avatar_result": {
        "state": [
            0.0,
            1.0,
            0.0
        ],
        "wellnesscore": 34
    },
    "changed_goals":[
        {
            "id": "ce35ce1b-3056-4c13-9bc8-4fdc6e1da0d0",
            "person_id": "8a423708-0e70-4302-9bd8-7b67fa749151",
            "date": "2021-04-01T00:00:00",
            "goal_type": "retirement_goal",
            "name": "Car",
            "amount": 20972.0,
            "priority": "Low",
            "achievability": 58.0,
            "state": [
                0.0,
                1.0,
                0.0
            ]
        },
        {
            "id": "ce35ce1b-3056-4c13-9bc8-4fdc6e1da0d0",
            "person_id": "b70ce029-88d8-4598-a467-01c8c180d7b8",
            "date": "2022-04-01T00:00:00",
            "goal_type": "retirement_goal",
            "name": "retirement",
            "amount": 267072.0,
            "priority": "Medium",
            "achievability": 60.0,
            "state": [
                0.0,
                1.0,
                0.0
            ]
        },
        {
            "id": "ce35ce1b-3056-4c13-9bc8-4fdc6e1da0d0",
            "person_id": "8a423708-0e70-4302-9bd8-7b67fa749151",
            "date": "2028-04-01T00:00:00",
            "goal_type": "house_goal",
            "name": "House",
            "amount": 267072.0,
            "priority": "High",
            "achievability": 60.0,
            "state": [
                0.0,
                0.998,
                0.002
            ]
        }
    ]
};


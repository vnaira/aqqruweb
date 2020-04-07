
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

    // create table left side priority
    document.getElementById('priority_labels').innerHTML = '';
    priorityContent = '<div class="row">';
    for(var p = 0; p < prior.length; p++){
        priorityContent += '<div class="col-md-4 text-center">'+ prior[p]+'</div>';
    }
    priorityContent+= '</div>';
    $('.verticaltext_content').append(priorityContent);

    // start creation table grid
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

/**
 * create years labels for table
 * @param years
 */
function drawGridLabels(years) {
    document.getElementById("grid-labels").innerText = '';
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


/**
 * drag-drop event effects
 */
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


  }, false);


/**
 * format from date only month and year
  * @param date
 * @returns {*}
 */
function newFormatDate(date) {
  if(date){
    var d = new Date(date);
    var dateObj = {month: d.getMonth()+1, year: d.getFullYear()};
    return dateObj;
  }
  return false;
}

/**
 * format from date month short name and year
 * @param date
 * @returns {*}
 */
function dateWithMonth(date) {
    const d = new Date(date);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return monthNames[d.getMonth()] + " " + d.getFullYear();
}

/**
 * Goal chart click handler
 */
function goalClick() {
    var objects = document.querySelectorAll('.radialProgressBar');

    if(objects){
        [].forEach.call(objects, function (el) {
            el.addEventListener("click", function () {
                createEffectOfChangesModal(changedObj);
                $('#effect-of-changes').modal('show');
            }, false);
        });
    }
}

/**
 * create years array depend of birth date
 * @param dateBirth
 * @returns {Array}
 */
function calculateYearGrid(dateBirth) {
    years = [];
    var nowYear = (new Date()).getFullYear();
    var retirementYear = (new Date(dateBirth)).getFullYear() + 118;
    for (var i = nowYear; i <= retirementYear; i++ ){
        years.push(i);
    }
    return years;

}

/**
 * Calculate progressbar from achievabiliti and state
 * @param achievValue
 * @param state
 * @returns {string}
 */
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

/**
 * Generate hexadecimal color from state
 * @param wellnessState
 * @returns {*}
 */
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

/**
 * Get light or dark color from given color value
 * @param col
 * @param amt
 * @returns {string}
 */
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

/**
 * reordering goals list
 * @param goalsObject
 * @returns {this | this | this}
 */
function reorderGoals(goalsObject) {
    return goalsObject.sort((a, b) => (a.amount > b.amount) ? 1 : -1);
}


/**
 * create effect of changes modal
 * @param changesResponseObj
 */
function createEffectOfChangesModal(changesResponseObj) {

    document.getElementById('changesModal').innerHTML = '';
    var modalContent = '';
    modalContent += '<div class="modal-header"><h5 class="modal-title">Is this correct?</h5>' +
        '<button type="button" class="close p-2" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span></button></div>';

    if (changesResponseObj) {

        modalContent += '<div class="modal-body effect-changes pt-0">';

        modalContent += '<div class="row">';

        modalContent += '<div class="score-text white-title col-md-12" style="background:' + generateColor(changesResponseObj.changed_avatar_result.state) + '">';
        modalContent += '<div class="row"><div class="status-icon col-md-1 col-lg-1 pt-3">';
        modalContent += '<img src="css/img/playzone/down.png" alt="" class="m-auto"/></div>';
        modalContent += '<div class="col-md-2 col-lg-1"><p class="big-title-big text-bold">' + changesResponseObj.changed_avatar_result.wellnesscore + '</p></div>';
        modalContent += '<div class="col-md-8 col-lg-9 text-left"><p class="mt-3 ml-1 text-bold" style="color: #fff">' +
            'Financial</p><p class="ml-1 text-bold" style="color: #fff">Wellness Score</p></div></div></div></div>';

        // Active Goals list
        if (changesResponseObj.active_changed_goals) {
            modalContent += '<div class="col-md-12"><p class="dart-title mt-2 mb-2">Active Goal</p></div>';

            for (var prop in changesResponseObj.active_changed_goals) {

                modalContent += '<div class="card"><div class="card-header row"><div class="col-md-12"><p class="card-title-text">';
                modalContent += 'This goal seems <span class="shtriched">24%</span> less likely. ' +
                    'This change has also reduced your financial wellness score to <span class="shtriched">39</span>. ' +
                    'Are you sure you would like to continue?</p></div></div>';
                modalContent += '<div class="card-body"><div class="row"><div class="col-md-5"><div class="row">' +
                    '<div class="col-md-3"> <img src="css/img/small-icon-'+changesResponseObj.active_changed_goals[prop].object_type+'.png" alt=""/></div> ' +
                    '<div class="col-md-9"><p class="goal-name">'+ changesResponseObj.active_changed_goals[prop].name +
                    '</p><p class="goal-priority blue-text">'+ changesResponseObj.active_changed_goals[prop].priority+'</p></div>' +
                    '</div><div class="goal-date mt-3">Date <span class="blue-text"> '+ dateWithMonth(changesResponseObj.active_changed_goals[prop].date) +'</span></div>' +
                    '<div class="goal-date">Expected cost <span class="blue-text">$'+changesResponseObj.active_changed_goals[prop].amount+'</span></div><div class="mt-3"></div></div>';
                modalContent += '<div class="col-md-7"><div class="row"><div class="col-md-4">' +



                    '<div class="radialProgressBar left-20 small" style="'+
                    progrssAchievability(changesResponseObj.active_changed_goals[prop].achievability, changesResponseObj.active_changed_goals[prop].state)+'">' +
                    '<div class="overlay dart-title"><p>'+
                    changesResponseObj.active_changed_goals[prop].achievability +'%</p>' +
                    '<p><small>'+dateWithMonth(changesResponseObj.active_changed_goals[prop].date)+
                    '</small></p></div></div></div>';
                modalContent += '<div class="col-md-4"><div class="von-bis"></div>' +
                    '<div class="row justify-content-between"><p class="col-md-6">' +
                    '<small>From</small></p><p class="col-md-6 text-right"><small>To</small></p></div></div>';
                modalContent += '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="'+
                    progrssAchievability(changesResponseObj.active_changed_goals[prop].achievability, changesResponseObj.active_changed_goals[prop].state)+'">' +
                    '<div class="overlay dart-title"><p>'+
                    changesResponseObj.active_changed_goals[prop].achievability+
                    '%</p><p><small>'+ dateWithMonth(changesResponseObj.active_changed_goals[prop].date) +'</small></p></div></div></div></div>';
                modalContent += '<div class="row justify-content-between mt-2"><p class="col-md-6">' +
                    '<small>Goal Achievability</small></p><p class="col-md-6 text-right">' +
                    '<small>Goal Achievability</small></p></div></div></div></div></div>';
            }

        }

        // Changed Goals list
        if (changesResponseObj.changed_goals && changesResponseObj.initial_goals) {

            modalContent += ' <div class="col-md-12"><div class="row"><div class="col-md-8">' +
                '<p class="dart-title mt-2 mb-2">Impact on other goals</p></div></div></div>';

            for (var prop2 in changesResponseObj.changed_goals) {
                modalContent += '<div class="card"><div class="card-body"><div class="row">' +
                    '<div class="col-md-5"><div class="row"><div class="col-md-3">' +
                    '<img src="css/img/small-icon-'+ changesResponseObj.initial_goals[prop2].goal_type +'.png" alt=""/></div>' +
                    '<div class="col-md-9"><p class="goal-name">'+changesResponseObj.initial_goals[prop2].name+'</p>' +
                    '<p class="goal-priority blue-text">High</p></div></div>' +
                    '<div class="goal-date mt-3">Date  <span class="blue-text">'+ dateWithMonth(changesResponseObj.initial_goals[prop2].date)+'</span></div>' +
                    '<div class="goal-date">Left to heirs  <span class="blue-text"> '+changesResponseObj.initial_goals[prop2].amount +'</span></div>' +
                    '<div class="mt-3"></div></div><div class="col-md-7"><div class="row">' +

                    '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="'+
                    progrssAchievability(changesResponseObj.initial_goals[prop2].achievability, changesResponseObj.initial_goals[prop2].state) +'">' +
                    '<div class="overlay dart-title"><p>'+
                    changesResponseObj.initial_goals[prop2].achievability+'%</p><p>' +
                    '<small>'+ dateWithMonth(changesResponseObj.initial_goals[prop2].date)+'</small></p></div></div></div>';

                modalContent += '<div class="col-md-4"><div class="von-bis"></div>' +
                    '<div class="row justify-content-between"><p class="col-md-6">' +
                    '<small>From</small></p><p class="col-md-6 text-right"><small>To</small></p></div></div>' +

                    '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="'+
                    progrssAchievability(changesResponseObj.changed_goals[prop2].achievability, changesResponseObj.changed_goals[prop2].state)+'">' +
                    '<div class="overlay dart-title"><p>'+
                    changesResponseObj.changed_goals[prop2].achievability+
                    '%</p><p><small>'+ dateWithMonth(changesResponseObj.changed_goals[prop2].date) +'</small></p></div></div></div></div>';
                modalContent += '<div class="row justify-content-between mt-2">' +
                    '<p class="col-md-6"><small>Goal Achievability</small></p>' +
                    '<p class="col-md-6 text-right"><small>Goal Achievability</small></p>' +
                    '</div></div></div> </div> </div>';
            }
        }
        modalContent += '<div class="row"><div class="col-md-6 offset-6"><div class="row">' +
            '<div class="btn-group col-md-6"><button type="button" class="btn btn-grey" onclick="discardChanges()">Discard</button></div>' +
            '<div class="btn-group col-md-6"><button type="button" class="btn btn-blue" onclick="saveChanges()">Save</button></div></div></div></div>';
        modalContent += '</div>';

    }
    $('#changesModal').append(modalContent);

}

//TODO modal's buttons actions
function discardChanges(){
    $("#effect-of-changes").modal("hide");
    drawTable();
}
function saveChanges(){}

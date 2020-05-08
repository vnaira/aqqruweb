
let priority = ['Low', 'Medium', 'High'];

function drawTable(profile, prior = priority) {
    goals = JSON.parse(window.localStorage.getItem('goalObject'));

    if (!goals) {
        alert("Server error, the page will be reloaded");
        setTimeout(function () {
            window.location.reload(1);
        }, 1000);
    }

    var withtVal = generateWidthOfChart(goals);
    years = calculateYearGrid(goals);

    // create table left side priority
    document.getElementById('priority_labels').innerHTML = '';
    priorityContent = '<div class="row pr">';
    for (var p = 0; p < prior.length; p++) {
        priorityContent += '<div class="col-md-4 text-center">' + prior[p] + '</div>';
    }
    priorityContent += '</div>';
    $('.verticaltext_content').append(priorityContent);

    // start creation table grid
    document.getElementById("table-canvas").innerHTML = "";

    table = document.createElement("table");
    table.className = "table goals-table table-responsive ml-3";
    row = table.insertRow();

    canvasWidth = $('#table-canvas').width();

    for (var count = (prior.length - 1); count >= 0; count--) {
        // cell loop
        var  stepCell = Math.floor(years.length / 15);

        tdWidth = canvasWidth / 15 / stepCell;
        for (let i = 0; i < years.length; i++) {

            var cell = row.insertCell();

            var cellContent = "";
            if (i % stepCell === 0) { cell.setAttribute('data-style', 'leftBorder'); }
            cell.setAttribute('data-priority', prior[count]);
            cell.setAttribute('data-target', years[i]);
            cell.style.width = tdWidth.toFixed(0) + 'px';

            for (goalItem = 0; goalItem < goals.length; goalItem++) {

                var goalDate = newFormatDate(goals[goalItem].goal_data.date);

                // set emergency goal priority to High
                if (goals[goalItem].goal_data.priority === null ){
                    goals[goalItem].goal_data.priority = "High";
                }

                if (goalDate.year === years[i] && goals[goalItem].goal_data.priority === prior[count]) {

                    var calcWidth = 130 + caefecentOfWidth(withtVal, goals[goalItem].goal_data.amount);
                    var position = -( calcWidth / 2);
                    var calcHeight = calcWidth - 38;

                    // make no draggable emergency fund
                    if(goals[goalItem].goal_data.goal_type === "emergency_fund"){
                        cellContent += "<div draggable='false' class='radialProgressBar item";
                    }else {
                        cellContent += "<div draggable='true' data-toggle='modal' data-dismiss='modal' data-target='#tradeoffModal' class='draggable radialProgressBar item";
                    }

                    cellContent += "\' id=\'" + goals[goalItem].goal_data.id + "\'" + " data-status-year='" + goalDate.year + "\'" +
                        "data-status-goal-type='" + goals[goalItem].goal_data.goal_type + "\'" +
                        "data-status-priority='" + goals[goalItem].goal_data.priority + "\'" + "style='width: " +
                        calcWidth + "px; " + " height:" + calcWidth +
                        "px; margin-top: " + position + "px; margin-left: " + position + "px;" +
                        progrssAchievability(goals[goalItem].calc_goal_result.score, goals[goalItem].calc_goal_result.state) +
                        "'><div class='overlay' style='width:" + calcHeight + "px; height:" + calcHeight +
                        "px'><p class='line-1' style='color:" + generateColor(goals[goalItem].calc_goal_result.state) + "'>" + goals[goalItem].calc_goal_result.score +
                        "%</p><p style='font-size:12px; color: " + generateColor(goals[goalItem].calc_goal_result.state) +
                        "'>Achievability</p><p class='goal-name-overlay line-1'>" + goals[goalItem].goal_data.name +
                        "</p><p><small>" + "$" + goals[goalItem].goal_data.amount.toLocaleString() + "</small></p></div></div>";
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
 * calculation of charts with coefficient
 * @param goalsObjs
 * @returns {Array}
 */
var generateWidthOfChart = function (goalsObjs) {
    var newObj = [];
    for (var it = 0; it < goalsObjs.length; it++) {
        newObj.push(goalsObjs[it].goal_data.amount);
    }
    var ammountArr = newObj.filter((a, b) => newObj.indexOf(a) === b);
    ammountArr = reorderGoals(ammountArr);

    var percentage = 80 / (ammountArr.length - 1);
    var arrayOfWidths = [];
    for (var arr = 0; arr < ammountArr.length; arr++) {
        var newArr = {};
        newArr.amount = ammountArr[arr];
        newArr.coefficient = arr * percentage;
        arrayOfWidths.push(newArr);
    }
    return arrayOfWidths;
}

var caefecentOfWidth = function (o, val) {
    for (var prop in o) {
        if (o[prop].amount === val)
            return o[prop].coefficient;
    }
}
/**
 * create years labels for table
 * @param years
 */
function drawGridLabels(years) {
    document.getElementById("grid-labels").innerText = '';
    table = document.createElement("table");
    table.className = "table grid-labels table-responsive ml-4";
    row = table.insertRow();

    var stepCell = Math.floor(years.length / 15);
    for (let i = 0; i < years.length; i++) {
        var cellLabel = "";
        if (i % stepCell === 0) {
            var cell = row.insertCell();

            cellLabel += "<span class='years'>" + years[i] + "</span>";
            cell.innerHTML = cellLabel;
            cell.setAttribute('width', Math.ceil(canvasWidth / 15) - 1 + 'px');
        }
    }
    document.getElementById("grid-labels").appendChild(table);
}


/**
 * drag-drop event effects
 */
var dragged;
var currGoalInfo;

document.addEventListener("dragstart", function (event) {
    dragged = event.target;
    currGoalInfo = {
        id: dragged.getAttribute("id"),
        goal_type: dragged.getAttribute("data-status-goal-type"),
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

}, false);

document.addEventListener("dragleave", function (event) {
    if (event.target.className === "dropzone") {
        event.target.style.background = "";
    }
}, false);

// goals click open tradeoff modal
document.addEventListener("click", function (event) {
    var el = $(event.target).closest('.radialProgressBar');
    if(el.hasClass('item')){
        var id = el.attr('id');
        var goal_type = el.data('status-goal-type');

        // $.ajax({
        //     type: "POST",
        //     url: "",
        //     data: JSON.stringify({id: id, goaltype: goal_type}),
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     success: function () {

        var obj = {
            "goal_type": "car_goal",
            "goal_name": "car",
            "priority": "Low",
            "target": "6",
            "expectedPrice": "$5000",
            "tradeoff": {
                "conclusion": "If you delay your car and/or buy a less expensive car, you may be in a\n" +
                    "better position to meet your goals.",
                "amountAxisDescription": "Car Price",
                "timeAxisDescription": "CAR PURCHASE YEARS FROM NOW",
                "ages": ['4 Years', '5 Years', '6 Years'],
                "amount": [50000, 40000, 35000],
                "state": [
                    [
                        {"color": [0.0, 1.0, 0.0], "value": 70,},
                        {"color": [0.0, 1.0, 0.0], "value": 75,},
                        {"color": [0.0, 1.0, 0.0], "value": 40,},
                        ],
                    [
                        {"color": [0.0, 1.0, 0.0], "value": 78,},
                        {"color":[0.0, 1.0, 0.0], "value": 78,},
                        {"color": [0.0, 1.0, 0.0], "value": 78,},
                    ],
                    [
                        {"color":[0.0, 1.0, 0.0], "value": 78,},
                        {"color":[0.0, 1.0, 0.0], "value": 78,},
                        {"color":[0.0, 1.0, 0.0], "value": 78,},
                    ]
                ]
            }
        };

        // actions after ajax success
        $('.radialProgressBar').css('z-index',1);
        el.css('z-index',1045);
        createTradeOffModal(obj);
        $("#tradeoffModal_").modal('show');


        //     }
        // });



    }
});


function createTradeOffModal(goalObject) {
    var trmodal = '';
trmodal += '<div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content">' +
    '<div class="modal-body" id=""><div class="col-md-12"><img src="css/img/small-icon-'+ goalObject.goal_type +'.png" width="25" alt=""/>' +
    '<p class="text-bold d-inline-block text-capitalize">'+goalObject.goal_name +' Goal</p></div><ul class="nav nav-tabs tradeoff_tab mt-4">' +
    '<li class="nav-item" ondragstart="return false;"><a class="nav-link" data-toggle="tab" href="#goal_info_tab">Goal Information</a></li>' +
    '<li class="nav-item" ondragstart="return false;"><a class="nav-link active" data-toggle="tab" href="#tradeoff_tab">Tradeoffs</a></li></ul>' +
    '<div class="tab-content"><div id="goal_info_tab" class="container tab-pane"><br>';
    trmodal += '<form class=""><div class="row"><div class="col-md-12"><div class="form-group mt-3">' +
    '<label for="car-goal-name" class="col-form-label">Goal name</label>' +
    '<input type="text" class="form-control shadowed-input" id="'+ goalObject.goal_type +'-name" value="'+ goalObject.goal_name +'"></div>' +
        '<div class="form-group"><label for="goal-name" class="col-form-label">How important this goal?</label>' +
        '<div class="row"><div class="radio-toolbar w-100">';

// goal priority row
    trmodal += '<input type="radio" id="priority_low_'+goalObject.goal_type+'" name="priority_low_'+goalObject.goal_type+
        '" value="Low" class="k-button" /><label for="priority_low_'+goalObject.goal_type+'">Low</label>' +
        '<input type="radio" id="priority_medium_'+goalObject.goal_type+'" name="priority_medium_'+goalObject.goal_type+
        '" value="Medium" class="k-button"/><label for="priority_medium_'+goalObject.goal_type+'">Medium</label>\n' +
        '<input type="radio" id="priority_high_'+goalObject.goal_type+'" name="priority_high_'+goalObject.goal_type+
        '" value="High" class="k-button"/><label for="priority_high_'+goalObject.goal_type+'">High</label></div></div></div>';

    trmodal += ' <div class="form-group"><label class="col-form-label">Target purchase date</label>' +
        '<button type="button" class="btn tooltip-badge" data-toggle="tooltip" data-placement="right" ' +
        'title="Target start date description">?</button><div class="demo-section k-content">' +
        '<input type="range" class="custom-range" id="customRange" value="'+goalObject.target+'" max="50"></div>'+
        '<small id="result" class="text-muted">You have selected <b></b></small></div>';


    trmodal += '<div class="form-group"><label class="col-form-label">Expected '+ goalObject.goal_name +' Price</label>' +
        '<button type="button" class="btn tooltip-badge" data-toggle="tooltip" data-placement="right" title="Expected '
        +goalObject.goal_name+' Price">?</button><input type="text" class="form-control shadowed-input number"' +
        ' value="'+goalObject.expectedPrice+'"></div>';

    trmodal += '</div><div class="form-group mt-3 col-md-12 mt-5"><div class="row justify-content-center">' +
        '<div class="col-md-6"><button type="button" class="btn btn-ok btn-block">Save And Continue</button>\n' +
        '</div></div></div></div></form></div>';

    // second tab content
    if (typeof goalObject.tradeoff !== "undefined") {
        trmodal += '<div id="tradeoff_tab" class="container tab-pane active"><br>' +
            '<p>' + goalObject.tradeoff.conclusion + '</p><div class="card mb-4 card-border-radius mt-3"><div class="card-block p-3">';
        trmodal += '<div class="table-card"><div class="verticaltext_content_tab card-title-uppercase">' +
            goalObject.tradeoff.amountAxisDescription + '</div><div><p class="card-title-uppercase">' +
            goalObject.tradeoff.timeAxisDescription + '</p><div class="table-responsive">' +
            '<table class="tabl">';
        if (goalObject.tradeoff.ages) {
            trmodal += '<tr><th></th>';
            for (var i = 0; i < goalObject.tradeoff.ages.length; i++) {
                trmodal += '<th class="text-center">' + goalObject.tradeoff.ages[i] + '</th>'
            }
            trmodal += '</tr>';
        }
        if (goalObject.tradeoff.amount) {

            for (var j = 0; j < goalObject.tradeoff.amount.length; j++) {
                trmodal += '<tr>';
                trmodal += '<th>' + goalObject.tradeoff.amount[j] + '</th>';
                for (var it = 0; it < goalObject.tradeoff.state.length; it++) {
                    trmodal += '<td><div class="card-value"  style="background:' +
                        generateColor(goalObject.tradeoff.state[j][it].color) + '">' +
                        goalObject.tradeoff.state[j][it].value + '%</div></td>';
                }
                trmodal += '</tr>';
            }

        }
        trmodal += '</table></div></div></div></div></div>';
    }
    trmodal += '<div class="right-transparent"><p class="text-bold">Select a tradeoff </p>' +
        '<p>Click on a tradeoff to see how it changes your goal.</p></div></div></div></div></div></div>';

    $('#tradeoffModal_').append(trmodal);
    //changeSlider();
    tradeoffItemClick(changedObj);

}


// click on tradeoff item
function tradeoffItemClick(obj) {
    var cards = document.querySelectorAll(".card-value");
    for (var i = 0; i< cards.length; i++){
        cards[i].addEventListener("click", function () {
            createEffectOfChangesModal(obj, true);
            $('#effect-of-changes').modal('show');
        });
    }
}

function changeSlider(){
    $("#result b").html($("#customRange").val());

    // Read value on change
    $("#customRange").change(function(){
        $("#result b").html($(this).val());

    });
}
function dropp(wholeObj, event) {
    if (event.target.className === "dropzone") {
        dragged.parentNode.removeChild(dragged);
        event.target.appendChild(dragged);
    }else {
        var ns = dragged.parentNode.nextSibling;
        dragged.parentNode.removeChild(dragged);
        ns.appendChild(dragged);
    }
    createEffectOfChangesModal(wholeObj, true);
    $('#effect-of-changes').modal('show');
    dragged.setAttribute('data-status-priority', event.target.getAttribute('data-priority'));
    dragged.setAttribute('data-status-year', event.target.getAttribute('data-target'));
    dragged.setAttribute('data-status-month', event.target.getAttribute('data-target-month'));
}



/**
 * format from date only month and year
 * @param date
 * @returns {*}
 */
function newFormatDate(date) {
    if (date) {
        var d = new Date(date);
        var dateObj = { month: d.getMonth() + 1, year: d.getFullYear() };
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
 * create years array depend of older goal year
 * @param object
 * @returns {Array}
 */
function calculateYearGrid(obj) {
    if(obj){
        var goalArray = [];
        for (item = 0; item < obj.length; item++) {
            goalArray.push(new Date(obj[item].goal_data.date).getFullYear());
        }
        years = [];
        var nowYear = (new Date()).getFullYear();
        var retirementYear = Math.max.apply(Math,goalArray) + 10;
        for (var i = nowYear; i <= retirementYear; i++) {
            years.push(i);
        }

        return years;
    }
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
    if (achievValue <= 50) {
        styleValue = "background-image: linear-gradient(" + (90 - achievValue * 3.6) +
            "deg," + lightenDarkenColor(colorS, 80) + " 50%, transparent 50%), linear-gradient(90deg, " +
            colorS + " 50%, " + lightenDarkenColor(colorS, 80) + " 50%);";
    } else {
        styleValue = "background-image: linear-gradient(90deg," + colorS + " 50%, transparent 50%), linear-gradient(" +
            (270 - achievValue * 3.6) + "deg, " + colorS + " 50%, " + lightenDarkenColor(colorS, 80) + " 50%);";
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
        currentRed = wellnessState[0] * red[0] + wellnessState[1] * yellow[0] + wellnessState[2] * green[0];
        currentGreen = wellnessState[0] * red[1] + wellnessState[1] * yellow[1] + wellnessState[2] * green[1];
        currentBlue = wellnessState[0] * red[2] + wellnessState[1] * yellow[2] + wellnessState[2] * green[2];
    }

    return rgbToHex(Math.round(currentRed), Math.round(currentGreen), Math.round(currentBlue));
}

/**
 * Get light or dark color from given color value
 * @param col
 * @param amt
 * @returns {string}
 */
var lightenDarkenColor = function (col, amt) {
    var usePound = false;
    if (col[0] === "#") {
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
    return hex.length === 1 ? "0" + hex : hex;
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
    return goalsObject.sort((a, b) => (a > b) ? 1 : -1);
}


function returnObj(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]["goal_data"][key] === value) {
            return array[i];
        }
    }
    return null;
}


/**
 * create effect of changes modal
 * @param changesResponseObj
 */
function createEffectOfChangesModal(changesResponseObj, is_informational) {

    document.getElementById('changesModal').innerHTML = '';
    var modalContent = '';
    modalContent += '<div class="modal-header"><h5 class="modal-title">Is this correct?</h5>' +
        '<button type="button" class="close p-2" data-dismiss="modal" aria-label="Close" onclick="discardChanges()">' +
        '<span aria-hidden="true">&times;</span></button></div>';

    if (changesResponseObj) {

        modalContent += '<div class="modal-body effect-changes pt-0">';

        modalContent += '<div class="row">';

        modalContent += '<div class="score-text white-title col-md-12" style="background:' + generateColor(changesResponseObj.changed_avatar_result.state) + '">';
        modalContent += '<div class="row"><div class="status-icon col-md-1 col-lg-1 pt-2">';
        if (changesResponseObj.changed_avatar_result.score > changesResponseObj.initial_avatar_result.score) {
            modalContent += '<img src="/img/playzone/up.png" alt="" class="m-auto"/></div>';
        } else {
            modalContent += '<img src="/img/playzone/down.png" alt="" class="m-auto"/></div>';
        }
        modalContent += '<div class="col-md-2 col-lg-1"><p class="big-title-big text-bold">' + changesResponseObj.changed_avatar_result.score + '</p></div>';
        modalContent += '<div class="col-md-8 col-lg-9 text-left"><p class="mt-3 ml-1 text-bold" style="color: #fff">' +
            'Financial</p><p class="ml-1 text-bold" style="color: #fff">Wellness Score</p></div></div></div></div>';

        // Active Goals list
        if (changesResponseObj.active_changed_goals) {

            for (var prop in changesResponseObj.active_changed_goals) {

                var initObject = findObjectByKey(changesResponseObj.initial_goals, "id", changesResponseObj.active_changed_goals[prop].id);
                var changedObject = findObjectByKey(changesResponseObj.changed_goals, "id", changesResponseObj.active_changed_goals[prop].id);

                if (initObject === null) {

                    modalContent += '<div class="col-md-12"><p class="dart-title mt-2 mb-2">Added ' + changedObject.goal_data.name + ' Goal</p></div>';

                    var scoreProc = changedObject.calc_goal_result.score;

                    modalContent += '<div class="card"><div class="card-header row"><div class="col-md-12"><p class="card-title-text">';

                    modalContent += 'This goal seems <span class="';
                    if (scoreProc > 0) {
                        modalContent += 'shtriched_green">' + Math.abs(scoreProc) + '%</span> more likely. '
                    } else { modalContent += 'shtriched">' + Math.abs(scoreProc) + '%</span> less likely. ' }

                    modalContent += 'This change has also reduced your financial wellness score to ';

                    if (changesResponseObj.changed_avatar_result.score > changesResponseObj.initial_avatar_result.score) {
                        modalContent += '<span class="shtriched_green">' + changesResponseObj.changed_avatar_result.score + '</span>. ';
                    } else {
                        modalContent += '<span class="shtriched">' + changesResponseObj.changed_avatar_result.score + '</span>. ';
                    }

                    modalContent += 'Are you sure you would like to continue?</p></div></div>';
                    modalContent += '<div class="card-body"><div class="row"><div class="col-md-5"><div class="row">' +
                        '<div class="col-md-3"> <img src="/img/small-icon-' + changedObject.goal_data.goal_type + '.png" alt=""/></div> ' +
                        '<div class="col-md-9"><p class="goal-name">' + changedObject.goal_data.name +
                        '</p><p class="goal-priority blue-text">' + changedObject.goal_data.priority + '</p></div>' +
                        '</div><div class="goal-date mt-3">Date  &nbsp;<span class="blue-text"> ' + dateWithMonth(changedObject.goal_data.date) + '</span></div>' +
                        '<div class="goal-date">Expected cost  &nbsp;<span class="blue-text">$' + changedObject.goal_data.amount.toLocaleString() + '</span></div><div class="mt-3"></div></div>';
                    modalContent += '<div class="col-md-7"><div class="row"><div class="col-md-4">' +
                        '<div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(0, [0.9, 0.2, 0.5]) + '">' +
                        '<div class="overlay dart-title"><p class="mt-2">0%</p>' +
                        '<p><small></small></p></div></div></div>';
                    modalContent += '<div class="col-md-4"><div class="von-bis"></div>' +
                        '<div class="row justify-content-between"><p class="col-md-6">' +
                        '<small>From</small></p><p class="col-md-6 text-right"><small>To</small></p></div></div>';
                    modalContent += '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(changedObject.calc_goal_result.score, changedObject.calc_goal_result.state) + '">' +
                        '<div class="overlay dart-title"><p>' +
                        changedObject.calc_goal_result.score +
                        '%</p><p><small>' + dateWithMonth(changedObject.calc_goal_result.date) + '</small></p></div></div></div></div>';
                    modalContent += '<div class="row justify-content-between mt-2"><p class="col-md-6">' +
                        '<small style="display: inline-block; margin-left: 10px">Goal Achievability</small></p><p class="col-md-6 text-right">' +
                        '<small>Goal Achievability</small></p></div></div></div></div></div>';

                }

                else if (changedObject === null) {

                    scoreProc = initObject.calc_goal_result.score;

                    modalContent += '<div class="col-md-12"><p class="dart-title mt-2 mb-2">Impact on Removed ' + initObject.goal_data.name + ' Goal</p></div>';

                    modalContent += '<div class="card"><div class="card-header row"><div class="col-md-12"><p class="card-title-text">';

                    modalContent += 'This goal seems <span class="';
                    if (scoreProc > 0) {
                        modalContent += 'shtriched_green">' + Math.abs(scoreProc) + '%</span> more likely. '
                    } else { modalContent += 'shtriched">' + Math.abs(scoreProc) + '%</span> less likely. ' }

                    modalContent += 'This change has also reduced your financial wellness score to ';

                    if (changesResponseObj.changed_avatar_result.score > changesResponseObj.initial_avatar_result.score) {
                        modalContent += '<span class="shtriched_green">' + changesResponseObj.changed_avatar_result.score + '</span>. ';
                    } else {
                        modalContent += '<span class="shtriched">' + changesResponseObj.changed_avatar_result.score + '</span>. ';
                    }

                    modalContent += 'Are you sure you would like to continue?</p></div></div>';
                    modalContent += '<div class="card-body"><div class="row"><div class="col-md-5"><div class="row">' +
                        '<div class="col-md-3"> <img src="/img/small-icon-' + initObject.goal_data.goal_type + '.png" alt=""/></div> ' +
                        '<div class="col-md-9"><p class="goal-name">' + initObject.goal_data.name +
                        '</p><p class="goal-priority blue-text">' + initObject.goal_data.priority + '</p></div>' +
                        '</div><div class="goal-date mt-3">Date &nbsp;<span class="blue-text"> ' + dateWithMonth(initObject.goal_data.date) + '</span></div>' +
                        '<div class="goal-date">Expected cost &nbsp;<span class="blue-text">$' + initObject.goal_data.amount.toLocaleString() + '</span></div><div class="mt-3"></div></div>';
                    modalContent += '<div class="col-md-7"><div class="row"><div class="col-md-4">' +

                        '<div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(initObject.calc_goal_result.score, initObject.calc_goal_result.state) + '">' +
                        '<div class="overlay dart-title"><p>' +
                        initObject.calc_goal_result.score + '%</p>' +
                        '<p><small>' + dateWithMonth(initObject.goal_data.date) +
                        '</small></p></div></div></div>';
                    modalContent += '<div class="col-md-4"><div class="von-bis"></div>' +
                        '<div class="row justify-content-between"><p class="col-md-6">' +
                        '<small>From</small></p><p class="col-md-6 text-right"><small>To</small></p></div></div>';
                    modalContent += '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(0, [0.9, 0.2, 0.5]) + '">' +
                        '<div class="overlay dart-title"><p class="mt-2">0%</p><p><small></small></p></div></div></div></div>';
                    modalContent += '<div class="row justify-content-between mt-2"><p class="col-md-6">' +
                        '<small style="display: inline-block; margin-left: 10px">Goal Achievability</small></p><p class="col-md-6 text-right">' +
                        '<small>Goal Achievability</small></p></div></div></div></div></div>';
                } else {
                    modalContent += '<div class="col-md-12"><p class="dart-title mt-2 mb-2">Impact on ' + initObject.goal_data.name + ' Goal</p></div>';
                    scoreProc = changedObject.calc_goal_result.score - initObject.calc_goal_result.score;

                    modalContent += '<div class="card"><div class="card-header row"><div class="col-md-12"><p class="card-title-text">';

                    modalContent += 'This goal seems <span class="';
                    if (scoreProc > 0) {
                        modalContent += 'shtriched_green">' + Math.abs(scoreProc) + '%</span> more likely. '
                    } else { modalContent += 'shtriched">' + Math.abs(scoreProc) + '%</span> less likely. ' }

                    modalContent += 'This change has also reduced your financial wellness score to ';

                    if (changesResponseObj.changed_avatar_result.score > changesResponseObj.initial_avatar_result.score) {
                        modalContent += '<span class="shtriched_green">' + changesResponseObj.changed_avatar_result.score + '</span>. ';
                    } else {
                        modalContent += '<span class="shtriched">' + changesResponseObj.changed_avatar_result.score + '</span>. ';
                    }

                    modalContent += 'Are you sure you would like to continue?</p></div></div>';
                    modalContent += '<div class="card-body"><div class="row"><div class="col-md-5"><div class="row">' +
                        '<div class="col-md-3"> <img src="/img/small-icon-' + changedObject.goal_data.goal_type + '.png" alt=""/></div> ' +
                        '<div class="col-md-9"><p class="goal-name">' + changedObject.goal_data.name +
                        '</p><p class="goal-priority blue-text">' + changedObject.goal_data.priority + '</p></div>' +
                        '</div><div class="goal-date mt-3">Date &nbsp;<span class="blue-text"> ' + dateWithMonth(changedObject.goal_data.date) + '</span></div>' +
                        '<div class="goal-date">Expected cost &nbsp;<span class="blue-text">$' + changedObject.goal_data.amount.toLocaleString() + '</span></div><div class="mt-3"></div></div>';
                    modalContent += '<div class="col-md-7"><div class="row"><div class="col-md-4">' +
                        '<div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(initObject.calc_goal_result.score, initObject.calc_goal_result.state) + '">' +
                        '<div class="overlay dart-title"><p>' +
                        initObject.calc_goal_result.score + '%</p>' +
                        '<p><small>' + dateWithMonth(initObject.goal_data.date) +
                        '</small></p></div></div></div>';
                    modalContent += '<div class="col-md-4"><div class="von-bis"></div>' +
                        '<div class="row justify-content-between"><p class="col-md-6">' +
                        '<small>From</small></p><p class="col-md-6 text-right"><small>To</small></p></div></div>';
                    modalContent += '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(changedObject.calc_goal_result.score, changedObject.calc_goal_result.state) + '">' +
                        '<div class="overlay dart-title"><p>' +
                        changedObject.calc_goal_result.score +
                        '%</p><p><small>' + dateWithMonth(changedObject.goal_data.date) + '</small></p></div></div></div></div>';
                    modalContent += '<div class="row justify-content-between mt-2"><p class="col-md-6">' +
                        '<small style="display: inline-block; margin-left: 10px">Goal Achievability</small></p><p class="col-md-6 text-right">' +
                        '<small>Goal Achievability</small></p></div></div></div></div></div>';
                }
            }
        }

        // Changed Goals list
        if (changesResponseObj.changed_goals && changesResponseObj.initial_goals) {

            modalContent += ' <div class="col-md-12"><div class="row"><div class="col-md-8">' +
                '<p class="dart-title mt-2 mb-2">Impact on other goals</p></div></div></div>';

            for (var prop2 in changesResponseObj.changed_goals) {
                if (changesResponseObj.active_changed_goals.findIndex(x => x.id === changesResponseObj.changed_goals[prop2].goal_data.id) === -1) {
                    var initObject2 = findObjectByKey(changesResponseObj.initial_goals, "id", changesResponseObj.changed_goals[prop2].goal_data.id);
                    var changedObject2 = findObjectByKey(changesResponseObj.changed_goals, "id", changesResponseObj.changed_goals[prop2].goal_data.id);


                    modalContent += '<div class="card"><div class="card-body"><div class="row">' +
                        '<div class="col-md-5"><div class="row"><div class="col-md-3">' +
                        '<img src="/img/small-icon-' + initObject2.goal_data.goal_type + '.png" alt=""/></div>' +
                        '<div class="col-md-9"><p class="goal-name">' + initObject2.goal_data.name + '</p>' +
                        '<p class="goal-priority blue-text">High</p></div></div>' +
                        '<div class="goal-date mt-3">Date  &nbsp;<span class="blue-text">' + dateWithMonth(initObject2.goal_data.date) + '</span></div>' +
                        '<div class="goal-date">Left to heirs &nbsp;<span class="blue-text"> $' + initObject2.goal_data.amount.toLocaleString() + '</span></div>' +
                        '<div class="mt-3"></div></div><div class="col-md-7"><div class="row">' +

                        '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(initObject2.calc_goal_result.score, initObject2.calc_goal_result.state) + '">' +
                        '<div class="overlay dart-title"><p>' +
                        initObject2.calc_goal_result.score + '%</p><p>' +
                        '<small>' + dateWithMonth(initObject2.goal_data.date) + '</small></p></div></div></div>';

                    modalContent += '<div class="col-md-4"><div class="von-bis"></div>' +
                        '<div class="row justify-content-between"><p class="col-md-6">' +
                        '<small>From</small></p><p class="col-md-6 text-right"><small>To</small></p></div></div>' +

                        '<div class="col-md-4"><div class="radialProgressBar left-20 small" style="' +
                        progrssAchievability(changedObject2.calc_goal_result.score, changedObject2.calc_goal_result.state) + '">' +
                        '<div class="overlay dart-title"><p>' +
                        changedObject2.calc_goal_result.score +
                        '%</p><p><small>' + dateWithMonth(changedObject2.goal_data.date) + '</small></p></div></div></div></div>';
                    modalContent += '<div class="row justify-content-between mt-2">' +
                        '<p class="col-md-6"><small style="display: inline-block; margin-left: 10px">Goal Achievability</small></p>' +
                        '<p class="col-md-6 text-right"><small>Goal Achievability</small></p>' +
                        '</div></div></div> </div> </div>';
                }
            }
        }

        if(is_informational) {
            modalContent += '<div class="row"><div class="col-md-6 offset-6"><div class="row justify-content-end">' +
                '<div class="btn-group col-md-6"><button type="button" class="btn btn-blue" data-dismiss="modal" >Ok</button></div></div></div></div>';
            modalContent += '</div>';
        }else
        modalContent += '<div class="row"><div class="col-md-6 offset-6"><div class="row">' +
            '<div class="btn-group col-md-6"><button type="button" class="btn btn-grey" onclick="discardChanges()">Discard</button></div>' +
            '<div class="btn-group col-md-6"><button type="button" class="btn btn-blue" onclick="saveChanges()">Save</button></div></div></div></div>';
        modalContent += '</div>';

    }
    $('#changesModal').append(modalContent);

}


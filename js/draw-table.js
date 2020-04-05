
let priority = ['High', 'Medium', 'Low'];

function drawTable(prior = priority) {

    goalsObj = JSON.parse(localStorage.getItem('goalObject'));
    goals = goalsObj.goals;

    years = calculateYearGrid(goalsObj.profile.birthdate);

    document.getElementById("table-canvas").innerHTML = "";

    table = document.createElement("table");
    table.className = "table goals-table table-responsive";
    row = table.insertRow();

    var percentage = 80/(goals.length - 1);

    var calcWidth;
    var calcHeight;

    for (var count = 0; count < prior.length; count++) {

        var yearIter = "";
        // cell loop
        var stepCell = Math.floor(years.length/11);

        for (let i = 0; i < years.length; i++) {

            var cell = row.insertCell();

            var cellContent = "";
            if(i % stepCell == 0){cell.setAttribute('data-style', 'leftBorder');}
            cell.setAttribute('data-priority', prior[count]);
            cell.setAttribute('data-target', years[i]);
            cell.setAttribute('width', 100/(years.length-1) +'%');

                for (goalItem = 0; goalItem < goals.length; goalItem++) {

                    var goalDate = newFormatDate(goals[goalItem].date);

                    cell.setAttribute('data-type', goals[goalItem].goal_type);

                    if ( goalDate.year == years[i] && goals[goalItem].priority === prior[count]) {

                    calcWidth = 120 + (percentage * goalItem);
                    calcHeight = calcWidth - 45;
                        cellContent += "<div draggable='true' class='draggable radialProgressBar ";
                        cellContent += " progress-" + goals[goalItem].achievability +
                            "\' id=\'" + goals[goalItem].id + "\'" + " data-status-year='" + goalDate.year +"\'" +
                            "data-status-priority='" + goals[goalItem].priority + "\'" + "style='width: "+
                            calcWidth+ "px; " + " height:"+ calcWidth +
                            "px; margin-top: "+"-"+calcWidth+ "px; margin-left: "+"-"+
                            calcHeight +"px;'><div class='overlay' style='width:" + calcHeight +
                            "px; height:"+ calcHeight +
                            "px'><p>" + goals[goalItem].name +
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
            cell.colSpan = stepCell-1;

            cell.setAttribute('width', Math.ceil(100/(years.length)) +'%');
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

    // event.target.style.opacity = .5;
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
      event.target.style.background = "purple";
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
      event.target.style.background = "";
      dragged.parentNode.removeChild(dragged);
      event.target.appendChild(dragged);
    }

    dragged.setAttribute('data-status-priority', event.target.getAttribute('data-priority'));
    dragged.setAttribute('data-status-year', event.target.getAttribute('data-target'));
    dragged.setAttribute('data-status-month', event.target.getAttribute('data-target-month'));
    console.log(old_state)
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



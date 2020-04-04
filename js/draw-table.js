
let priority = ['High', 'Medium', 'Low'];

function drawTable(years, goals, prior = priority) {
    document.getElementById("table-canvas").innerHTML = "";

    table = document.createElement("table");
    table.className = "table goals-table";
    row = table.insertRow();

    var percentage = 80/(goals.length - 1);

    var calcWidth;
    var calcHeight;

    for (var count = 0; count < prior.length; count++) {

        var yearIter = "";
        // cell loop
        for (let i = 0; i < years.length; i++) {

            var cell = row.insertCell();

            insteadTable = document.createElement("table");
            insteadTable.className = "insteadTable";
            instRow = insteadTable.insertRow();

            for (let m = 1; m <= 12; m++) {

                var cellContent = "";

                var instCell = instRow.insertCell();

                for (d = 0; d < goals.length; d++) {


                    var newDate = newFormatDate(goals[d].state.target_date);

                    instCell.setAttribute('data-priority', goals[d].state.priority);
                    instCell.setAttribute('data-target', years[i]);
                    instCell.setAttribute('data-target-month', m );
                    instCell.setAttribute('data-id', goals[d].id);
                    instCell.setAttribute('data-type', goals[d].type);

                    if (newDate.year === years[i] && goals[d].state.priority === prior[count] && newDate.month == m) {

                    calcWidth = 120 + (percentage * d);
                    calcHeight = calcWidth - 45;
                        cellContent += "<div draggable='true' class='draggable radialProgressBar ";
                        cellContent += " progress-" + goals[d].achivability +
                            "\' id=\'" + goals[d].id + "\'" + " data-status-year='" + newDate.year +"\'" +
                            "data-status-priority='" + goals[d].state.priority + "\'"+ "data-status-month='" +
                            newDate.month +"' style='width: "+ calcWidth+ "px; " + " height:"+ calcWidth +
                            "px'><div class='overlay' style='width:" + calcHeight + "px; height:"+ calcHeight +
                            "px'><p>" + goals[d].name + "</p><p>" + "$" + goals[d].amount + "</p></div></div>";


                    }

                }
                instCell.className = "dropzone";
                instCell.innerHTML = cellContent;

            }
            // insteadTable.insertRow();
            cell.className = years[i];
            cell.className = "parent";
            cell.appendChild(insteadTable);
            yearIter = years[i]

        }
        // end of cell loop

        row.className = "priority-" + prior[count];
        row = table.insertRow();

    }

    // ATTACH TABLE TO CONTAINER
    document.getElementById("table-canvas").appendChild(table);
    $('.verticaltext_content').show();


}

var dragged;
var old_state;

  document.addEventListener("dragstart", function (event) {
    dragged = event.target;
    old_state = {
        priority: dragged.getAttribute("data-status-priority"),
        year: dragged.getAttribute('data-status-year'),
        month: dragged.getAttribute('data-status-month')
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

            }, false);

        });
    }
}



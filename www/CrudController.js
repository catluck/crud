////////////////////////////////////////////////////////////////////
// global vars
////////////////////////////////////////////////////////////////////
const URL = "ws://127.0.0.1:5000";
var _rows = new Object();


////////////////////////////////////////////////////////////////////
// begin here
////////////////////////////////////////////////////////////////////
function initPage()
{
	sendRefresh();
}



////////////////////////////////////////////////////////////////////
// websocket
////////////////////////////////////////////////////////////////////
function openWebsocket()
{
	var ws = new WebSocket(URL);
	return ws;
}

function sendRefresh()
{
	var ws = openWebsocket();
	ws.onopen = function(e)
	{
		var data = {command: "refresh"};
		ws.send(JSON.stringify(data));
	}
	
	ws.onmessage = function(e)
	{
		_rows = JSON.parse(e.data);
		reloadTable();
		ws.close();	
	}
}

function sendSaveRow(id)
{
	var ws = openWebsocket();
	ws.onopen = function(e)
	{
		var data = {command: "update"};
		data.payload = _rows[id];
		ws.send(JSON.stringify(data));
	}
}

function sendDeleteRow(id)
{
	var ws = openWebsocket();
	ws.onopen = function(e)
	{
		var data = {command: "delete"};
		data.id = id;
		ws.send(JSON.stringify(data));
	}
}


////////////////////////////////////////////////////////////////////
// data
////////////////////////////////////////////////////////////////////
function createEmptyRecord()
{
	var newRecord = {id: generateId(), firstName: "", lastName: "", employeeNumber: "", fromDate: "", toDate: "", reason: "", status: "New"};
	_rows[newRecord.id] = newRecord;
	addTableRow(newRecord);
}

function generateId()
{
	var id = "";
	for(;id.length < 10;) 
	{
		id += Math.random().toString(36).substr(2, 1)
	}
	return id;
}


////////////////////////////////////////////////////////////////////
// view
////////////////////////////////////////////////////////////////////
function reloadTable()
{
	$('tbody[name="request-body"]').empty();
	for (var key in _rows)
	{
		addTableRow(_rows[key]);
	}
}

function addTableRow(record)
{
	var html = "<tr id='row_" + record.id + "'>";

	// save button
	html+= "<td><button id='save_" + record.id + "' class='btn' disabled onClick=\"saveRow('" + record.id + "');this.blur()\"'>"
	html+= "<span class='glyphicon glyphicon-save'</button></td>"

	// first name
	html+= "<td>" + "<input id='firstName_" + record.id + "' class='form-control' type='text' value='" + record.firstName + "' onkeyup=\"changeFirstName('" + record.id + "')\"></td>";
	
	// last name
	html+= "<td>" + "<input id='lastName_" + record.id + "' class='form-control' type='text' value='" + record.lastName + "' onkeyup=\"changeLastName('" + record.id + "')\"></td>";

	// employee number
	html+= "<td>" + "<input id='employeeNumber_" + record.id + "' class='form-control' type='number' value='" + record.employeeNumber + "' onkeyup=\"changeEmployeeNumber('" + record.id + "')\"></td>";

	// date
	html+= "<td>";
	html+= "<div class='input-daterange input-group' id='datepicker' name='date-input'>";
	html+= "<input type='text' id='fromDate_" + record.id + "'  class='input-sm form-control' name='date' value='" + record.fromDate + "' onchange=\"changeFrom('" + record.id + "')\" />";
	html+= "<span class='input-group-addon'>to</span>";
	html+= "<input type='text' id='toDate_" + record.id + "' class='input-sm form-control' name='date'  value='" + record.toDate + "' onchange=\"changeTo('" + record.id + "')\"  />";
	html+= "</div>";

	// reason
	html+= "<td>" + "<input id='reason_" + record.id + "' class='form-control' type='text' value='" + record.reason + "' onkeyup=\"changeReason('" + record.id + "')\"></td>";

	// status
	html+= "<td><div class='dropdown'>";
	html+= "<button id='status_" + record.id + "' class='btn btn-primary dropdown-toggle dropdown-toggle-split' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
	html+= record.status + "</button>";
	html+= "<ul class='dropdown-menu'>";
	html+= "<li><a class='dropdown-item' onClick=\"changeStatus('" + record.id +  "', 'New')\">New</a></li>";
	html+= "<li><a class='dropdown-item' onClick=\"changeStatus('" + record.id +  "', 'Approved')\">Approved</a></li>";
	html+= "<li><a class='dropdown-item' onClick=\"changeStatus('" + record.id +  "', 'Rejected')\">Rejected</a></li>";
	html+= "</ul></div></td>";

	// delete
	html+= "<td><button class='btn btn-danger btn' onClick=\"deleteRow('" + record.id + "');\">"
	html+= "<span class='glyphicon glyphicon-remove' </span></button></span></td>"
	html+= "</tr>";

	$('tbody[name="request-body"]').append(html);
	
	var date_input=$('div[name="date-input"]');
	date_input.datepicker({
		startDate: "tomorrow",
		autoclose: "true"
	});
	var date = $('input[name="date"]');
}


////////////////////////////////////////////////////////////////////
// controller
////////////////////////////////////////////////////////////////////
function changeStatus(id, status)
{
	_rows[id].status = status;
	var button = $("#status_" + id);
	button.text(status);
	changeRow(id);
}

function changeFirstName(id)
{
	_rows[id].firstName = $("#firstName_" + id).prop('value');
	changeRow(id);
}

function changeLastName(id)
{
	_rows[id].lastName = $("#lastName_" + id).prop('value');
	changeRow(id);
}

function changeEmployeeNumber(id)
{
	_rows[id].employeeNumber = $("#employeeNumber_" + id).prop('value');
	changeRow(id);
}

function changeFrom(id)
{
	_rows[id].fromDate = $("#fromDate_" + id).prop('value');
	changeRow(id);
}

function changeTo(id)
{
	_rows[id].toDate = $("#toDate_" + id).prop('value');
	changeRow(id);
}

function changeReason(id)
{
	_rows[id].reason = $("#reason_" + id).prop('value');
	changeRow(id);
}

function changeRow(id)
{
	var row = $("#row_" + id);
	row.addClass('success');
	var save = $("#save_" + id);
	save.prop('disabled', false);
	save.addClass('btn-success');
}

function saveRow(id)
{
	var row = $("#row_" + id);
	row.removeClass('success');
	var save = $("#save_" + id);
	save.prop('disabled', true);
	save.removeClass('btn-success');
	sendSaveRow(id);
}

function deleteRow(id)
{
	var row = $("#row_" + id);
	row.remove();
	sendDeleteRow(id);
	delete _rows[id];
}


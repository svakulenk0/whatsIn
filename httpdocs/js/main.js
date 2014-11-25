// Google charts

google.load("visualization", "1", {packages:["corechart", "table"]});
google.setOnLoadCallback(drawCharts);

function drawCharts() {
	var lda_table = drawTable();

	jsfiles = ['genre', 'lang', 'otlang', 'lda' + factors]

	$.each(jsfiles, function(n, file) {
		$.getJSON('json/' + file, function(data) {
			var table = new google.visualization.DataTable();
			table.addRows(data.length);
			table.addColumn('string', 'Category');
			table.addColumn('number', '# Apps');

			$.each(data, function(i, v)	{
				// if (n == 0){
				// 	name = v._id[0]
				// }
				// else {
				name = v._id
				// }
				table.setValue(i, 0, name);
				table.setValue(i, 1, v.total);
			});

			var options = {
				title: file,
			};
			var chart = new google.visualization.PieChart(document.getElementById('piechart' + n));
			chart.draw(table, "");
		    google.visualization.events.addListener(chart, 'select', function() {
		    	// $("jumbotron").focus();
      			var factorID = table.getValue(chart.getSelection()[0].row, 0);
				lda_table.setSelection([{row: factorID, column: null}]);
		    });
		});
	});
}

function drawTable() {
    var table = new google.visualization.Table(document.getElementById('lda_table'));
	// grab the CSV

	$.ajax({
	   type: "GET",
	   url: "csv/topics"+factors+".csv",
	   dataType: "text"
	}).done(function (csvString) {
		// transform the CSV string into a 2-dimensional array
		var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});

		// this new DataTable object holds all the data
		var data = new google.visualization.arrayToDataTable(arrayData);
		table.draw(data, {showRowNumber: false, width: 1150});
	});

	return table;
}
$(document).ready(function(){
	d3.json("2012_passing.json",function(data){
		data_graphic({
			chart_type : "bar",
    		title: "Football",
   			description: "This graphic shows a time-series of downloads.",
    		data: data,
    		width: 600,
    		height: 500,
    		target: '#chart_here',
    		y_accessor: "name",
    		x_accessor: "passing_yds",


		})})
	})

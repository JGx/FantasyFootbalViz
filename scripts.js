$(document).ready(function(){
    $.get("playersHash.json",function(data){ player_lookup = data; });
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


		})});
    $(function(){
   // player_list = ["Peyton Manning", "Eli Manning", "Archie Manning"]
    $.get("player_list.txt", function(data){
        player_list = data.split(",");
        jQuery( "#player_input" ).autocomplete({
        source: player_list
        });
    });

});
	});

current_data = null;
$("#go").click(function(){
    console.log("here");
    query = "player_data/" + $("#player_input").val().replace(" ","").split(" ").join("_") + ".json";
   // console.log("query");
   // $.get(query, function(data) {
     //   current_data = data;
       // console.log(data);

        function initGraph(){
            d3.json(query,function(data){
                console.log(data);
             data_graphic({
          title: "Peyton Manning Passing Yards",
          description: "This graphic shows passing yard by week in 2009",
          data: [data['P.Manning'][2009],data['P.Manning'][2010],data['P.Manning'][2011],data['P.Manning'][2012]],
          legend: ['2009','2010','2011','2012'],
          legend_target: '#first #legend',
          width: 800,
          height: 500,
          target: '#first #chart',
          y_accessor: "passing_yds",
          x_accessor: "week",
          //markers: [{'week':'6', 'label': "Bye"}],
            })
        /*data_graphic({
            chart_type : "line",
          title: "P.Manning Passing Yards",
          description: "This graphic shows passing yard by week in 2009",
          data: data['P.Manning'][2009],
          width: 800,
          height: 500,
          target: '#second',
          markers: [{'week':'6', 'label': "Bye"}],
          y_accessor: "passing_yds",
          x_accessor: "week",
      })*/
        })
        }
        initGraph();
    });

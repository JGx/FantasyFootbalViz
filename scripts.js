$(document).ready(function(){
    $.get("playersHash.json",function(data){ player_lookup = data; });
	/**
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
**/
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
    function newGraph(q){
  d3.json(q,function(player_data){
    p_name = $("#player_input").val();
    p_code = Object.keys(player_data)[0]
    console.log(p_code);
    var series =[];
    var max_y = 0;
    for(var week_data in player_data[p_code][2009]){
      var x_val = parseInt(player_data[p_code][2009][week_data]['week']);
      var y_val = player_data[p_code][2009][week_data]['active'] == 'true' ? player_data[p_code][2009][week_data]['passing_yds'] : null;
      if(y_val > max_y){
        max_y = y_val;
      }
      series.push({x:x_val, y:y_val})
    }

    console.log(series);

    var data = d3.range(40).map(function(i) {
      return {x: i / 39, y: i % 5 ? (Math.sin(i / 3) + 2) / 4 : null};
    });
    console.log(data);
    data = series;

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $('.container').width() - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
    .domain([1,17])
    .range([0, width]);

    var y = d3.scale.linear()
    .domain([0,Math.ceil(max_y/50)*50])
    .range([height, 0]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var line = d3.svg.line()
    .defined(function(d) { return d.y != null; })
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

    var area = d3.svg.area()
    .defined(line.defined())
    .x(line.x())
    .y1(line.y())
    .y0(y(0));

    var svg = d3.select("#second").append("svg")
    .datum(data)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
    .attr("class", "area")
    .attr("d", area);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    svg.append("path")
    .attr("class", "line")
    .attr("d", line);

    svg.selectAll(".dot")
    .data(data.filter(function(d) { return d.y; }))
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5);
  })
}



        //initGraph();
        $("#second").empty();
        newGraph(query);
    });

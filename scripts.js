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
    $.get("list_with_pos.txt", function(data){
        player_list = data.split(",");
        jQuery( "#player_input_one" ).autocomplete({
        source: player_list
        });
        jQuery("#player_input_two").autocomplete({
            source: player_list
        });
        })
    });

});


    function newGraph(q, num){
  d3.json(q,function(player_data){
    if (num == 1) p_name = $("#player_input_one").val();
    else p_name = $("#player_input_two").val();
    console.log(p_name);
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
    if (num == 1) target = "#first"
        else target = "#second"
    var svg = d3.select(target).append("svg")
    .datum(data)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("path")
    // .attr("class", "area")
    // .attr("d", area);

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
    .attr("r", 3.5)
    .on("mouseover",function(){
                    console.log("mouse over point");
                    console.log(d3.mouse(this)[0]);
                    var x0 = Math.round(x.invert(d3.mouse(this)[0]));
                    console.log("x0 is",x0);
                    pcode = Object.keys(player_data)[0],
                    i = player_data[pcode][2009][x0-1]['passing_yds'];
                    console.log("passing yards is",i);
                  });
  })
}


function add2Graph(q){
  d3.json(q,function(player_data){

      p_name = $("#player_input_two").val();

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

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = $('.container').width() - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


    var x = d3.scale.linear()
      .domain([1,17])
      .range([0, width]);

    var y = d3.scale.linear()
    .domain([0,Math.ceil(max_y/50)*50])
    .range([height, 0]);

      var line2 = d3.svg.line()
        .defined(function(d) { return d.y != null; })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

      var area2 = d3.svg.area()
      .defined(line2.defined())
      .x(line2.x())
      .y1(line2.y())
      .y0(y(0));


      var svg = d3.select("#first > svg > g")
      svg.append("path")
        .attr("class", "line2")
        .attr("d", line2(series));

      //   svg.append("path")
      // .attr("class", "area2")
      // .attr("d", area2);

      svg.selectAll(".two .dot")
        .data(series.filter(function(d) { return d.y; }))
        .enter().append("circle")
        .attr("class", "two dot")
        .attr("cx", line2.x())
        .attr("cy", line2.y())
        .attr("r", 3.5);
    })
}


$("#go_two").click(function(){
    console.log("here");
    if ($("#pos").val() == "all") { query = "player_data/" + $("#player_input_two").val().slice(0,-3).replace(" ","").split(" ").join("_") + ".json"; }
        else { query = "player_data/" + $("#player_input_two").val().replace(" ","").split(" ").join("_") + ".json"; }
   // console.log("query");
   // $.get(query, function(data) {
     //   current_data = data;
       // console.log(data)
        //initGraph();
        $("#second").empty();
        add2Graph(query);
       // newGraph(query,2);
    });



current_data = null;
$("#go_one").click(function(){
    console.log("here");
    if ($("#pos").val() == "all") { query = "player_data/" + $("#player_input_one").val().slice(0,-3).replace(" ","").split(" ").join("_") + ".json"; }
        else { query = "player_data/" + $("#player_input_one").val().replace(" ","").split(" ").join("_") + ".json"; }
    
   // console.log("query");
   // $.get(query, function(data) {
     //   current_data = data;
       // console.log(data)
        //initGraph();
        $("#first").empty();
        newGraph(query,1);
    });


$("#pos").change(function(){
    target = "";
    switch($("#pos").val()){
        case "all":
            target = "list_with_pos.txt";
            break;
        case "qb":
            target = "qbs.txt";
            break;
        case "rb":
            target = "rbs.txt";
            break;
        case "wr":
            target = "wrs.txt";
            break
        case "te":
            target = "tes.txt";
            break;

    }
    $.get(target, function(data){
        player_list = data.split(",");
        jQuery( "#player_input_one" ).autocomplete({
        source: player_list
        });
        jQuery("#player_input_two").autocomplete({
            source: player_list
        });
    });
});

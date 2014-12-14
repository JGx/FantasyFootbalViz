var graphCreated = false;
var yearsList = [];
var currQuery1 = "";
var currQuery2 = "";
var x;
var y;
var player1_data;
var p1fan_data;
var p1pcode;
var avg1, avg2;
var max_max = 0;


//D3 Graph variables
var svg;
var line;
var area;
var chart_w;

$(document).ready(function(){

  $(function() {
    $( "#slider" ).slider({
      min:2009,
      max:2014,
      range:true,
      change: function(event, ui){

        var years = $("#slider").slider("option","values");
        newYearsList = [];
        for (y=years[0]; y<years[1]+1; y++){
         newYearsList.push(y);
       }

       if(graphCreated){
        if (yearsList.length!= newYearsList.length) {
          yearsList = newYearsList;
          newGraphYears(); 
        };
      } else{
        yearsList = newYearsList;
      }
          // console.log("yearslist is",yearsList);
        },
      });
      //set value to be 2009-2014
      $("#slider").slider("option","values",[2009,2014]);
    });

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

function getDataPoints(player_data, p_code, years, data){
  var max_y = 0;
  for(var index in years){
    year = years[index];
    for(var week_data in player_data[p_code][year]){
      var x_val = parseInt(player_data[p_code][year][week_data]['week']);
      if(x_val == 13 && year == 2014){
      }
      x_val = x_val + (17 * index);
      var y_val = player_data[p_code][year][week_data]['active'] == 'true' ? player_data[p_code][year][week_data]['passing_yds'] : null;
      if(y_val > max_y){
        max_y = y_val;
      }
      data.push({x:x_val, y:y_val})
    }
  }
  return max_y;
}

function newGraph(q, num, q2){
  d3.json(q,function(player_data){
    if (num == 1) p_name = $("#player_input_one").val();
    else p_name = $("#player_input_two").val();
     p1pcode = Object.keys(player_data)[0];

    //var data = [];
   // var max_y  = getDataPoints(player_data, p_code, yearsList, data);

//    var data = [];
var max_y;
    //var data = 
    get_fan_data(num, function(data, max_y){
      if (max_max > max_y) max_y = max_max;
      else max_max = max_y;
      p1fan_data = data;
           //   avg1 = find_avg_fan(data);
        $('#sidebar #key1stats').html('<h1>'+find_avg_fan(data).toFixed(2)+"</h1>");
   // while (data.length == 0) console.log(data);
   //   console.log(data);
   //   max_y = find_max_fan(data);
   
    //var max_y = find_max_fan(data);

    // console.log(data);
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $('#first').width() - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    console.log("New Graph Width: " + width);
    console.log("New Graph Height: " + height);


    // console.log("YOOOOO", data[data.length -1].x);

    console.log(data);

    x = d3.scale.linear()
    .domain([1,data[data.length -1].x])
    .range([10, width]);

    y = d3.scale.linear()
    .domain([0,Math.ceil(max_y/5)*5])

    .range([height, 0]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var week_num = ((d.x - 1) % 17) + 1;
      if(d.x <= 17){week_num = d.x;}
      return "<strong>Week:</strong> <span style='color:red'>" + week_num + "</span>";
    })

    line = d3.svg.line()
    .defined(function(d) { return d.y != null; })
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

    area = d3.svg.area()
    .defined(line.defined())
    .x(line.x())
    .y1(line.y())
    .y0(y(0));
    target = "#first";  

    svg = d3.select(target).append("svg")
    .datum(data)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);
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
    .attr("class", "one dot")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

    svg.selectAll("line.verticalGrid").data(x.ticks(data.length)).enter()
    .append("line")
    .attr(
    {
      "class":"horizontalGrid",
      "x1" : function(d){ 
        if(d%17 == 1 && d > 17){
          return (x(d) + x(d-1))/2;
        }
        return null;
      },
      "x2" : function(d){ 
        if(d%17 == 1 && d > 17){
          return (x(d) + x(d-1))/2;
        }
        return null;
      },
      "y1" : height,
      "y2" : 0,
      "fill" : "none",
      "shape-rendering" : "crispEdges",
      "stroke" : "#666",
      "stroke-width" : "1px",
      "stroke-dasharray":("3, 3")
    });


    svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", mouseover);

    function mouseover(){
      // console.log(d3.mouse(this)[0]);
      var x0 = Math.round(x.invert(d3.mouse(this)[0]));
      
      pcode = Object.keys(player_data)[0];
      var startingYear = yearsList[0];
      var addYear = Math.floor( Math.abs(x0 -1)  / 17);
      var actualYear = startingYear + addYear;

      //check if data exists
      //if not, print a message
      var week = ((x0-1) % 17);
     // if(player_data[pcode][actualYear][week]['active']){
       // i = player_data[pcode][actualYear][week]['passing_yds'];
        i = data[x0].y;
        tableAppend(actualYear, week+1, 1, pcode, i);

       // $('#sidebar #key1stats').html('<p>'+"Season "+actualYear+" Week "+week+" passing yards is"+i+'</p>');
   //   }

      //assign to the global variable
      player1_data = player_data;
      p1pcode = pcode;
    }

    graphCreated = true;
    addLegend(1, p_code);
    chart_w = $("#first").width();

    //if a second line is needed
    if(typeof q2 === "undefined"){ 
      //No second line
    }
    else{
      add2Graph(q2, 2)
    }


  });
});
}



function add2Graph(q, num){
  d3.json(q,function(player_data){

    if (num == 1) p_name = $("#player_input_one").val().slice(0,-3);
    else p_name = $("#player_input_two").val().slice(0,-3);
   // p_code = Object.keys(player_data)[0]
    //var series = [];
    //var max_y  = getDataPoints(player_data, p_code, yearsList, series);
    var series = get_fan_data(num, function(series, max_y){
      if (max_max > max_y) max_y = max_max;
      else max_max = max_y;
        $('#sidebar #key2stats').html('<h1>'+find_avg_fan(series).toFixed(2)+'</h1>');
    //var max_y = find_max_fan(series);


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $('#first').width() - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    if(num == 1){
      $("#first > svg > g .line").remove();
      $("#first > svg > g .one.dot").remove();
      svg.append("path")
      .attr("class", "line")
      .attr("d", line(series));

      svg.selectAll(".one .dot")
      .data(series.filter(function(d) { return d.y; }))
      .enter().append("circle")
      .attr("class", "one dot")
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 3.5);
    }
    else if(num == 2){
      $("#first > svg > g .line2").remove();
      $("#first > svg > g .two.dot").remove();
      svg.append("path")
      .attr("class", "line2")
      .attr("d", line(series));

      svg.selectAll(".two .dot")
      .data(series.filter(function(d) { return d.y; }))
      .enter().append("circle")
      .attr("class", "two dot")
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 3.5);
      addLegend(2, p_code);
    }

    svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", mouseover);

    function mouseover(){
      // console.log(d3.mouse(this)[0]);
      var x0 = Math.round(x.invert(d3.mouse(this)[0]));
      
      pcode = Object.keys(player_data)[0];
      var startingYear = yearsList[0];
      var addYear = Math.floor( Math.abs(x0 -1)  / 17);
      var actualYear = startingYear + addYear;


      console.log("PLAYER 1 is",player1_data);
      console.log("P1 PCODE IS", p1pcode);
      //check if data exists
      //if not, print a message
      console.log(x0);

      var week = ((x0) % 17);
      console.log(week);
     // if(player_data[pcode][actualYear][week]['active']){
    //  if (series[x0-1].y != null){
      //  i = player_data[pcode][actualYear][week]['passing_yds'];
        i = series[x0-1].y;
        tableAppend(actualYear, week, 2, pcode, i)
     //   $('#sidebar #key2stats').html('<p>'+"Season "+actualYear+" Week "+week+" passing yards is"+i+'</p>');
    //  }

      //check player 1
      
     // if(player1_data[p1pcode][actualYear][week]['active']){
     // if (p1fan_data[x0-1].y != null){
    //    i = player1_data[p1pcode][actualYear][week]['passing_yds'];
        //console.log(player1_data);
         i = p1fan_data[x0-1].y;
      // } else i = "Did Not Play"

        tableAppend(actualYear, week, 1, p1pcode, i)
      //  $('#sidebar #key1stats').html('<p>'+"Season "+actualYear+" Week "+week+" passing yards is"+i+'</p>'); 
      
      
    }
  })
});
}


$("#go_two").click(function(){
  // console.log("Player 2 click");
  //if ($("#pos").val() == "all") { 
    currQuery2 = "player_data/" + $("#player_input_two").val().slice(0,-3).replace(" ","").split(" ").join("_") + ".json";
    // }
  //else { currQuery2 = "player_data/" + $("#player_input_two").val().replace(" ","").split(" ").join("_") + ".json"; }

  $("#second").empty();
  if(!graphCreated){
    newGraph(currQuery2,2);
  }
  else{
    add2Graph(currQuery2, 2);
  }
});



current_data = null;
$("#go_one").click(function(){
  find_image();

  //  get_fan_data();

  currQuery1 = "player_data/" + $("#player_input_one").val().slice(0,-3).replace(" ","").split(" ").join("_") + ".json"; 
  //else { currQuery1 = "player_data/" + $("#player_input_one").val().replace(" ","").split(" ").join("_") + ".json"; }


  $("#first").empty();
  if(currQuery2 != ""){
    newGraph(currQuery1,1, currQuery2);
  }
  else{
    newGraph(currQuery1,1);
  }
});

$(window).resize(function(){
  if(graphCreated == true){
    if(chart_w != $("#first").width()){
      chart_w ==  $("#first").width();
      newGraphYears();
    }
  }

});
// $("#first").on('resize',function( event, ui ){
//   console.log("RESIZED");
//   $("#first").empty();
//   if(currQuery1 != ""){
//     if(currQuery2 != ""){
//       newGraph(currQuery1,1, currQuery2);
//     }
//     else{
//       newGraph(currQuery1,1);
//     }
//   }
// });


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


function addLegend(line_num, name){
  var target;
  if(line_num == 1){target = $('#sidebar #key1')}
    else if(line_num == 2){target = $('#sidebar #key2')}
      target.html(name);
  }

  function newGraphYears(){
    $("#first").empty();
  
    if(currQuery2 != ""){
        newGraph(currQuery1,1,currQuery2);
   //   add2Graph(currQuery2, 2);
    } else newGraph(currQuery1,1);
  }


  function tableAppend(season, week, player_num, player_name, points){
    var panel_head = "Week "+ week +", " + season;
        if (points == null) points = "Inactive";
        else points = parseFloat(points).toFixed(2);

    var player_row = '<td>'+player_name+'</td> <td>'+points+'</td>';
    if( $('.data-display .panel-heading').text() != panel_head){
      $('.data-display .panel-heading').text(panel_head);
    }
    $('.data-display .table tbody .player_'+player_num).html(player_row);
    $('.data-display').show();
  }

  function get_fan_data(num, callback){

    fan_data = [];
    max = 0;
  //  if ($("#pos").val() == "all") { 
   if(num == 1) nm = "#player_input_one";
   else nm = "#player_input_two";
   query = "player_data/" + $(nm).val().slice(0,-3).replace(" ","").split(" ").join("_") + ".json"; 
      //}
  //  else { query = "player_data/" + $("#player_input_one").val().replace(" ","").split(" ").join("_") + ".json"; }
  d3.json(query,function(player_data){
    d3.json("points_lookup.json", function(lookup_data){
      p_code = Object.keys(player_data)[0];
           // fan_data[2009] = []
           // console.log(lookup_data);
           //years = ['2009','2010','2011','2012', '2013', '2014'];
           my_week = 1;
           for (var year in yearsList) {
           // fan_data = [];
           this_week = 0;
           
           var y = yearsList[year];
           //console.log(years[y]);
           for (var week in player_data[p_code][y]){
               // fan_data[years[year]][my_week] = 0;
                //console.log(player_data[p_code])
                if(player_data[p_code][y][week]['week'] > 0 && player_data[p_code][y][week]['week'] < 18){
                  console.log("here")
                //fan_data[years[year]][my_week] = 0;
                // console.log(player_data[p_code][2013][week]);
                //fan_data[player_data[p_code][2009][week]['week']] = 0;
                for (var cat in player_data[p_code][y][week]){
                    // console.log(player_data[p_code][2013][week]['week']);
                    // console.log(lookup_data);
                    if (lookup_data[cat] != null && cat != 'week'){
                        // console.log(cat, player_data[p_code][2013][week][cat], parseFloat(lookup_data[cat]));

                        //fan_data[years[year]][my_week] 
                        this_week += (lookup_data[cat] * player_data[p_code][y][week][cat]);
                      }
                    }


   //             my_week++;
 }

//                fan_data[2009][week] = 0;
  //              for (var cat in Object.keys(player_data[p_code][2009][week])) {
    //                fan_data['2009'][week] += (player_data[p_code][2009][week][cat] * lookup_data[cat]);
      //          }

      if (!(player_data[p_code][y][week]['active'] == 'false')){
      //  if (! this_week == 0){

        fan_data.push({ 'x' : my_week, 'y' : this_week });
      } else fan_data.push({ 'x' : my_week, 'y' : null });
      if (this_week > max) max = this_week;
      this_week = 0;
      my_week++;
    }
  }
      //       console.log(fan_data);
      callback(fan_data, max);
    })
});

}

function find_avg_fan(arr){
  total = 0;
  count = 0;
  for (i in arr){
    if (arr[i]['y'] != null){
      total+= arr[i]['y'];
      count ++;
    }

  }
  return total / count;

}

function find_max_fan(arr){
  max = 0;
  for (i in arr){
    if (arr[i]['y'] > max) max = arr[i]['y'];
  }
  return max;
}

function find_image(){
 accountKey = Base64.encode(":1326ZuD4vgsXUuOPy1B68m3A9B9w5fun0ddmpWM/1WU");
  query = "https://api.datamarket.azure.com/Bing/Search/v1/Image?Query=%27Peyton%20Manning%27&Options=%27json%27"// + encodeURIComponent("Appid=1326ZuD4vgsXUuOPy1B68m3A9B9w5fun0ddmpWM/1WU");

  //accountKeyBytes = Base64.encodeBase64((accountKey + ":" + accountKey).getBytes());      
  //accountKeyEnc = new String(accountKeyBytes);

  $.ajax({
    url: query,
    headers : { "Authorization" : "Basic " + accountKey}
  }).done(function(data,x,y,z){ console.log(z); });
}

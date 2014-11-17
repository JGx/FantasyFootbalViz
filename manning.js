$(document).ready(function(){
	initManningGraph();
})


function initManningGraph(){
    d3.json("ManningPassing.json",function(data){
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

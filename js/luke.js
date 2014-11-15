$(function() {
    d3.json('../metrics-graphics-1.0.0/data/ufo-sightings.json', function(data) {
    //    data = convert_dates(data, 'year');
        data_graphic({
            title: "UFO Sightings",
            description: "Yearly UFO sightings from the year 1945 to 2010.",
            data: data,
            width: 500,
            height: 150,
            target: '#second',
            x_accessor: 'year',
            y_accessor: 'sightings',
            markers: [{'year': 1964, 'label': '"The Creeping Terror" released'}]
        })

    })
});
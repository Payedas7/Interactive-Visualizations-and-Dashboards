
// get value on change select
function getValue() {
    value = document.querySelector("select").value;
    getDataPie(value);
    getDataTable(value);
    getDataGauge(value);
    getDataBubble(value);
}

// populate the select dropdown on load 
function dropDown() {
    // data route
    var url = "/names";

    var list = Plotly.d3.select("#sampleList").append('select').attr("onchange", "getValue()")

    Plotly.d3.json(url, function (error, namesList) {
        if (error) return console.warn(error)

        list.selectAll('option')
            .data(namesList)
            .enter()
            .append('option')
            .text(function (d) { return d; });
    });
}
// call back function to get data on change select to update the table
function getDataTable(sample_id) {
    var url_meta = "/metadata/" + sample_id;

    Plotly.d3.select("tbody").html("");

    Plotly.d3.json(url_meta, function (error, initDataMeta) {
        Plotly.d3.select("tbody").selectAll("tr")
            .data(initDataMeta)
            .enter()
            .append("tr")
            .html(function (d) {
                return `<td>${Object.keys(d)}</td><td>${d[Object.keys(d)]}</td>`
            })
    });


}

// call back function to get data on change select to update the pie
function getDataPie(sample_id) {
    var url = "/samples/" + sample_id;
    Plotly.d3.json(url, function (error, pieData) {
        if (error) return console.warn(error)

        var update = {
            values: [Object.values(pieData.sample_values)],
            labels: [Object.values(pieData.otu_ids)]
        };

        restylePlotly(update);
    });
};

// call back function to get data on change select to update the bubble
function getDataBubble(sample_id) {
    var url = "/samples/" + sample_id;
    Plotly.d3.json(url, function (error, bubbleData) {
        if (error) return console.warn(error)

        var update = {
            x: [Object.values(bubbleData.otu_ids)],
            y: [Object.values(bubbleData.sample_values)],
            'marker.size': [Object.values(bubbleData.sample_values)],
            'marker.color': [Object.values(bubbleData.otu_ids)]
        };

        restylePlotlyBubble(update);
    });
};

// call back function to update the bubble plot on change select
function restylePlotlyBubble(update) {
    var BUBBLE = document.getElementById("plotBubble");
    Plotly.restyle(BUBBLE, update);
}

// call back function to update the pie plot on change select
function restylePlotly(update) {
    var PIE = document.getElementById("plotPie");
    Plotly.restyle(PIE, update);
}

// call back function to get data on change select to update the gauge chart
function getDataGauge(sample_id) {
    var url_gauge = "/wfreq/" + sample_id;

    Plotly.d3.json(url_gauge, function (error, dataGaugue) {

        gaugeChart(dataGaugue);
    });
}

// actions to take on page load
function init() {

    // populate the dropdown
    dropDown();

    // update the pie with default values(BB_940)
    var urlPie = "/samples/BB_940";
    Plotly.d3.json(urlPie, function (error, initDataPie) {
        if (error) return console.warn(error)

        var data = [{
            values: Object.values(initDataPie.sample_values),
            labels: Object.values(initDataPie.otu_ids),
            type: "pie"
        }];

        var layout = {
        font: {family:"Balto"}
            };

        Plotly.plot("plotPie", data,layout);

    });

    // update the meta data with default values(BB_940)
    var url_meta = "/metadata/BB_940";
    Plotly.d3.json(url_meta, function (error, initDataMeta) {
        Plotly.d3.select("tbody").selectAll("tr")
            .data(initDataMeta)
            .enter()
            .append("tr")
            .html(function (d) {
                return `<td>${Object.keys(d)}</td><td>${d[Object.keys(d)]}</td>`
            })
    });

    // update the gauge chart with default values(BB_940)
    var urlGauge = "/wfreq/BB_940";
    Plotly.d3.json(urlGauge, function (error, dataGaugue) {
        if (error) return console.warn(error)

        var wfreq = dataGaugue

        // Enter a washing freq between 0 and 180
        const coefficient = 180 / 10;
        var level = coefficient * wfreq

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';

        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var data = [{
            type: 'scatter',
            x: [0], y: [0],
            marker: { size: 20, color: '#BF0803' },
            showlegend: false,
            name: 'Washing Frequency',
            text: wfreq,
            hoverinfo: 'text+name'
        },
        {
            values: [5 / 5, 5 / 5, 5 / 5, 5 / 5, 5 / 5, 5],
            rotation: 90,
            text: ['Frequently', 'Above-Average', 'Average', 'Below-Average',
                'Seldom', ''],
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: ['#459373', '#6EAB92',
                    '#97C3B1', '#C1DBD0',
                    '#EAF3EF',
                    'rgb(255,255,255']
            },
            labels: ['8-10', '6-8', '4-6', '2-4', '0-2', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
        }];

        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '#BF0803',
                line: {
                    color: '#BF0803'
                }
            }],
            font: {family:"Balto"},
            height: 500,
            width: 400,
            xaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            },
            yaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            }
        };

        Plotly.newPlot('plotGauge', data, layout);

    });

    // update the bubble chart with default values(BB_940)
    var urlBubble = "/samples/BB_940";
    Plotly.d3.json(urlBubble, function (error, initDataBubble) {
        if (error) return console.warn(error)

        var trace1 = {
            x: Object.values(initDataBubble.otu_ids),
            y: Object.values(initDataBubble.sample_values),
            mode: 'markers',
            marker: {
              size: Object.values(initDataBubble.sample_values),
              color: Object.values(initDataBubble.otu_ids)
            }
          };
          
          var data = [trace1];
          
          var layout = {

            font: {family:"Balto"},
            showlegend: false,
            xaxis:{
                title : "OTU(Operational Taxonomic Unit) ID"
            },

            yaxis:{
                title : "Sample Values"
            },
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('plotBubble', data, layout);

    });




};

// populate the select dropdown on load 
function dropDown() {
    // data route
    var url = "/names";

    var list = Plotly.d3.select("#sampleList").append('select').attr("onchange", "getValue()")

    Plotly.d3.json(url, function (error, namesList) {
        if (error) return console.warn(error)

        list.selectAll('option')
            .data(namesList)
            .enter()
            .append('option')
            .text(function (d) { return d; });
    });
}


function gaugeChart(wfreq) {

    // Enter a washing freq between 0 and 180

    const coefficient = 180 / 10;
    var level = coefficient * wfreq

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';

    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
        type: 'scatter',
        x: [0], y: [0],
        marker: { size: 20, color: '#BF0803' },
        showlegend: false,
        name: 'Washing Frequency',
        text: wfreq,
        hoverinfo: 'text+name'
    },
    {
        values: [5 / 5, 5 / 5, 5 / 5, 5 / 5, 5 / 5, 5],
        rotation: 90,
        text: ['Frequently', 'Above-Average', 'Average', 'Below-Average',
            'Seldom', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['#459373', '#6EAB92',
            '#97C3B1', '#C1DBD0',
            '#EAF3EF',
            'rgb(255,255,255']
        },
        labels: ['8-10', '6-8', '4-6', '2-4', '0-2', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    var layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '#BF0803',
            line: {
                color: '#BF0803'
            }
        }],

        height: 500,
        width: 400,
        xaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        }
    };

    Plotly.newPlot('plotGauge', data, layout);

}



// on page load
init();

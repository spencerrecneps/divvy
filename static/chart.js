var margin = {
    top: 50,
    right: 20,
    bottom: 50,
    left: 50
},
    width = 550 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize * 2,
    buckets = 9,
    //colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
    colors = ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
    days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    times = ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];

function drawTripData(data) {
    //console.log(data);
    
    d3.select("#chart").selectAll("svg").remove();
    
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) {
            return d.count_trips;
        })])
        .range(colors);
    
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * gridSize;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("font-size", gridSize / 2)
        .attr("class", function (d, i) {
            return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
        });

    var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return i * gridSize;
        })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("font-size", gridSize / 2)
        .attr("class", function (d, i) {
            return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
        });
    var heatMap = svg.selectAll(".hr")
        .data(data)
        .enter().append("rect")
        .attr("x", function (d) {
            return (d.hr) * gridSize;
        })
        .attr("y", function (d) {
            return (d.dow) * gridSize;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    heatMap.transition().duration(500)
        .style("fill", function (d) {
            return colorScale(d.count_trips);
        });

    heatMap.append("title").text(function (d) {
        return d.count_trips;
    });

    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function (d) {
            return d;
        })
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function (d, i) {
            return legendElementWidth * i;
        })
        .attr("y", height)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function (d, i) {
            return colors[i];
        });

    legend.append("text")
        .attr("class", "mono")
        .attr("font-size", gridSize / 2)
        .text(function (d) {
            return "≥ " + Math.round(d);
        })
        .attr("x", function (d, i) {
            return legendElementWidth * i;
        })
        .attr("y", height + gridSize);
}
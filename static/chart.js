
function drawTripData(data) {
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
    //colors = ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
    colors = ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
    days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    times = ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];
    
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
        .attr("class", function (d, i) {
            return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek chart-label" : "dayLabel mono axis chart-label");
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
        .attr("class", function (d, i) {
            return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime chart-label" : "timeLabel mono axis chart-label");
        });
    var heatMap = svg.selectAll(".hour")
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
        .attr("class", "mono chart-label")
        .text(function (d) {
            return "≥ " + Math.round(d);
        })
        .attr("x", function (d, i) {
            return legendElementWidth * i;
        })
        .attr("y", height + gridSize);
    
    drawAvgBar(data);
}

function drawAvgBar(raw) {
	
	var	margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
	},
	width = 20,
    height = 250;
	
	d3.select("#bar").selectAll("svg").remove();
	
	var data = [{
			total: d3.sum(raw, function (d) { return d.count_trips } ),
			average: 1997,  //hard coded from dataset
			max: 13171
	}]
	console.log(data);
	var svg = d3.select("#bar").append("svg")
    .attr("width", 140)
    .attr("height", 250 + margin.top + margin.bottom)
    .append("g");
	
	var barChart = svg.selectAll(".barchart")
    .data(data)
    .enter().append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 2)		//for rounded corners
    .attr("ry", 2)
    .attr("class", "barchart")
    .attr("width", 20)
    .attr("height", function (d) { return height * d.total / d.max } )
    .attr("transform", "translate(" + ( width + margin.left ) + "," + 190 + ") rotate(180)")
    .style("fill", "#2171b5");
	
	barChart.append("title").text(function (d) {
        return +d.total + " total trips";
    });
	
	svg.append("line")
	.data(data)
	.attr("x1", 0)
	.attr("x2", width + 40)
	.attr("y1", function (d) { return height * d.average / d.max } )
	.attr("y2", function (d) { return height * d.average / d.max } )
	.attr("transform", "translate(" + ( width + margin.left + 20 ) + "," + ( 190 ) + ") rotate(180)")
	.style("stroke", "black");
	
	svg.append("text")
	.data(data)
	.attr("class", "mono chart-label bar-total")
	.text(function (d) {
		return +d.total + " trips";
	})
	.attr("x", 0)
	.attr("y", function (d) {
		return ( 190 - ( height * d.total / d.max ) - 7 );
	});
	
	svg.append("text")
	.data(data)
	.attr("class", "mono chart-label")
	.text(function (d) {
		return "avg = " + d.average;
	})
	.attr("x", 60)
	.attr("y", function (d) {
		return ( 190 - ( height * d.average / d.max ) + 3 );
	});
}
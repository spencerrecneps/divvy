var stations = L.layerGroup();
var tripLines = L.layerGroup();

/* Mapbox setup */
//var map = L.mapbox.map('map', 'spencergardner.hab6b5i5')
//    	   .setView([41.873268,-87.662342], 13);

/* OSM setup */
var map = new L.map('map');
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osm = new L.TileLayer(osmUrl, {minZoom: 13, maxZoom: 18});
map.setView([41.873268,-87.662342], 13);
map.addLayer(osm);

//resume
stations.addTo(map);
tripLines.addTo(map);

$.ajax({
	type: 'GET',
	url: '/api/station',
	success: function (data) {
		//console.log(data);
		addStation(data.objects);
	}
});

function addStation(inData) {
	$.each(inData, function(idx, val) {
		var m = L.marker([val.latitude,val.longitude], {
			title: val.name
		});
		m.on('click', function(e) {
			getTripLines(val.station_num);
			getHourlyData(val.station_num);
		});
		stations.addLayer(m);
	});
	/*
	stations.eachLayer(function (layer) {
		layer.on('mouseover', function(e) {
			//open popup;
			var popup = L.popup()
			    		 .setLatLng(e.latlng) //(assuming e.latlng returns the coordinates of the event)
			    		 .setContent(e.)
			    		 .openOn(map);
		});
	})
	*/
	map.on('click', function(e) {
		clearStationData();
	});
};

function getTripLines(id) {
	//console.log(id);
	
	var filters = [{"name": "from_station_num", "op": "==", "val": id}];
	$.ajax({
	  url: '/api/trip_lines',
	  data: {"q": JSON.stringify({"filters": filters})},
	  dataType: "json",
	  contentType: "application/json",
	  success: function(data) { drawTripLines(data.objects) }
	});
}

function drawTripLines(lines) {
	tripLines.clearLayers();
	$.each(lines, function(idx, line) {
		var l = L.polyline([L.latLng(line.from_lat,line.from_lon),L.latLng(line.to_lat,line.to_lon)], {
			color: '#ef3b2c',
			weight: line.line_weight,
			opacity: 0.5
		});
		
		tripLines.addLayer(l);
	});	
}

function getHourlyData(id) {
	var filters = [{"name": "from_station_num", "op": "==", "val": id}];
	$.ajax({
	  url: '/api/trips_by_hour',
	  data: {"q": JSON.stringify({"filters": filters})},
	  dataType: "json",
	  contentType: "application/json",
	  success: function(data) { drawTripData(data.objects) }
	});
}

function clearStationData() {
	tripLines.clearLayers();
	d3.select("#chart").selectAll("svg").remove();
	d3.select("#bar").selectAll("svg").remove();
}

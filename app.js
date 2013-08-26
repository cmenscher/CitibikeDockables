var express = require('express'); 
var app = express();

var _ = require('lodash');

var Citibike = require('citibike');
var citibike = new Citibike();

var geo = require("./geo.js");

app.configure(function() {
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set( "jsonp callback", true );
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.locals.stations = null;
app.get('/', function(request, response) {
	var qs = request.query;

	var geoLoc = {};
	if(typeof qs.lat === "undefined" || qs.lon === "undefined") {
		// 109 East 42nd St.
		geoLoc = {
			latitude: 40.751832,
			longitude: -73.976451
		}
	} else {
		geoLoc = {
			latitude: parseFloat(qs.lat),
			longitude: parseFloat(qs.lon)
		}
	}

	var dockableStations = [];

	var distanceThreshold
	if(typeof qs.thresholdMeters == "undefined") {
		//var distanceThreshold = 804.672 //half a mile in meters
		distanceThreshold = 402.336  //quarter mile in meters			
	} else {
		distanceThreshold = parseFloat(qs.thresholdMeters);
	}

	console.log("\n\nDistance threshold = " + distanceThreshold);

	// initialize the station data (we'll update the bike/dock info periodically)
	citibike.getStations(null, function(data) {
		app.locals.stations = data.results;

		var thisStation, dist;
		var latLon = geo.setLocation(geoLoc);

		for(var i in app.locals.stations) {
			thisStation = app.locals.stations[i];
			dist = latLon.distVincenty(thisStation.latitude, thisStation.longitude, geoLoc.latitude, geoLoc.longitude);

			// don't even bother listing inactive stations or with no available docks
			// assuming 2 or fewer means empty because we can't quite trust the data
			if(thisStation.availableDocks >= 2 && thisStation.status == "Active") {
				if(dist < distanceThreshold) {
					console.log(thisStation.label + " (" + thisStation.availableDocks + " docks available)");
					// remove nearbyStations property...not useful
					filteredStation = _.omit(thisStation, "nearbyStations");
					dockableStations.push(filteredStation);
				}
			}
		}
		var outJSON = {
			requestDate: new Date(),
			requestGeo: geoLoc,
			distanceThresholdMeters: distanceThreshold,
			totalStations: dockableStations.length,
			stations: dockableStations
		}
		response.json(outJSON);
	});
});


// Listen at defined PORT (or port 8080 if is not defined)
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Listening on port ' + port + "...\n");
});


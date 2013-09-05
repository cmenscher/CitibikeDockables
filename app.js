var express = require('express'); 
var app = express();

var _ = require('lodash');

var Citibike = require('citibike');
var citibike = new Citibike();

var geo = require("./geo.js");

app.configure(function() {
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set("port", 8000);
});

app.locals.stations = null;
app.get('/', function(request, response) {
	var qs = request.query;
	var stations = [];

	var geoLoc = {};
	if(typeof qs.lat === "undefined" || qs.lon === "undefined") {
		// default to midtown/Grand Central
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

	// By default we'll look for docks with available parking
	var dockable = true;
	if(typeof qs.dockable !== "undefined") {
		try {
			var dockable = JSON.parse(qs.dockable);
		} catch(err) {
			console.log("A non-boolean/unusable value for dockable was passed in the querystring. Ignoring...")
		}
	}

	// This option will return a very compact result for low power/low memory/slow network devices (like the Pebble)
	var compact = false;
	if(typeof qs.compact !== "undefined") {
		try {
			var compact = JSON.parse(qs.compact);
		} catch(err) {
			console.log("A non-boolean/unusable value for compact was passed in the querystring. Ignoring...")
		}
	}

	// This defines the radius by which to filter the results
	var distanceThreshold = 402.336
	if(typeof qs.thresholdMeters !== "undefined") {
		distanceThreshold = parseFloat(qs.thresholdMeters);
	}

	// initialize the station data (we'll update the bike/dock info periodically)
	citibike.getStations(null, function(data) {
		app.locals.stations = data.results; // setting in app.locals to keep persistent but might not be necessary

		var thisStation, dist;
		var latLon = geo.setLocation(geoLoc);

		for(var i in app.locals.stations) {
			thisStation = app.locals.stations[i];
			dist = latLon.distVincenty(thisStation.latitude, thisStation.longitude, geoLoc.latitude, geoLoc.longitude);
			thisStation.distance = dist;

			var filteredStation = null;
			if(dockable) {
				// don't bother listing inactive stations
				// assuming 2 or fewer docks means empty because we can't quite trust the data
				if(thisStation.availableDocks >= 2 && thisStation.status == "Active") {
					if(dist < distanceThreshold) {
						console.log(thisStation.label + " (" + thisStation.availableDocks + " docks available)");
						filteredStation = thisStation;
					}
				}
			} else {
				// don't bother listing inactive stations
				// assuming 2 or fewer bikes means empty because we can't quite trust the data, the docks are broken, or the bikes were marked for repair
				if(thisStation.availableBikes >= 3 && thisStation.status == "Active") {
					if(dist < distanceThreshold) {
						console.log(thisStation.label + " (" + thisStation.availableDocks + " docks available)");
						filteredStation = thisStation;
					}
				}				
			}

			if(filteredStation != null) {
				// remove nearbyStations property...not useful
				filteredStation = _.omit(filteredStation, "nearbyStations");
				
				// we know we're only looking for "Active" stations...
				filteredStation = _.omit(filteredStation, "status");

				// station address always seems to be empty, so wtf?
				filteredStation = _.omit(filteredStation, "stationAddress");

				if(compact) {
					if(dockable) {
						filteredStation = _.omit(filteredStation, "availableBikes");
					} else {
						filteredStation = _.omit(filteredStation, "availableDocks");
					}
				}

				stations.push(filteredStation);				
			}
		}

		stations = _.sortBy(stations, function(stn) {
			return parseFloat(stn.distance);
		});

		var outJSON = {};
		if(!compact) {
			outJSON = {
					requestDate: new Date(),
					requestGeo: geoLoc,
					distanceThresholdMeters: distanceThreshold,
					totalStations: stations.length,
			}
		}
		outJSON.stations = stations;

		if(typeof(qs.callback) === "undefined") {
			response.json(outJSON);
		} else {
			response.jsonp(outJSON);
		}
	});
});


// Listen at defined PORT (or port 8080 if is not defined)
var port = app.get("port") || 8080;
app.listen(port, function() {
  console.log('Listening on port ' + port + "...\n");
});


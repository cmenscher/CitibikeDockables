CitibikeDockables
=================

This Node app will return a collection of currently "dockable" Citibike stations ("active" status and with >= 2 open docks) within a specified geographic area.  If no geographic threshold is specified, it defaults to 402.336 meters, or about 1/4 mile.

There have been many times when I've arrived at a station and it's either full of bikes, or has a single dock available that is broken, or is out of commission all together.  I hope to use this service to create an app to deal with these situations.

##Node requirements:

- ExpressJS ("npm install express")
- Lodash ("npm install lodash")
- Kevin Coughlin's Citibike NodeJS package ([https://github.com/KevinTCoughlin/citibike/](https://github.com/KevinTCoughlin/citibike/) or "npm install citibike")

##Querystring Parameters:
- lat: current latitude (required)
- lon: current longitude (required)
- thresholdMeters: the geographic radius for which you want results (optional, defaults to 402.336m or about .25 miles)  
- dockable: boolean to indicate that you want to search for stations who have parking, as opposed to stations with available bikes...the resulting JSON will contain "availableDocks" or "availableBikes" properties, respectively. (default is true)
- compact: boolean to indicate you want a stripped-down version of the data for low power/low memory/slow network devices. (optional, default is false)

##To Dos:
- Add the ability to return docks with available bikes (not just available docks)
- Add a "compact" mode to return very simple data for low power/low memory/slow network devices (like the Pebble)

##Sample request:

http://myfuncitibikedomain.com/dockables?lat=40.729425&lon=-73.993707&thresholdMeters=402.336

##Sample full response:

```javascript
{
  "requestDate": "2013-08-26T03:28:00.551Z",
  "requestGeo": {
    "latitude": 40.729425,
    "longitude": -73.993707
  },
  "distanceThresholdMeters": 402.336,
  "totalStations": 8,
  "stations": [
    {
      "id": 161,
      "status": "Active",
      "latitude": 40.72917025,
      "longitude": -73.99810231,
      "label": "LaGuardia Pl & W 3 St",
      "stationAddress": "",
      "availableBikes": 12,
      "availableDocks": 23
    },
    {
      "id": 229,
      "status": "Active",
      "latitude": 40.72743423,
      "longitude": -73.99379025,
      "label": "Great Jones St",
      "stationAddress": "",
      "availableBikes": 3,
      "availableDocks": 24
    },
    {
      "id": 293,
      "status": "Active",
      "latitude": 40.73028666,
      "longitude": -73.9907647,
      "label": "Lafayette St & E 8 St",
      "stationAddress": "",
      "availableBikes": 5,
      "availableDocks": 50
    },
    {
      "id": 294,
      "status": "Active",
      "latitude": 40.73049393,
      "longitude": -73.9957214,
      "label": "Washington Square E",
      "stationAddress": "",
      "availableBikes": 4,
      "availableDocks": 27
    },
    {
      "id": 300,
      "status": "Active",
      "latitude": 40.7289841,
      "longitude": -73.99051868,
      "label": "Cooper Square & E 7 St",
      "stationAddress": "",
      "availableBikes": 2,
      "availableDocks": 40
    },
    {
      "id": 335,
      "status": "Active",
      "latitude": 40.72903917,
      "longitude": -73.99404649,
      "label": "Washington Pl & Broadway",
      "stationAddress": "",
      "availableBikes": 9,
      "availableDocks": 18
    },
    {
      "id": 357,
      "status": "Active",
      "latitude": 40.73261787,
      "longitude": -73.99158043,
      "label": "E 11 St & Broadway",
      "stationAddress": "",
      "availableBikes": 13,
      "availableDocks": 14
    },
    {
      "id": 375,
      "status": "Active",
      "latitude": 40.72679454,
      "longitude": -73.99695094,
      "label": "Mercer St & Bleecker St",
      "stationAddress": "",
      "availableBikes": 7,
      "availableDocks": 23
    }
  ]
}
```

##Sample compact response (for dockable == true):
```javascript
{
  "stations": [
    {
      "id": 167,
      "latitude": 40.7489006,
      "longitude": -73.97604882,
      "label": "E 39 St & 3 Ave",
      "availableDocks": 13
    },
    {
      "id": 318,
      "latitude": 40.75320159,
      "longitude": -73.9779874,
      "label": "E 43 St & Vanderbilt Ave",
      "availableDocks": 25
    },
    {
      "id": 359,
      "latitude": 40.75510267,
      "longitude": -73.97498696,
      "label": "E 47 St & Park Av",
      "availableDocks": 15
    },
    {
      "id": 440,
      "latitude": 40.75255434,
      "longitude": -73.97282625,
      "label": "E 45 St & 3 Ave",
      "availableDocks": 7
    },
    {
      "id": 517,
      "latitude": 40.75149263,
      "longitude": -73.97798848,
      "label": "Pershing Square S",
      "availableDocks": 59
    },
    {
      "id": 519,
      "latitude": 40.75188406,
      "longitude": -73.97770164,
      "label": "Pershing Square N",
      "availableDocks": 58
    }
  ]
}
```
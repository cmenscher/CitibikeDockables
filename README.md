CitibikeDockables
=================

This Node app will return a collection of "dockable" Citibike stations ("active" status and with >= 2 open docks) within a specified geographic area.  If no geographic threshold is specified, it defaults to 402.336 meters, or about 1/4 mile.

##Node requirements:

- ExpressJS ("npm install express")
- Lodash ("npm install lodash")

##Sample request:

http://myfuncitibikedomain.com/dockables?lat=40.729425&lon=-73.993707&thresholdMeters=402.336

##Sample response:

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
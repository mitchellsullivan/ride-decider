import React from 'react';

export const byPoints = {
  'data':
    {
      "@context": [
        "https://raw.githubusercontent.com/geojson/geojson-ld/master/contexts/geojson-base.jsonld",
        {
          "wx": "https://api.weather.gov/ontology#",
          "s": "https://schema.org/",
          "geo": "http://www.opengis.net/ont/geosparql#",
          "unit": "http://codes.wmo.int/common/unit/",
          "@vocab": "https://api.weather.gov/ontology#",
          "geometry": {
            "@id": "s:GeoCoordinates",
            "@type": "geo:wktLiteral"
          },
          "city": "s:addressLocality",
          "state": "s:addressRegion",
          "distance": {
            "@id": "s:Distance",
            "@type": "s:QuantitativeValue"
          },
          "bearing": {
            "@type": "s:QuantitativeValue"
          },
          "value": {
            "@id": "s:value"
          },
          "unitCode": {
            "@id": "s:unitCode",
            "@type": "@id"
          },
          "forecastOffice": {
            "@type": "@id"
          },
          "forecastGridData": {
            "@type": "@id"
          },
          "publicZone": {
            "@type": "@id"
          },
          "county": {
            "@type": "@id"
          }
        }
      ],
      "id": "https://api.weather.gov/points/32.36,-90.136",
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -90.135999999999996,
          32.359999999999999
        ]
      },
      "properties": {
        "@id": "https://api.weather.gov/points/32.36,-90.136",
        "@type": "wx:Point",
        "cwa": "JAN",
        "forecastOffice": "https://api.weather.gov/offices/JAN",
        "gridX": 76,
        "gridY": 64,
        "forecast": "https://api.weather.gov/gridpoints/JAN/76,64/forecast",
        "forecastHourly": "https://api.weather.gov/gridpoints/JAN/76,64/forecast/hourly",
        "forecastGridData": "https://api.weather.gov/gridpoints/JAN/76,64",
        "observationStations": "https://api.weather.gov/gridpoints/JAN/76,64/stations",
        "relativeLocation": {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -90.073040000000006,
              32.336142000000002
            ]
          },
          "properties": {
            "city": "Flowood",
            "state": "MS",
            "distance": {
              "value": 6482.1302819335415,
              "unitCode": "unit:m"
            },
            "bearing": {
              "value": 294,
              "unitCode": "unit:degrees_true"
            }
          }
        },
        "forecastZone": "https://api.weather.gov/zones/forecast/MSZ048",
        "county": "https://api.weather.gov/zones/county/MSC049",
        "fireWeatherZone": "https://api.weather.gov/zones/fire/MSZ048",
        "timeZone": "America/Chicago",
        "radarStation": "KDGX"
      }
    }
}

export const forecastJackson = {
  'data':
    {
      "@context": [
        "https://raw.githubusercontent.com/geojson/geojson-ld/master/contexts/geojson-base.jsonld",
        {
          "wx": "https://api.weather.gov/ontology#",
          "geo": "http://www.opengis.net/ont/geosparql#",
          "unit": "http://codes.wmo.int/common/unit/",
          "@vocab": "https://api.weather.gov/ontology#"
        }
      ],
      "type": "Feature",
      "geometry": {
        "type": "GeometryCollection",
        "geometries": [
          {
            "type": "Point",
            "coordinates": [
              -90.146707500000005,
              32.3542463
            ]
          },
          {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -90.159625599999998,
                  32.365965899999999
                ],
                [
                  -90.160582300000002,
                  32.3433359
                ],
                [
                  -90.133792,
                  32.3425254
                ],
                [
                  -90.132829999999998,
                  32.365155299999998
                ],
                [
                  -90.159625599999998,
                  32.365965899999999
                ]
              ]
            ]
          }
        ]
      },
      "properties": {
        "updated": "2020-04-11T02:16:11+00:00",
        "units": "us",
        "forecastGenerator": "BaselineForecastGenerator",
        "generatedAt": "2020-04-11T03:05:25+00:00",
        "updateTime": "2020-04-11T02:16:11+00:00",
        "validTimes": "2020-04-10T20:00:00+00:00/P7DT17H",
        "elevation": {
          "value": 102.108,
          "unitCode": "unit:m"
        },
        "periods": [
          {
            "number": 1,
            "name": "Tonight",
            "startTime": "2020-04-10T22:00:00-05:00",
            "endTime": "2020-04-11T06:00:00-05:00",
            "isDaytime": false,
            "temperature": 44,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "0 to 5 mph",
            "windDirection": "ENE",
            "icon": "https://api.weather.gov/icons/land/night/few?size=medium",
            "shortForecast": "Mostly Clear",
            "detailedForecast": "Mostly CLEAR, with a low around 44. East northeast wind 0 to 5 mph."
          },
          {
            "number": 2,
            "name": "Saturday",
            "startTime": "2020-04-11T06:00:00-05:00",
            "endTime": "2020-04-11T18:00:00-05:00",
            "isDaytime": true,
            "temperature": 75,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 to 10 mph",
            "windDirection": "SE",
            "icon": "https://api.weather.gov/icons/land/day/few?size=medium",
            "shortForecast": "Sunny",
            "detailedForecast": "Sunny, with a high near 75. Southeast wind 5 to 10 mph.",
            "likedStatus": 1
          },
          {
            "number": 3,
            "name": "Saturday Night",
            "startTime": "2020-04-11T18:00:00-05:00",
            "endTime": "2020-04-12T06:00:00-05:00",
            "isDaytime": false,
            "temperature": 62,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 mph",
            "windDirection": "SE",
            "icon": "https://api.weather.gov/icons/land/night/tsra,40/tsra,90?size=medium",
            "shortForecast": "Slight Chance Showers And Thunderstorms then Showers And Thunderstorms",
            "detailedForecast": "A slight chance of showers and thunderstorms between 7pm and 8pm, then showers and thunderstorms. Mostly CLOUDY, with a low around 62. Southeast wind around 5 mph. Chance of precipitation is 90%. New rainfall amounts between a half and three quarters of an inch possible."
          },
          {
            "number": 4,
            "name": "Sunday",
            "startTime": "2020-04-12T06:00:00-05:00",
            "endTime": "2020-04-12T18:00:00-05:00",
            "isDaytime": true,
            "temperature": 80,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 to 15 mph",
            "windDirection": "S",
            "icon": "https://api.weather.gov/icons/land/day/tsra,100?size=medium",
            "shortForecast": "Showers And Thunderstorms",
            "detailedForecast": "Showers and thunderstorms. Some of the storms could be severe. Cloudy, with a high near 80. South wind 5 to 15 mph, with gusts as high as 25 mph. Chance of precipitation is 100%. New rainfall amounts between 1 and 2 inches possible.",
            "likedStatus": -1
          },
          {
            "number": 5,
            "name": "Sunday Night",
            "startTime": "2020-04-12T18:00:00-05:00",
            "endTime": "2020-04-13T06:00:00-05:00",
            "isDaytime": false,
            "temperature": 55,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 to 15 mph",
            "windDirection": "WSW",
            "icon": "https://api.weather.gov/icons/land/night/tsra_hi,60/sct?size=medium",
            "shortForecast": "Showers And Thunderstorms Likely then Partly Cloudy",
            "detailedForecast": "Showers and thunderstorms likely before 7pm, then a chance of showers and thunderstorms between 7pm and midnight. Some of the storms could be severe. Partly CLOUDY, with a low around 55. West southwest wind 5 to 15 mph, with gusts as high as 25 mph. Chance of precipitation is 60%. New rainfall amounts between a half and three quarters of an inch possible."
          },
          {
            "number": 6,
            "name": "Monday",
            "startTime": "2020-04-13T06:00:00-05:00",
            "endTime": "2020-04-13T18:00:00-05:00",
            "isDaytime": true,
            "temperature": 66,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 to 10 mph",
            "windDirection": "NW",
            "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
            "shortForecast": "Mostly Sunny",
            "detailedForecast": "Mostly sunny, with a high near 66. Northwest wind 5 to 10 mph, with gusts as high as 20 mph.",
            "likedStatus": 1
          },
          {
            "number": 7,
            "name": "Monday Night",
            "startTime": "2020-04-13T18:00:00-05:00",
            "endTime": "2020-04-14T06:00:00-05:00",
            "isDaytime": false,
            "temperature": 44,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 mph",
            "windDirection": "N",
            "icon": "https://api.weather.gov/icons/land/night/few?size=medium",
            "shortForecast": "Mostly Clear",
            "detailedForecast": "Mostly CLEAR, with a low around 44. North wind around 5 mph, with gusts as high as 20 mph."
          },
          {
            "number": 8,
            "name": "Tuesday",
            "startTime": "2020-04-14T06:00:00-05:00",
            "endTime": "2020-04-14T18:00:00-05:00",
            "isDaytime": true,
            "temperature": 66,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 to 10 mph",
            "windDirection": "NE",
            "icon": "https://api.weather.gov/icons/land/day/few?size=medium",
            "shortForecast": "Sunny",
            "detailedForecast": "Sunny, with a high near 66. Northeast wind 5 to 10 mph, with gusts as high as 20 mph.",
            "likedStatus": 1
          },
          {
            "number": 9,
            "name": "Tuesday Night",
            "startTime": "2020-04-14T18:00:00-05:00",
            "endTime": "2020-04-15T06:00:00-05:00",
            "isDaytime": false,
            "temperature": 42,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 mph",
            "windDirection": "NNE",
            "icon": "https://api.weather.gov/icons/land/night/bkn?size=medium",
            "shortForecast": "Mostly Cloudy",
            "detailedForecast": "Mostly CLOUDY, with a low around 42. North northeast wind around 5 mph."
          },
          {
            "number": 10,
            "name": "Wednesday",
            "startTime": "2020-04-15T06:00:00-05:00",
            "endTime": "2020-04-15T18:00:00-05:00",
            "isDaytime": true,
            "temperature": 66,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "5 to 10 mph",
            "windDirection": "N",
            "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
            "shortForecast": "Mostly Sunny",
            "detailedForecast": "Mostly sunny, with a high near 66.",
            "likedStatus": 1
          },
          {
            "number": 11,
            "name": "Wednesday Night",
            "startTime": "2020-04-15T18:00:00-05:00",
            "endTime": "2020-04-16T06:00:00-05:00",
            "isDaytime": false,
            "temperature": 45,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "0 to 5 mph",
            "windDirection": "NNE",
            "icon": "https://api.weather.gov/icons/land/night/bkn?size=medium",
            "shortForecast": "Mostly Cloudy",
            "detailedForecast": "Mostly CLOUDY, with a low around 45."
          },
          {
            "number": 12,
            "name": "Thursday",
            "startTime": "2020-04-16T06:00:00-05:00",
            "endTime": "2020-04-16T18:00:00-05:00",
            "isDaytime": true,
            "temperature": 72,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "0 to 5 mph",
            "windDirection": "ENE",
            "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
            "shortForecast": "Mostly Sunny",
            "detailedForecast": "Mostly sunny, with a high near 72.",
            "likedStatus": 1
          },
          {
            "number": 13,
            "name": "Thursday Night",
            "startTime": "2020-04-16T18:00:00-05:00",
            "endTime": "2020-04-17T06:00:00-05:00",
            "isDaytime": false,
            "temperature": 50,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "0 to 5 mph",
            "windDirection": "E",
            "icon": "https://api.weather.gov/icons/land/night/bkn?size=medium",
            "shortForecast": "Mostly Cloudy",
            "detailedForecast": "Mostly CLOUDY, with a low around 50."
          },
          {
            "number": 14,
            "name": "Friday",
            "startTime": "2020-04-17T06:00:00-05:00",
            "endTime": "2020-04-17T18:00:00-05:00",
            "isDaytime": true,
            "temperature": 76,
            "temperatureUnit": "F",
            "temperatureTrend": null,
            "windSpeed": "0 to 5 mph",
            "windDirection": "NE",
            "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
            "shortForecast": "Mostly Sunny",
            "detailedForecast": "Mostly sunny, with a high near 76.",
            "likedStatus": 1
          }
        ]
      }
    }
}

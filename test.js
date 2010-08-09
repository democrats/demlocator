#!/usr/bin/env js -P

load("demlocator.js");

function TestNavigator(success) {
  this.geolocation = {
    getCurrentPosition : function(success_callback, error_callback) {
      if (success) {
        var result = {
          "coords" : {
            "latitude"  : "35.40",
            "longitude" : "-97.60"
          }
        };

        success_callback(result);
      } else {
        error_callback("Error");
      }
    }
  }
}

function THEGOOGLE() {
  this.loader = {
    "ClientLocation" : {
      "address" : {
        "country" : "USA",
        "region" : "Colorado"
      }
    }
  }
}

function GLatLng(lat,lng) {
  this.lat = function() {
    return lat
  };

  this.lng = function() {
    return lng
  };
}

var geocode_success = true;
function GClientGeocoder() {
  this.getLocations = function(latlng, success_callback, error_callback) {
    var response = {
      "Status" : {},
      "Placemark" : []
    };
    if (geocode_success) {
      response.Status.code = 200;
      response.Placemark[0] = {
        "AddressDetails" : {
          "Country" : {
            "CountryNameCode" : "US",
            "AdministrativeArea" : {
              "AdministrativeAreaName" : "Oklahoma",
              "SubAdministrativeArea" : {
                "Locality" : {
                  "PostalCode" : {
                    "PostalCodeNumber" : "73120"
                  }
                }
              }
            }
          }
        }
      };
      success_callback(response);
    } else {
      response.Status.code = 404;
      error_callback(response);
    }
  }
}

function TestConsole() {
  this.log = function(msg) {
    print(msg);
  }
}

function handle_demlocator_success(result) {
  if (result.country && result.country == 'US') {
    console.log("You might be in " + result.state + ", USA!");
  }
}

function handle_demlocator_error(error) {
  console.log("DemLocator failed. Sorry.");
}


var locator = new DemLocator();
var navigator = new TestNavigator(true);
var google = new THEGOOGLE();
var console = new TestConsole();

// geocode success test
print("This test should say we're in Oklahoma, USA:");
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");

// geocode fail test
print("This test should say we're in Colorado, USA:");
geocode_success = false;
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");


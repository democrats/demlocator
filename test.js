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
        error_callback("HTML5 geolocation error");
      }
    }
  }
}

function THEGOOGLE(present) {
  if (present) {
    this.loader = {
      "ClientLocation" : {
        "address" : {
          "country" : "USA",
          "region" : "Colorado"
        }
      }
    }
  } else {
    this.loader = {};
  }
}

function GLatLng(lat,lng) {
  this.lat = function() {
    return lat;
  };

  this.lng = function() {
    return lng;
  };
}

var geocode_result = "good";
function GClientGeocoder() {
  this.getLocations = function(latlng, success_callback, error_callback) {
    var response = {
      "Status" : {},
      "Placemark" : []
    };
    if (geocode_result == "good") {
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
    } else if (geocode_result == "fair") {
      response.Status.code = 404;
      success_callback(response);
    } else if (geocode_result == "bad") {
      error_callback("Geocoder error");
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
  console.log("DemLocator error: " + error);
}


var locator;
var navigator;
var google;
var console;

function test_reset() {
  locator = new DemLocator();
  locator.setDebug(true);
  navigator = new TestNavigator(true);
  google = new THEGOOGLE(true);
  console = new TestConsole();
}

// all good test
test_reset();
print("This test should say we're in Oklahoma, USA:");
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");

// geocode fair test
test_reset();
print("This test should say we're in Colorado, USA:");
geocode_result = "fair";
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");

// geocode bad test
test_reset();
print("This test should say we're in Colorado, USA:");
geocode_result = "bad";
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");

// geocode bad & IP bad test
test_reset();
print("This test should generate an error:");
google = new THEGOOGLE(false);
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");

// html5 bad test
test_reset();
print("This test should say we're in Colorado, USA:");
navigator = new TestNavigator(false);
geocode_result = "good";
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");

// html5 not available test
test_reset();
print("This test should say we're in Colorado, USA:");
navigator.geolocation = null;
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");

// all bad test
test_reset();
print("This test should generate an error:");
var google = new THEGOOGLE(false);
navigator.geolocation = null;
geocode_result = "bad";
locator.getLocation(handle_demlocator_success, handle_demlocator_error);
print("\n");


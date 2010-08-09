/* DemLocator - locates website visitors using HTML5 geolocation, but
 *  falls back to IP geolocation if that fails or isn't available.
 *
 * See README for usage instructions, examples, and general tomfoolery.
 *
 * Copyright (c) 2010, Democratic National Committee
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Democratic National Committee nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE DEMOCRATIC NATIONAL COMITTEE BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */

function DemLocator() {
  var obj = this;
  var locationData = {};
  var debug = false;

  this.setDebug = function(debug) {
    this.debug = debug;
  }

  function debugLog(msg) {
    if (obj.debug) console.log("DEBUG: " + msg);
  }

  this.getIPLocation = function() {
    locationData.country = google.loader.ClientLocation.address.country;
    if ('USA' == locationData.country) {
      locationData.state = google.loader.ClientLocation.address.region;
      locationData.country = 'US';
    }
  };

  this.geo_step2_success_callback = function(response) {
    if (!response || response.Status.code != 200) {
      debugLog("Got a bad response from reverse-geocoder, attempting IP location");
      if ( google.loader.ClientLocation ) {
        obj.getIPLocation();
        debugLog("IP location successful");
        obj.success_callback(locationData);
        return;
      }
      obj.error_callback("Got bad response from geolocator service");
      return;
    }
    debugLog("Reverse-geocoding successful");
    var place = response.Placemark[0];
    locationData.country = place.AddressDetails.Country.CountryNameCode;
    if ('US' == locationData.country) {
      locationData.state = place.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
      if (place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea) {
        locationData.zip = place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.PostalCode.PostalCodeNumber;

      } else {
        locationData.zip = place.AddressDetails.Country.AdministrativeArea.Locality.PostalCode.PostalCodeNumber;
      }
    }
    obj.success_callback(locationData);
  };

  this.geo_step1_success_callback = function(position) {
    var latlng = new GLatLng(position.coords.latitude,position.coords.longitude);
    var geocoder = new GClientGeocoder();
    debugLog("Got lat/lng, attempting to reverse-geocode");
    geocoder.getLocations(latlng, obj.geo_step2_success_callback, obj.geo_error_callback);
  };

  this.geo_error_callback = function(error) {
    debugLog("HTML5 geocoding failed, attempting IP location");
    if ( google.loader.ClientLocation ) {
      obj.getIPLocation();
      debugLog("IP location successful");
      obj.success_callback(locationData);
      return;
    }
    obj.error_callback(error);
  };

  this.getLocation = function(success_callback, error_callback) {
    this.success_callback = success_callback;
    this.error_callback = error_callback;

    // try HTML 5 browser geolocation
    if (navigator.geolocation) {
      debugLog("Using HTML5 geolocation");
      navigator.geolocation.getCurrentPosition(this.geo_step1_success_callback, this.geo_error_callback);
    // try IP geolocation 
    } else if ( google.loader.ClientLocation ) {
      debugLog("Using IP geolocation");
      obj.getIPLocation();
      this.success_callback(locationData);
    } else {
      this.error_callback("Could not obtain location");
    }
  };
}


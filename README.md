# DemLocator

DemLocator is a Javascript library for geolocating website visitors using HTML5
browser geolocation (especially useful on mobile devices w/ GPS) but adds a
transparent fallback to IP geolocation when HTML5 isn't available or fails.

It depends on Google's AJAX & Maps APIs. Include them before you include
demlocator.js. It uses the ClientLocation API for IP-based geolocation and
the Maps API for getting country, city, state, etc. information.

## WORDS TO THE WISE

Be aware that most browsers don't know where they are. And
IP-based geolocation is even worse. Some IPs have no geographic data associated
with them at all, and the computer holding the address might not be that close
to that location even when they do. The person using the computer could also be
halfway around the world using it remotely. You just never know.

Unless you get a fix from a GPS-equipped device, you shouldn't rely on this
information for anything important (and maybe not even then, see above). For
example, we at the DNC use it to make an educated guess and hopefully shortcut
people to the right information for their area. But we still ask them for their
address and ZIP code and only rely on their location data once we have that.


## Usage Example

Here's an example (put this in the <head> section of your HTML & insert your
Google API key where appropriate):

    <script type="text/javascript" src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=[YOUR_GOOGLE_API_KEY_GOES_HERE]"></script>
    <script type="text/javascript" src="http://www.google.com/jsapi?key=[YOUR_GOOGLE_API_KEY_GOES_HERE]"></script>
    <script type="text/javascript" src="/path/to/demlocator.js"></script>

Then, using jQuery, you can do this to call it when the document is ready:
    <script type="text/javascript">

      // success callback
      function handle_demlocator_success(result) {
        if (result.country && result.country == 'US') {
          console.log("You might be in " + result.state + ", USA!");
        }
      }

      // error callback
      function handle_demlocator_error(error) {
        console.log("DemLocator failed. Sorry.");
      }

      // kick the whole thing off
      $(document).ready(function() {
        var locator = new DemLocator();
        locator.getLocation(handle_demlocator_success, handle_demlocator_error);
      });

    </script>

And that should be it.


## Testing

If you have SpiderMonkey installed (Mozilla's Javascript engine which can be
installed as a standalone executable), then you can run the included test
suite:

    js test.js


## Github, FTW. 

Fork the project here: [http://github.com/dnclabs/demlocator](http://github.com/dnclabs/demlocator)

Report bugs here: [http://github.com/dnclabs/demlocator/issues](http://github.com/dnclabs/demlocator/issues)


Have fun storming the castle!

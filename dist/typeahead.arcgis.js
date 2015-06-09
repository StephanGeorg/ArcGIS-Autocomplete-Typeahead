(function() {

  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {

    return this.Autocomplete = (function(_super) {
      __extends(Autocomplete, _super);

      function Autocomplete(options) {

        var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=%27%25%QUERY%25%27';

        if (options == null) {
          options = {};
        }
        if(options.location) {
          url = url + '&location=' + options.location;
        }
        if(options.distance && options.location) {
          url = url + '&distance=' + options.distance;
        }
        if(options.format) {
          url = url + '&f=' + options.format;
        }
        else url = url + '&f=json';

        this.options = $.extend({

          datumTokenizer: function (datum) {
            return Bloodhound.tokenizers.whitespace(datum.text);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          remote: {
            url: url,
            wildcard: '%QUERY',

            filter: function (response) {
              return $.map(response.suggestions, function (suggestion) {
                return {
                    text: suggestion.text,
                    magicKey : suggestion.magicKey
                };
              });
            }
          }

          if(options.prefetch) {
            this.options = $.extend({
              prefetch: options.prefetch
            });
          }




        },options);


        Autocomplete.__super__.constructor.call(this, this.options);
        //this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
      }

      Autocomplete.prototype.bindDefaultTypeaheadEvent = function(typeahead) {
        var _this = this;

        typeahead.on("typeahead:selected", function(obj, datum, dataset){
          console.log(datum);
          _this.geocode(datum.text, datum.magicKey);
        });

        typeahead.on("typeahead:autocompleted", function(obj, datum, dataset){
          console.log(datum);
          _this.geocode(datum.text, datum.magicKey);
        });

      };


      Autocomplete.prototype.geocode = function(text,magicKey,location) {

        var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find';
        var jqxhr = $.ajax({
          url: url,
          data: {
            text: text,
            f: 'json',
            magicKey: magicKey,
            outFields: '*'
          },
          dataType: 'json'
        })
        .done(function(data) {
          console.log("done: ");
          console.log(data);
        })
        .fail(function(data) {
          console.log("fail: " + data);
        })
        .always(function(data) {
          console.log("always1: " + data);
        });

        // Set another completion function for the request above
        jqxhr.always(function(data) {
          //console.log("always2: " + data);
        });
      };




      Autocomplete.prototype.reverseGeocode = function(position) {
        if (this.geocoder == null) {
          this.geocoder = new google.maps.Geocoder();
        }
        return this.geocoder.geocode({
          location: position
        }, (function(_this) {
          return function(results) {
            if (results && results.length > 0) {
              _this.lastResult = new AutocompleteResult(results[0], true);
              return $(_this).trigger('Autocomplete:selected', _this.lastResult);
            }
          };
        })(this));
      };

      return Autocomplete;

    })(Bloodhound);
  })(jQuery);

}).call(this);

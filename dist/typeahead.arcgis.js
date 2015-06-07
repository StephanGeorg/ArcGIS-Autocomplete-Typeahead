(function() {

  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {

    this.AutocompleteResult = (function() {

      function AutocompleteResult(placeResult, fromReverseGeocoding) {

        this.placeResult = placeResult;
        this.fromReverseGeocoding = fromReverseGeocoding !== null ? fromReverseGeocoding : false;
        this.latitude = this.placeResult.geometry.location.lat();
        this.longitude = this.placeResult.geometry.location.lng();

      }

      AutocompleteResult.prototype.addressTypes = function() {
        var component, type, types, _i, _j, _len, _len1, _ref, _ref1;
        types = [];
        _ref = this.addressComponents();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          _ref1 = component.types;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            type = _ref1[_j];
            if (types.indexOf(type) === -1) {
              types.push(type);
            }
          }
        }
        return types;
      };

      AutocompleteResult.prototype.addressComponents = function() {
        return this.placeResult.address_components || [];
      };

      AutocompleteResult.prototype.address = function() {
        return this.placeResult.formatted_address;
      };

      AutocompleteResult.prototype.nameForType = function(type, shortName) {
        var component, _i, _len, _ref;
        if (shortName == null) {
          shortName = false;
        }
        _ref = this.addressComponents();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          if (component.types.indexOf(type) !== -1) {
            return (shortName ? component.short_name : component.long_name);
          }
        }
        return null;
      };

      AutocompleteResult.prototype.lat = function() {
        return this.latitude;
      };

      AutocompleteResult.prototype.lng = function() {
        return this.longitude;
      };

      AutocompleteResult.prototype.setLatLng = function(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
      };

      AutocompleteResult.prototype.isAccurate = function() {
        return !this.placeResult.geometry.viewport;
      };

      AutocompleteResult.prototype.isReverseGeocoding = function() {
        return this.fromReverseGeocoding;
      };




      return AutocompleteResult;

    })();
    return this.Autocomplete = (function(_super) {
      __extends(Autocomplete, _super);

      function Autocomplete(options) {
        if (options == null) {
          options = {};
        }

        this.options = $.extend({


          datumTokenizer: function (datum) {
            return Bloodhound.tokenizers.whitespace(datum.text);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          prefetch: 'example.json',
          remote: {
            url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=%27%25%QUERY%25%27&f=json&location=13.4093,52.5221&distance=100000',
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

        typeahead.on("typeahead:autocomplete", function(obj, datum, dataset){
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
            magicKey: magicKey
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

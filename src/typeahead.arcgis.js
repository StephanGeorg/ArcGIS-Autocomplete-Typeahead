(function() {

  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {

    this.AutocompleteResult = (function() {

      function AutocompleteResult(placeResult, fromReverseGeocoding) {


      }

      return AutocompleteResult;

    })();

    return this.Autocomplete = (function(_super) {
      __extends(Autocomplete, _super);

      function Autocomplete(options) {

        var url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=%QUERY';

        if (options === null) {
          options = {};
        }
        if(options.location) {
          url = url + '&location=' + options.location;
          if(options.distance) {
            url = url + '&distance=' + options.distance;
          }
        }
        if(options.format) {
          url = url + '&f=' + options.format;
        }
        else url = url + '&f=json';
        if(options.categories) {
          url = url + '&category=' + options.categories;
        }

        if(options.prefetch) {
          this.options = $.extend({
            prefetch: options.prefetch
          });
        }

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
          },
          //limit: 10,

        },options);

        Autocomplete.__super__.constructor.call(this, this.options);

      }


      Autocomplete.prototype.bindTypeaheadEvent = function(typeahead, success, fail) {

        var _this = this;
        typeahead.on("typeahead:selected", function(obj, datum, dataset){
          _this.geocode(datum.text, datum.magicKey, success, fail);
        });

        typeahead.on("typeahead:autocompleted", function(obj, datum, dataset){
          console.log(datum);
          _this.geocode(datum.text, datum.magicKey, success, fail);
        });
      };


      Autocomplete.prototype.geocode = function(text,magicKey,success,fail) {

        var url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find';
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
          if(typeof success === 'function') {
            success(data);
          }
        })
        .fail(function(data) {
          if(typeof fail === 'function') {
            fail(data);
          }
        })
        .always(function(data) {});

        return false;

      };




      Autocomplete.prototype.reverseGeocode = function(position) {
      };

      return Autocomplete;

    })(Bloodhound);
  })(jQuery);

}).call(this);

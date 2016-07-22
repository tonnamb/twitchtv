/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {

  "use strict";

  (function () {

    /* Initialize entries
    ======================================== */

    var channelArray = ["esl_sc2", "cretetion", "ogamingsc2", "freecodecamp", "storbeck", "habathcx", "robotcaleb", "noobs2ninjas"];
    var i;

    function getTwitch(getWhat, id) {
      return $.ajax({
        dataType: "json",
        url: "https://api.twitch.tv/kraken/" + getWhat + "/" + id,
        success: function (data) {
          return data;
        },
        error: function (jqXHR, exception) {
          $("#status-box").text($.parseJSON(jqXHR.responseText).message);
        }
      });
    }

    var getChannel = getTwitch.bind(null, 'channels');
    var getStream = getTwitch.bind(null, 'streams');

    function divChannel(data) {
      var $div = $("<div>", {"class": "entry", "id": data.name});
      if (data.logo === null) {
        $div.append("<img class='entry-logo' src='images/redx.png'>");
      } else {
        $div.append("<img class='entry-logo' src='" + data.logo + "'>");
      }
      $div.append("<p class='entry-name'><a href='https://www.twitch.tv/" + data.name + "' target='_blank'>" + data.display_name + "</p>");
      getStream(data.name).then(function (stream) {
        if (stream.stream === null) {
          $div.append("<p class='entry-status'>Offline</p>");
          $div.addClass('offline-entry');
        } else {
          $div.append("<p class='entry-status'>" + stream.stream.channel.status + "</p>");
          $div.addClass('online-entry');
        }
      });
      return $div;
    }

    function appendToBox(channel) {
      getChannel(channel).then(function (data) {
        $("#results-box").append(divChannel(data));
      });
    }

    $("#results-box").hide();
    channelArray.forEach(appendToBox);

    /* Sort entries
    ======================================== */

    function checkStatus(id) {
      return getStream(id).then(function (stream) {
        if (stream.stream === null) {
          return {name: id.toLowerCase(), status: false};
        } else {
          return {name: id.toLowerCase(), status: true};
        }
      });
    }

    function moveToTop(id) {
      $("#" + id.name).prependTo("#results-box");
    }

    function sortDiv(arr) {
      arr.forEach(moveToTop);
      $("#results-box").show();
    }

    function recurSortDiv(channels) {
      var iarr = [];
      function check(arr, index) {
        if (channels.length === arr.length) {
          var sortedArr = arr.sort(function (a, b) {return a.status - b.status; });
          sortDiv(sortedArr);
        } else {
          checkStatus(channels[index]).then(function (returndata) {
            arr.push(returndata);
            return check(arr, index + 1);
          });
        }
      }
      return check(iarr, 0);
    }

    recurSortDiv(channelArray);

    /* All, Online, Offline Buttons
    ======================================== */

    $("#btn-online").on("click", function () {
      $(".offline-entry").hide();
      $(".online-entry").show();
    });

    $("#btn-offline").on("click", function () {
      $(".offline-entry").show();
      $(".online-entry").hide();
    });

    $("#btn-all").on("click", function () {
      $(".offline-entry").show();
      $(".online-entry").show();
    });

    /* Search Button
    ======================================== */

    $("#btn-search").on("click", function () {
      var formVal = $('#search-form').val();
      if ($.inArray(formVal, channelArray) === -1) { // Check for duplicate entries
        getStream(formVal).then(function (stream) { // Check if channel exists
          appendToBox(formVal);
          channelArray.push(formVal);
          recurSortDiv(channelArray);
          if (stream.stream === null) {
            $("#status-box").text('Added ' + formVal + ': Offline');
          } else {
            $("#status-box").text('Added ' + formVal + ': Online - ' + stream.stream.channel.status);
          }
        });
      } else {
        $("#status-box").text('Duplicate! ' + formVal + ' is already listed below.');
      }
    });

    $("#search-form").keypress(function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        $("#btn-search").click();
      }
    });

  }());

});
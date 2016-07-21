/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {

  "use strict";

  (function () {

    /* Initialize entries
    ======================================== */

    function getTwitch(getWhat, id) {
      return $.getJSON("https://api.twitch.tv/kraken/" + getWhat + "/" + id)
        .then(function (data) {
          return data;
        });
    }

    var getChannel = getTwitch.bind(null, 'channels');
    var getStream = getTwitch.bind(null, 'streams');

    function divChannel(data, id) {
      var $div = $("<div>", {"class": "entry", "id": id.toLowerCase()});
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
        $("#results-box").append(divChannel(data, channel));
      });
    }

    var channelArray = ["ESL_SC2", "cretetion", "OgamingSC2", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    var i;

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

    $("#btn-online").on("click", function() {
      $(".offline-entry").hide();
      $(".online-entry").show();
    })

    $("#btn-offline").on("click", function() {
      $(".offline-entry").show();
      $(".online-entry").hide();
    })

    $("#btn-all").on("click", function() {
      $(".offline-entry").show();
      $(".online-entry").show();
    })

    /* Search Button
    ======================================== */

    $("#btn-search").on("click", function() {
      appendToBox($('#search-form').val());
      channelArray.push($('#search-form').val());
      recurSortDiv(channelArray);
    })

  }());

});
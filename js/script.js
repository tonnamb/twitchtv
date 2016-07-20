/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {

  "use strict";

  (function () {
    function getTwitch(getWhat, id) {
      return $.getJSON("https://api.twitch.tv/kraken/" + getWhat + "/" + id)
        .then(function (data) {
          return data;
        });
    }

    var getChannel = getTwitch.bind(null, 'channels');
    var getStream = getTwitch.bind(null, 'streams');

    function divChannel(channel) {
      var $div = $("<div>", {"class": "entry", "id": channel.name});
      $div.append("<img class='entry-logo' src='" + channel.logo + "'>");
      $div.append("<p class='entry-name'><a href='https://www.twitch.tv/" + channel.name + "' target='_blank'>" + channel.display_name + "</p>");
      getStream(channel.name).then(function (stream) {
        if (stream.stream === null) {
          $div.append("<p class='entry-status'>Offline</p>");
        } else {
          $div.append("<p class='entry-status'>" + stream.stream.channel.status + "</p>");
        }
      });
      return $div;
    }

    function appendToBox(channel) {
      getChannel(channel).then(function (data) {
        $("#results-box").append(divChannel(data));
      });
    }

    var channelArray = ["ESL_SC2", "cretetion", "OgamingSC2", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    var i;

    channelArray.forEach(appendToBox);

    function checkStatus(id) {
      return getStream(id).then(function (stream) {
        if (stream.stream === null) {
          return {name: id.toLowerCase(), status: false};
        } else {
          return {name: id.toLowerCase(), status: true};
        }
      });
    }

    function recurCheckStatus(channels) {
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

    function moveToTop(id) {
      $("#"+id.name).prependTo("#results-box");
    }

    function sortDiv(arr) {
      arr.forEach(moveToTop);
    }

    recurCheckStatus(channelArray);

  }());

});
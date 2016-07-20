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
    
    function checkStatus(id) {
      return getStream(id).then(function (stream) {
        if (stream.stream === null) {
          return false;
        } else {
          return true;
        }
      });
    }

    function divChannel(channel) {
      var $div = $("<div>", {"class": "entry"});
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
        
    var channelArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    var i;
    
    channelArray.forEach(appendToBox);
    
    checkStatus(channelArray[0]).then(function (returndata) {
      console.log(returndata);
    });
    
  }());

});
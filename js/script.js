/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {

  "use strict";

  (function () {
    function getTwitch(getWhat, id, callback) {
      $.getJSON("https://api.twitch.tv/kraken/" + getWhat + "/" + id, function (data) {
        callback(data);
      });
    }
    
    var getChannel = getTwitch.bind(null, 'channels');
    var getStream = getTwitch.bind(null, 'streams');
    
    function divChannel(channel) {
      var $div = $("<div>", {"class": "entry"});
      $div.append("<img class='entry-logo' src='" + channel.logo + "'>");
      $div.append("<p class='entry-name'><a href='https://www.twitch.tv/" + channel.name + "' target='_blank'>" + channel.display_name + "</p>");
      getStream(channel.name, function (stream) {
        if (stream.stream === null) {
          $div.append("<p class='entry-status'>Offline</p>");
        } else {
          $div.append("<p class='entry-status'>" + stream.stream.channel.status + "</p>");
        }
      });
      return $div;
    }
    
    function appendToBox(data) {
      $("#results-box").append(divChannel(data));
    }
        
    var channelArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    var i;
    
    for (i = 0; i < channelArray.length; i += 1) {
      getChannel(channelArray[i], appendToBox);
    }
    
    function checkStatus(id) {
      return $.getJSON("https://api.twitch.tv/kraken/streams/" + id)
      .then(function(stream) {
        if (stream.stream === null) {
          return false;
        } else {
          return true;
        }
      });
    }
    
    checkStatus(channelArray[0]).then(function(returndata) {
      console.log(returndata);
    });
    
  }());

});
"use strict";

var twitchNames = ["freecodecamp", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404", "world_war_1"];
var channelsArray = []; //array to hold channel detail info
var trueCount = 0; //counter to handle async nature of ajax gets vs array iteration

function channelInfo() {
  var namedArray = [];
  trueCount = 0;
  // replaced for-loop with forEach --- for (var i = 0; i < twitchNames.length; i++) {
  twitchNames.forEach(function (entry) {

    var c = $.ajax({
      url: "https://api.twitch.tv/kraken/channels/" + entry,
      type: "GET",
      async: false,
      dataType: "json"

    });
    c.always(function (d1) {

      var logoPath = "";
      var liveImage = "";
      var gameStatus = "";
      var chanName = twitchNames[trueCount];

      trueCount += 1;

      if (!d1.name) {
        //if - channel is not found in API ...
        logoPath = "https://c4.staticflickr.com/9/8753/28244007723_a2970bcbb1_m.jpg";
        gameStatus = "Account Closed";
        namedArray.push({
          name: chanName,
          logo: logoPath,
          status: gameStatus,
          preview: "offline",
          url: ""
        });
      } else {
        //else - channel is found in API...
        gameStatus = d1.status;
        //check if no logo
        if (d1.logo == null) {
          logoPath = "https://c4.staticflickr.com/9/8753/28244007723_a2970bcbb1_m.jpg";
        } else {
          logoPath = d1.logo;
        };

        liveImage = "<p class='details'>offline</p>";
        namedArray.push({
          name: d1.name,
          logo: logoPath,
          status: gameStatus,
          preview: "offline",
          url: d1.url
        });
      }; //end if-else

      // when async ajax loop matches array length, go on to showChannels function
      if (namedArray.length == twitchNames.length) {
        showChannels(channelsArray, namedArray);
      }
    }); //end c.done
  }); // end twitchnames for loop
} //end channel info function

// function to retrieve list of live twitch channels in the game=programming category
function getLiveChannels(url) {
  var logoPath;
  var a = $.ajax({
    url: url,
    type: "GET",
    dataType: "json"

  }); //end ajax call
  a.then(function (d4) {
    for (var m = 0; m < d4.streams.length; m++) {
      //check if no logo
      if (d4.streams[m].channel.logo == null) {
        logoPath = "https://c4.staticflickr.com/9/8753/28244007723_a2970bcbb1_m.jpg";
      } else {
        logoPath = d4.streams[m].channel.logo;
      }
      // add the channel API info into output array
      channelsArray.push({
        name: d4.streams[m].channel.name,
        logo: logoPath,
        status: d4.streams[m].channel.status,
        preview: d4.streams[m].preview.small,
        url: d4.streams[m].channel.url
      });

      //check if this found live channel is in pre-defined twitchNames array list, if so - remove from twitchNames
      var p = twitchNames.indexOf(d4.streams[m].channel.name);
      if (p >= 0) {
        twitchNames.splice(p, 1);
      };
    } //end for loop
  }); //end a.then
  a.then(function () {
    // get channel API info from array of channel names in twitchNames list
    channelInfo();
  });
} //end get live channels function

// function to send channels listings out to Output Div   
function showChannels(channelsArray, namedArray) {
  var previewLine;
  var wellColor;
  //combine found live channels array with predefined twitchNames array
  var showArray = channelsArray.concat(namedArray);

  for (var i = 0; i < showArray.length; i++) {

    if (showArray[i].preview == "offline") {
      // offline channel
      previewLine = "<p class='details'>offline</p>";
      wellColor = "";
    } else {
      // live channel
      previewLine = "<img src='" + showArray[i].preview + "'  width='100'  alt='on-air'>";
      wellColor = "style='background-color: #d9ead3'";
    };
    //create html channel info row and send to output div
    $("#output").append("<div><div class='well well-sm'" + wellColor + "><div class='row'><div class='col-xs-1'><img class='channelLogo' src=" + showArray[i].logo + "></div><div class='col-xs-3'><h5 class='channelName'><a href=" + showArray[i].url + ">" + showArray[i].name + "</h5></a></div><div class='col-xs-5'><p class='details'>" + showArray[i].status + "</p></div><div class='col-xs-3'>" + previewLine + "</div></div></div></div>");
  } //end for looop
} // end showChannels function

$(document).ready(function () {
  // get list of live channels in the game = programming category
  var url = "https://api.twitch.tv/kraken/streams?game=programming&stream_type=live";
  getLiveChannels(url);
}); // end doc ready function
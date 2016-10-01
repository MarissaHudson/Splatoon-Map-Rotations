//okay lets start by getting the time zone information and the 6 times a day the stages switch
//we will put a list of those times in localhours
var timeslots = [];
var timezone = -(new Date()).getTimezoneOffset() - 120;
timezone = ((timezone % 240) + 240) % 240;
console.log("Your timezone is: " + timezone);
localhours = [];
updatetime = 0;
var isAnimating = false;
//get the clients local hours for stage changes based on what their new Date() is
function setLocalHours() {
    var offset = timezone;
    console.log("Setting local hours");
    for (var i = 0; i < 6; i++) {
        localhours[localhours.length] = pad2(offset / 60) + ':' + pad2(offset % 60);
        offset += 60 * 4;
        console.log("Local hour: " + localhours[i]);

    }
}
function pad2(i) {
    var str = (i | 0).toString(10);
    if (i < 10)
        str = '0' + str;
    return str;
}
//next make some basic structs to better organize the data 
function Timeslot(turf, ranked, starttime, endtime) {
    this.turf = turf;
    this.ranked = ranked;
    this.time = { starttime, endtime };
}
function Turf(maps) {
    this.maps = maps;
}
function Ranked(maps, mode) {
    this.maps = maps;
    this.mode = mode;
}
//all the stage image names 
function getImage(name) {
    result = "";
    switch (name) {
        case "Walleye Warehouse":
            result = "walleye-warehouse.jpg";
            break;
        case "Kelp Dome":
            result = "kelp-dome.jpg";
            break;
        case "Bluefin Depot":
            result = "bluefin-depot.jpg";
            break;
        case "Mahi-Mahi Resort":
            result = "mahi-mahi-resort.jpg";
            break;
        case "Saltspray Rig":
            result = "saltspray-rig.jpg";
            break;
        case "Blackbelly Skatepark":
            result = "blackbelly-skatepark.jpg";
            break;
        case "Camp Triggerfish":
            result = "camp-triggerfish.jpg";
            break;
        case "Piranha Pit":
            result = "piranha-pit.jpg";
            break;
        case "Hammerhead Bridge":
            result = "hammerhead-bridge.jpg";
            break;
        case "Ancho-V Games":
            result = "ancho-v-games.jpg";
            break;
        case "Flounder Heights":
            result = "flounder-heights.jpg";
            break;
        case "Urchin Underpass":
            result = "urchin-underpass.jpg";
            break;
        case "Arowana Mall":
            result = "arowana-mall.jpg";
            break;
        case "Museum d'Alfonsino":
            result = "museum-dalfonsino.jpg";
            break;
        case "Port Mackerel":
            result = "port-mackerel.jpg";
            break;
        case "Moray Towers":
            result = "moray-towers.jpg";
            break;
    }
    return "images/maps/" + result;
}
//get the json feed for the map schedule
$.getJSON("https://splatoon.ink/schedule.json?random=" + Date.now(), function (data) {
    console.log("Retrieving the splatoon.ink feed");
    for (i = 0; i < data["schedule"].length; i++) {
        turf = new Turf(data["schedule"][i].modes[0].maps);
        ranked = new Ranked(data["schedule"][i].modes[1].maps, data["schedule"][i].modes[1].rulesEN);
        timeslots[timeslots.length] = new Timeslot(turf, ranked, data["schedule"][i].startTime, data["schedule"][i].endTime);
        updatetime = data.updateTime;
        console.log("Map " + i);
        console.log("Turf Maps: " + turf.maps[0].nameEN + " and " + turf.maps[1].nameEN);
        console.log("Ranked Maps: " + ranked.maps[0].nameEN + " and " + ranked.maps[1].nameEN);
        console.log("Update Time: " + updatetime);

    }
    Background(); setLocalHours(); FillData(); FixDelay();
    //if we cant get the feed alert the user
}).error(function () { alert("Either you are not connected to the internet or the feed failed to load"); });
//figure out when the stages are going to change based on the current time
function Later(now) {
    console.log("getting the later times")
    min = 99;

    result = 0;
    for (i = 0; i < localhours.length; i++) {
        local = parseInt(localhours[i].substring(0, localhours[i].length - 3));
        console.log("Local: " + local);
        if (now > 24) { console.log("Now (" + now + ") is > 24. Now (" + now + ") = " + now % 24); now %= 24; }
        if (now >= 22) { console.log("Now (" + now + ") is >= 22. Returning " + localhours[0]); return localhours[0]; }
        if (min < 1) { console.log("min (" + min + ") is less than 1; min = 99"); min = 99; }
        if (local - now < min) {
            console.log("local (" + local + ") - now (" + now + ") < min (" + min + ") this is true");
            console.log("min = local (" + local + ") - now (" + now + ")");
            console.log("result = localhours[i] (" + localhours[i] + ")");
            min = local - now;
            result = localhours[i];
        }
    }
    console.log("result = " + result);
    return result;
}
//put all of this data into the index.html website template
function FillData() {
    console.log("Filling data...")
    for (i = 1; i < 4; i++) {
        mapheader = document.getElementById("MapHeaderRanked" + i);
        turfRight = document.getElementById("TurfWarRightImage" + i);
        turfRightP = document.getElementById("TurfWarRightP" + i);
        turfLeft = document.getElementById("TurfWarLeftImage" + i);
        turfLeftP = document.getElementById("TurfWarLeftP" + i);
        rankedRight = document.getElementById("RankedRightImage" + i);
        rankedRightP = document.getElementById("RankedRightP" + i);
        rankedLeft = document.getElementById("RankedLeftImage" + i);
        rankedLeftP = document.getElementById("RankedLeftP" + i);
        timeslot = timeslots[i - 1];
        mapheader.innerHTML = timeslot.ranked.mode;
        turfRight.src = getImage(timeslot.turf.maps[1].nameEN);
        turfRightP.innerText = timeslot.turf.maps[1].nameEN;
        turfLeft.src = getImage(timeslot.turf.maps[0].nameEN);
        turfLeftP.innerText = timeslot.turf.maps[0].nameEN;
        rankedRight.src = getImage(timeslot.ranked.maps[1].nameEN);
        rankedRightP.innerText = timeslot.ranked.maps[1].nameEN;
        rankedLeft.src = getImage(timeslot.ranked.maps[0].nameEN);
        rankedLeftP.innerText = timeslot.ranked.maps[0].nameEN;
    }
    time1 = document.getElementById("Time1");
    time2 = document.getElementById("Time2");
    time3 = document.getElementById("Time3");
    time1.innerText = "Now until " + Later(new Date().getHours());
    time2.innerText = Later(new Date().getHours()) + " until " + Later(new Date().getHours() + 4);
    time3.innerText = Later(new Date().getHours() + 4) + " until " + Later(new Date().getHours() + 8);

}
//animate the background color cuz I think it looks cool
function Background() {
    //these colors came from google chrome suggestions when i was messing with the background color.
    //theyre really pretty and i liked them all so now they'll rotate
    colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"];
    randomcolors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ff9800", "#ff5722"];
    color = randomcolors[Math.floor(Math.random() * randomcolors.length)];
    ColorsDiv = document.getElementById("Colors");
    for (i = 0; i < colors.length; i++) {
        (function () {
            var c = document.createElement("div");
            c.setAttribute("id", colors[i].substring(1, 7));
            c.setAttribute("style", "background-color:" + colors[i] + ";");
            c.setAttribute("class", "color");
            if (c.addEventListener) {  // all browsers except IE before version 9
                c.addEventListener("click", function () { ChangeBackground(c) }, false);
            } else {
                if (c.attachEvent) {   // IE before version 9
                    c.attachEvent("click", function () { ChangeBackground(c) });
                }
            }
            ColorsDiv.appendChild(c);
        }());
    }
    //The users all seem to have a color preference so I'll add in a way for them to choose colors
    body = document.getElementsByTagName("body")[0];
    body.setAttribute("style", "background-color:" + color + "; height:1000px; margin:0px; padding:0px;")
    $("#ColorHoverContainer").focusout(function () {
        if (isAnimating) { return; }
        isAnimating = true;
        $("#Colors").slideUp("fast", function () {
            // Animation complete. 
            isAnimating = false;
        })
    });

    $("#ColorHoverContainer").on({
        mouseenter: function () {
            if (isAnimating) { return; }
            isAnimating = true;
            $("#Colors").slideDown("fast", function () {
                // Animation complete. 
                isAnimating = false;
            }
        )
        }
	,
        mouseleave: function () {
            if (isAnimating) { return; }
            isAnimating = true;
            $("#Colors").slideUp("fast", function () {
                // Animation complete.
                isAnimating = false;
            }
        )
        }

    });
}
//after picking the color, we change the actual background color of the site
function ChangeBackground(C) {
    color = "#" + C.getAttribute("id");
    body = document.getElementsByTagName("body")[0];
    body.setAttribute("style", "background-color:" + color + "; height:1000px; margin:0px; padding:0px;")
}
//Sooo... apparently, the site has a 2-4 minute delay
//this seems to be making my site inaccurate for 2-4 min after the stages change
function FixDelay() {
    //update time seems to be the time that the feed was last updated. if it hasnt been updated in 4 hours i guess we can assume delay
    console.log("Fixing delay");
    console.log("Update Time: " + updatetime + " Now: " + Date.now())
    if (Date.now() > updatetime + 14400000 - 60000) {
        //we have delay. Lets show the next stages
        //to fix this I think we can delete the wrong timeslot and shift header text
        wrong = document.getElementById("TimeSlot1");
        wrong.setAttribute("style", "display:none;")
        time1 = document.getElementById("Time1").innerHTML;
        time2 = document.getElementById("Time2").innerHTML;
        time3 = document.getElementById("Time3").innerHTML;
        document.getElementById("Time2").innerText = time1;
        document.getElementById("Time3").innerText = time2;

    }
}

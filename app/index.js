import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { battery } from "power";

//setup days of the week
const dayLabel = document.getElementById("dayLabel");
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];



// Keep a timestamp of the last reading received. Start when the app is started.
let lastValueTimestamp = Date.now();

// Create a new instance of the HeartRateSensor object
if (HeartRateSensor) {
   const hrm = new HeartRateSensor();
   const myhrm = document.getElementById("myhrm");
   hrm.addEventListener("reading", () => {
     myhrm.text = `${hrm.heartRate}`;
   });
   hrm.start();
} else {
   console.log("This device does NOT have a HeartRateSensor!");
}

// Update the clock every minute
clock.granularity = "seconds";
// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today1 = evt.date;
  let hours = today1.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today1.getMinutes());
  /*let secs = util.zeroPad(today.getSeconds());*/
  myLabel.text = `${hours}:${mins}`;
  if (appbit.permissions.granted("access_activity")) {
   const mysteps = document.getElementById("mysteps");
   mysteps.text=`${today.adjusted.steps}`;
   console.log(`${today.adjusted.steps}`);
   /*  if (today.local.elevationGain !== undefined) {
     console.log(`${today.adjusted.elevationGain} Floor(s)`);
   }*/
  }  
  const mybatt = document.getElementById("mybatt");
  mybatt.text = `${Math.floor(battery.chargeLevel)}` + "%";
  let dayName = days[today1.getDay()];
  dayLabel.text = dayName;
}


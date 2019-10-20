// variables
// create moment object for current moment
let now = moment();
// set app date default to now
let date = now;
//initialize vars
let dateIndex;
let dateReadable;
//set work hours, up to 10 hours
let workHours=9; 
//empty object for when localStorage doesn't have data for a given date. 
const emptyDateObject = {
    hour0: "",
    hour1: "",
    hour2: "",
    hour3: "",
    hour4: "",
    hour5: "",
    hour6: "",
    hour7: "",
    hour8: "",
    hour9: "",
    hour10: "",
};

//sets date related variables  
function setDate(){
    dateIndex = date.format('YYYYMMDD');
    dateReadable = date.format('MMMM Do YYYY');
    console.log("date set", dateReadable);
}

// check url for params
function checkURL(){
    console.log('checkURL()');
    // get URL parameters
    let urlParams = new URLSearchParams(window.location.search);
    // check url for date parameter
    if (urlParams.has('date')){
        //get date from URL param
        dateParam = urlParams.get('date');
        console.log("dateParam =", dateParam);
        //create moment object from user date parameter
        date= moment(dateParam, "YYYYMMDD");
        //set date variables using new moment object
        setDate();
    }
    // offset day's current hour for testing (does not change day)
    if (urlParams.has('offset')){
        //get test-hour parameter data
        hourOffset = urlParams.get('offset');
        parseInt(hourOffset);
        console.log(now);
        //offset now time by URL parameter value in hours (accepts negative)
        now.add(hourOffset, 'h');
        console.log(now);
        console.log("time offset by", hourOffset, "hours");
    }
}

// read plans from localStorage
function readPlans(date) {
    console.log("readPlans()");
    //if localStorage is empty, return an empty object
    if ((localStorage.length===0) || (localStorage.getItem(dateIndex)===null)){
        console.log("no data in localStorage, empty object returned", emptyDateObject);
        return emptyDateObject;
    //return data for current date it exists
    } else {
        console.log("plans Object", JSON.parse(localStorage.getItem(dateIndex)));
        return JSON.parse(localStorage.getItem(dateIndex));
    }
};

// save plans to localStorage
function saveDate() {
    console.log('saveDate()');
    // build an object from input field values
    let dateObject = {
        hour0: $("#inputHour0").val(),
        hour1: $("#inputHour1").val(),
        hour2: $("#inputHour2").val(),
        hour3: $("#inputHour3").val(),
        hour4: $("#inputHour4").val(),
        hour5: $("#inputHour5").val(),
        hour6: $("#inputHour6").val(),
        hour7: $("#inputHour7").val(),
        hour8: $("#inputHour8").val(),
        hour9: $("#inputHour9").val(),
        hour10: $("#inputHour10").val()
    };
    //save dateObject to localStorage
    localStorage.setItem(dateIndex, JSON.stringify(dateObject));
}

// render page for date provided
function renderPage(){
    // read plans for localStorage
    let plans = readPlans(date);
    let workDayHour = moment(dateIndex+"T09");
    console.log(workDayHour);
    // page html template
    let dayHtml='';
    dayHtml+=`
        <div id="container">
        <div id="header">
        <h1>Day Planner</h1>
        <h2>${dateReadable}</h2>
        <button id="clearDay">Clear Day\'s Tasks</button>
        </div>
        <ul id="calendar" class="day" data-date="${dateIndex}">
        `;
    // determine if time slot is in past present or future, set CSS class
    let relTime=""; // past, present, future
    for (let i=0;i<workHours;i++){
        if (parseInt(workDayHour.format('HH'))<parseInt(now.format('HH'))) {
            relTime="past";
        } else if (parseInt(workDayHour.format('HH'))===parseInt(now.format('HH'))) {
            relTime="present";
        } else if (parseInt(workDayHour.format('HH'))>parseInt(now.format('HH'))) {
            relTime="future";
        }
    console.log(parseInt(workDayHour.format('HH')), parseInt(now.format('HH')), relTime);    
    //generate li elements for each hour of work day with relTime classes
    dayHtml+=`
        <li class="hour ${relTime}" data-hour=${i}>
            <form>
                <label>${workDayHour.format('h a')}</label>
                <input type="text" id="inputHour${i}" value="${plans["hour"+i]}">
                <button type="submit" class="save">&#128190</button>
            </form>
        </li>
        `;
    workDayHour.add(1, 'hour');  
    };
    dayHtml+=`
    </ul>
    </div>
    `;
    // append dayHtml to page
    $("body").html(dayHtml);
}

// clear input fields for current day
function clearDate(){
    $("#inputHour0").val('');
    $("#inputHour1").val('');
    $("#inputHour2").val('');
    $("#inputHour3").val('');
    $("#inputHour4").val('');
    $("#inputHour5").val('');
    $("#inputHour6").val('');
    $("#inputHour7").val('');
    $("#inputHour8").val('');
    $("#inputHour9").val('');
    $("#inputHour10").val('');
}

// event listeners
function addEventListeners() {
    // save plans
    $("button.save").on("click", function(){
        event.preventDefault();
        // save plans to localStorage
        saveDate();
    });
    // clear plans
    $("#clearDay").on("click", function(){
        //clear current day's tasks on page
        clearDate();
        //write tasks to localStoge
        saveDate()
    });
}

//main function
function runApp(){
    setDate();
    checkURL();
    renderPage();
    addEventListeners();
}

runApp();
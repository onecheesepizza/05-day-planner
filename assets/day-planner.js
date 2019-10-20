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

// save all hours for current day to localStorage
function saveAllHours() {
    console.log('saveAllHours()');
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
    console.log(localStorage);
}

// save only clicked hour to localStorage
function saveHour() {
    console.log('saveHour()');
    //hour to update from event target
    let hour = event.target.value;
    //create string from event target to get input field value
    let newRecordID="#inputHour"+hour[hour.length-1];
    //get value from input field associated with specific button clicked
    let newRecord=$(newRecordID).val();
    //set localStorage key from value of clicked button 
    let recordToUpdate=event.target.value;
    //initialize object to write to localStorage
    let dateObject;
    //if local storage is not empty and has data for the current date, 
    //build new record using data already in localStorage,
    //disregarding the data on the page aside from the specific hour to be updated.
    //this way only the record associated with the clicked button is updated.
    if ((localStorage.length===0) || (localStorage.getItem(dateIndex)===null)){
        console.log("no data in localStorage, empty object returned", emptyDateObject);
        dateObject = {
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
    //return data for current date it exists
    } else {
        dateObject = JSON.parse(localStorage.getItem(dateIndex));
    }
    console.log("dateObject",dateObject);
    //add new record to the date object
    dateObject[recordToUpdate]=newRecord;
    console.log("dateObject newRecord",dateObject);
    //write the object containing the new record to localStorage
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
        <button id="clearDay" class="headerButton">Clear All</button>
        <button id="saveAll" class="headerButton">Save All</button>
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
                <button type="submit" class="save" value="hour${i}">&#128190</button>
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
    // save hour
    $("button.save").on("click", function(){
        event.preventDefault();
        // save hour to localStorage
        saveHour();
    });
    // clear plans
    $("#clearDay").on("click", function(){
        //clear current day's tasks on page
        clearDate();
        //write tasks to localStoge
        saveAllHours()
    });
    // save all hours
    $("#saveAll").on("click", function(){
        // save plans to localStorage
        saveAllHours();
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
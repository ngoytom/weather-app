const form = document.querySelector("form")
const submit = document.querySelector(".submit-location")
const clock = document.querySelector(".time")
const date = document.querySelector(".date")
const temperatureCheck = document.querySelector(".temperature-check")

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let storeBasic = null; //Variable Store weatherData
let store = null; //Variable stores advWeatherData information for start load
let pageCount = 1; //Variable stores current page for Hourly Nav
let celcius = true;

const daily = document.querySelector(".daily")
const hourly = document.querySelector(".hourly")
const hourlyOptions = document.querySelector(".hourly-nav")
const hourlyNav = document.querySelectorAll(".page-link")

const timeOne = document.querySelector(".time-1")
const timeTwo = document.querySelector(".time-2")
const timeThree = document.querySelector(".time-3")
const timeFour = document.querySelector(".time-4")
const timeFive = document.querySelector(".time-5")
const timeSix = document.querySelector(".time-6")
const timeSeven = document.querySelector(".time-7")
const timeEight = document.querySelector(".time-8")

form.addEventListener("submit", getLocation);
submit.addEventListener("click", getLocation);
temperatureCheck.addEventListener("click", validateCheck);

start = () => {
    getWeatherData("Toronto");
}

//Change Local Time to City Time of city searched ADVANCED WEATHER FUNCTION
updateCityTime = (advWeatherData) => {
    const date = new Date();
    const convertedDate = convertTimeZone(date, advWeatherData.timezone);
    let hours = convertedDate.getHours();
    const minutes = "0" + convertedDate.getMinutes();
    const seconds = "0" + convertedDate.getSeconds();
    let desc = "AM"

    if (hours > 12){
        desc = "PM";
        hours -= 12;
    }
    else if (hours == 0){
        desc == "AM";
        hours = 12;
    }
    else{
        desc = "AM";
    }
    clock.textContent = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)} ${desc}`
}   

//Converts UTC Time to local time
convertTimeZone = (date ,timezone) => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: timezone}));
}

window.setInterval(function(){
    updateCityTime(store);
}, 1000) //Every 1 second

updateDate = (advWeatherData) => {
    const dateT = new Date();
    const convertedDate = convertTimeZone(dateT, advWeatherData.timezone);
    console.log(convertedDate)
    const day = convertedDate.getDate();
    console.log(day)
    const month = convertedDate.getMonth();
    console.log(month)
    const year = convertedDate.getFullYear();
    console.log(year)
    
    date.textContent = `${month}/${day}/${year}`
}

displayHourly = () => {
   daily.style.display = "none";
   hourly.style.display = "block";
   hourlyOptions.style.display = "inline-block";
}

displayDaily = () => {
    daily.style.display = "block";
    hourly.style.display = "none";
    hourlyOptions.style.display = "none";
    
 }

 function validateCheck(){
     if (temperatureCheck.checked){
        celcius = false; 
     }
     else{
         celcius = true;
     }
     displayData(storeBasic);
     renderDailyForecast(store);
     renderHourlyTime(store);
 }

function getLocation(e){
    e.preventDefault(); //Prevents page from refreshing when submitting text field
    const input = document.querySelector("input[type='text']")
    const location = input.value;
    console.log(location);
    getWeatherData(location);
    //Pass location into API fetch function
}

//This function gets basic information weather information including log and lat which will be used in our second API call
async function getWeatherData(location){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=APIKEY`)
    //Make sure API key is safe before uploading
    const weatherData = await response.json();
    console.log(weatherData);
    const newData = processWeatherData(weatherData);
    storeBasic = newData;
    displayData(newData);
    const advNewData = getAdvancedWeatherData(weatherData);

}

//Gets Current Weather, Feels Like, Humidity, Wind Speed, Country, City Name, Condition. Lon and Lat for second API call
function processWeatherData(weatherData){
    const data = {
        currentTemp: {
            c: Math.round(weatherData.main.temp), //Metric system
            f: Math.round((weatherData.main.temp * 1.8) + 32),
        },
        feelsLike: {
            c: Math.round(weatherData.main.feels_like),
            f: Math.round((weatherData.main.feels_like * 1.8) + 32),
        },
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        country: weatherData.sys.country,
        cityName: weatherData.name,
        condition: weatherData.weather[0].description.toUpperCase(),
    }
    return data;
}

async function getAdvancedWeatherData(processedWeatherData){  
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${processedWeatherData.coord.lat}&lon=${processedWeatherData.coord.lon}&
    exclude=minutely,alerts&units=metric&appid=APIKEY`)
    const advWeatherData = await response.json();
    store = advWeatherData;

    for (let i = 0; i < hourlyNav.length; i++){
        console.log("hi")
        hourlyNav[i].addEventListener("click", function(){
            renderHourlyTime(store, this.id);
        },false);
    }

    updateCityTime(advWeatherData);
    updateDate(advWeatherData);
    renderDailyForecast(advWeatherData);
    renderHourlyTime(advWeatherData);
    console.log(advWeatherData)

}

//Gets the names of the next day to display to DOM
function getNextDays(day){
    let currentDay = 0;
    let sequence = [];

    if (day == "Sunday")
        currentDay = 0;
    else if (day == "Monday")
        currentDay = 1;
    else if (day == "Tuesday")
        currentDay = 2;
    else if (day == "Wednesday")
        currentDay = 3;
    else if (day == "Thursday")
        currentDay = 4;
    else if (day == "Friday")
        currentDay = 5;
    else if (day == "Saturday")
        currentDay = 6;
    
    for(let i = 0; i < days.length; i++){
        //Goes back to the beginning of the list
        if (currentDay > 6){
            currentDay = 0;
        }
        sequence.push(days[currentDay]);
        currentDay++;
    }
    return sequence;
}

//Function Renders Daily Weather
function renderDailyForecast(advWeatherData){

    //Render Day
    const date = new Date();
    const current = date.toLocaleString("en-us", {timeZone: advWeatherData.timezone, weekday: "long"});
    const sequence = getNextDays(current);

    document.querySelector("#day1").textContent = `${sequence[0]}`;
    document.querySelector("#day2").textContent = `${sequence[1]}`;
    document.querySelector("#day3").textContent = `${sequence[2]}`;
    document.querySelector("#day4").textContent = `${sequence[3]}`;
    document.querySelector("#day5").textContent = `${sequence[4]}`;
    document.querySelector("#day6").textContent = `${sequence[5]}`;
    document.querySelector("#day7").textContent = `${sequence[6]}`;

    if (celcius == true){
        //Render Daily Highs
        document.querySelector("#day-1-high").innerHTML = `${Math.round(advWeatherData.daily[1].temp.max)} <sup>°C</sup>`;
        document.querySelector("#day-2-high").innerHTML = `${Math.round(advWeatherData.daily[2].temp.max)} <sup>°C</sup>`;
        document.querySelector("#day-3-high").innerHTML = `${Math.round(advWeatherData.daily[3].temp.max)} <sup>°C</sup>`;
        document.querySelector("#day-4-high").innerHTML = `${Math.round(advWeatherData.daily[4].temp.max)} <sup>°C</sup>`;
        document.querySelector("#day-5-high").innerHTML = `${Math.round(advWeatherData.daily[5].temp.max)} <sup>°C</sup>`;
        document.querySelector("#day-6-high").innerHTML = `${Math.round(advWeatherData.daily[6].temp.max)} <sup>°C</sup>`;
        document.querySelector("#day-7-high").innerHTML = `${Math.round(advWeatherData.daily[7].temp.max)} <sup>°C</sup>`;

        //Render Daily Lows
        document.querySelector("#day-1-low").innerHTML = `${Math.round(advWeatherData.daily[1].temp.min)} <sup>°C</sup>`;
        document.querySelector("#day-2-low").innerHTML = `${Math.round(advWeatherData.daily[2].temp.min)} <sup>°C</sup>`;
        document.querySelector("#day-3-low").innerHTML = `${Math.round(advWeatherData.daily[3].temp.min)} <sup>°C</sup>`;
        document.querySelector("#day-4-low").innerHTML = `${Math.round(advWeatherData.daily[4].temp.min)} <sup>°C</sup>`;
        document.querySelector("#day-5-low").innerHTML = `${Math.round(advWeatherData.daily[5].temp.min)} <sup>°C</sup>`;
        document.querySelector("#day-6-low").innerHTML = `${Math.round(advWeatherData.daily[6].temp.min)} <sup>°C</sup>`;
        document.querySelector("#day-7-low").innerHTML = `${Math.round(advWeatherData.daily[7].temp.min)} <sup>°C</sup>`;
    }
    else{
        //Render Daily Highs
        document.querySelector("#day-1-high").innerHTML = `${Math.round(advWeatherData.daily[1].temp.max * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-2-high").innerHTML = `${Math.round(advWeatherData.daily[2].temp.max * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-3-high").innerHTML = `${Math.round(advWeatherData.daily[3].temp.max * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-4-high").innerHTML = `${Math.round(advWeatherData.daily[4].temp.max * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-5-high").innerHTML = `${Math.round(advWeatherData.daily[5].temp.max * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-6-high").innerHTML = `${Math.round(advWeatherData.daily[6].temp.max * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-7-high").innerHTML = `${Math.round(advWeatherData.daily[7].temp.max * 1.8 + 32)} <sup>°F</sup>`;

        //Render Daily Lows
        document.querySelector("#day-1-low").innerHTML = `${Math.round(advWeatherData.daily[1].temp.min * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-2-low").innerHTML = `${Math.round(advWeatherData.daily[2].temp.min * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-3-low").innerHTML = `${Math.round(advWeatherData.daily[3].temp.min * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-4-low").innerHTML = `${Math.round(advWeatherData.daily[4].temp.min * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-5-low").innerHTML = `${Math.round(advWeatherData.daily[5].temp.min * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-6-low").innerHTML = `${Math.round(advWeatherData.daily[6].temp.min * 1.8 + 32)} <sup>°F</sup>`;
        document.querySelector("#day-7-low").innerHTML = `${Math.round(advWeatherData.daily[7].temp.min * 1.8 + 32)} <sup>°F</sup>`;
    }
}



function convertTime(unixTime){
    const date = new Date(unixTime * 1000);
    const hours = date.getHours();
    return hours
}

function updateHourlyPage(id) {
    if (id == 1){
        pageCount = 1;
    }
    else if (id == 2){
        pageCount = 2;
    }
    else if (id == 3){
        pageCount = 3;
    }
    else if (id == 0 && pageCount > 1){
        pageCount--;
    }
    else if (id == 4 && pageCount < 3){ //Next Button
        pageCount++;
    }
}

function renderHourlyTime(advWeatherData, id = 1){
    console.log(id);
    updateHourlyPage(id);
    let time = [];
    let temp = [];
    let p = null;
    let min = 1;
    let max = 9;

    
    if (pageCount == 1){
        min = 1;
        max = 9;
    }
    else if (pageCount == 2){
        min = 9;
        max = 17;
    }
    else if(pageCount == 3){
        min = 17;
        max = 25;
    }
    
    for (let i = min; i < max; i++){
        p = convertTime(advWeatherData.hourly[i].dt);
        if (p > 12){
            p -= 12;
            time.push(p + " pm");
        }
        else if (p == 0){
            p = 12;
            time.push(p + " am");
        }
        else{
            time.push(p + " am");
        }
    }

    document.querySelector("#time-1").textContent = `${time[0]}`
    document.querySelector("#time-2").textContent = `${time[1]}`
    document.querySelector("#time-3").textContent = `${time[2]}`
    document.querySelector("#time-4").textContent = `${time[3]}`
    document.querySelector("#time-5").textContent = `${time[4]}`
    document.querySelector("#time-6").textContent = `${time[5]}`
    document.querySelector("#time-7").textContent = `${time[6]}`
    document.querySelector("#time-8").textContent = `${time[7]}`
    
    temp = getHourlyTemperature(advWeatherData, min, max);

    if (celcius == true){
        document.querySelector("#temp-1").innerHTML = `${temp[0]} <sup>°C</sup>`
        document.querySelector("#temp-2").innerHTML = `${temp[1]} <sup>°C</sup>`
        document.querySelector("#temp-3").innerHTML = `${temp[2]} <sup>°C</sup>`
        document.querySelector("#temp-4").innerHTML = `${temp[3]} <sup>°C</sup>`
        document.querySelector("#temp-5").innerHTML = `${temp[4]} <sup>°C</sup>`
        document.querySelector("#temp-6").innerHTML = `${temp[5]} <sup>°C</sup>`
        document.querySelector("#temp-7").innerHTML = `${temp[6]} <sup>°C</sup>`
        document.querySelector("#temp-8").innerHTML = `${temp[7]} <su>p°C</sup>`
    }
    else{
        document.querySelector("#temp-1").innerHTML = `${Math.round(temp[0] * 1.8 + 32)} <sup>°F</sup>`
        document.querySelector("#temp-2").innerHTML = `${Math.round(temp[1] * 1.8 + 32)} <sup>°F</sup>`
        document.querySelector("#temp-3").innerHTML = `${Math.round(temp[2] * 1.8 + 32)} <sup>°F</sup>`
        document.querySelector("#temp-4").innerHTML = `${Math.round(temp[3] * 1.8 + 32)} <sup>°F</sup>`
        document.querySelector("#temp-5").innerHTML = `${Math.round(temp[4] * 1.8 + 32)} <sup>°F</sup>`
        document.querySelector("#temp-6").innerHTML = `${Math.round(temp[5] * 1.8 + 32)} <sup>°F</sup>`
        document.querySelector("#temp-7").innerHTML = `${Math.round(temp[6] * 1.8 + 32)} <sup>°F</sup>`
        document.querySelector("#temp-8").innerHTML = `${Math.round(temp[7] * 1.8 + 32)} <sup>°F</sup>`
    }
}

function getHourlyTemperature(advWeatherData, min, max){
    let temp = [];
    console.log(min)
    console.log(max)
   
    for (let i = min; i < max; i++){
        console.log("asdasd")
        temp.push(Math.round(advWeatherData.hourly[i].temp));
    }

    return temp;
}


//Display information to the DOM
function displayData(weatherData){
    if (celcius == true){
        document.querySelector(".feels-like").innerHTML = `Feels like: ${weatherData.feelsLike.c} <sup>°C</sup>`;
        document.querySelector(".current-temp").innerHTML = `${weatherData.currentTemp.c}<sup class="superscript">°C</sup>`;
    }
    else{
        document.querySelector(".feels-like").innerHTML = `Feels like: ${weatherData.feelsLike.f} <sup>°F</sup>`;
        document.querySelector(".current-temp").innerHTML = `${weatherData.currentTemp.f}<sup class="superscript">°F</sup>`;
    }
    document.querySelector(".humidity").textContent = `Humidity: ${weatherData.humidity}%`;
    document.querySelector(".wind-speed").textContent = `Wind: ${weatherData.windSpeed} m/s`;
    document.querySelector(".location").textContent = `${weatherData.cityName}, ${weatherData.country}`;
    document.querySelector(".description").textContent = weatherData.condition;
}
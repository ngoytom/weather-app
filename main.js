const form = document.querySelector("form")
const submit = document.querySelector(".submit-location")
const clock = document.querySelector(".time")
const date = document.querySelector(".date")

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

daily = document.querySelector(".daily")
hourly = document.querySelector(".hourly")

form.addEventListener("submit",getLocation)
submit.addEventListener("click",getLocation)

//When pages launch, load local time + date
updateLocalTime = () => {

    const now = new Date();
    let hour = now.getHours();
    const min = String(now.getMinutes()).padStart(2,"0");
    const sec = String(now.getSeconds()).padStart(2,"0");
    let desc = "AM"

    if (hour > 12){
        desc = "PM";
        hour -= 12;
    }
    else{
        desc = "AM";
    }
    clock.textContent = `${hour}:${min}:${sec} ${desc}`
}

setInterval(updateLocalTime, 1000) //Every 1 second

updateDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    date.textContent = `${day}/${month}/${year}`
}

start = () => {
    updateLocalTime();
    updateDate();
}

displayHourly = () => {
   daily.style.display = "none";
   hourly.style.display = "block"
}

displayDaily = () => {
    daily.style.display = "block";
    hourly.style.display = "none"
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
    updateCityTime(weatherData);
    displayData(newData);
    const advNewData = getAdvancedWeatherData(weatherData);

}

//Change Local Time to City Time of city searched ADVANCED WEATHER FUNCTION
updateCityTime = (weatherData) => {
    //https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
}   

//Gets Current Weather, Feels Like, Humidity, Wind Speed, Country, City Name, Condition. Lon and Lat for second API call
function processWeatherData(weatherData){
    const data = {
        currentTemp: {
            c: Math.round(weatherData.main.temp), //Metric system
            f: Math.round((weatherData.main.temp - 32)/1.8000),
        },
        feelsLike: {
            c: Math.round(weatherData.main.feels_like),
            f: Math.round((weatherData.main.feels_like - 32)/1.8000),
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
    console.log(processedWeatherData)

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${processedWeatherData.coord.lat}&lon=${processedWeatherData.coord.lon}&
    exclude=minutely,alerts&units=metric&appid=APIKEY`)
    const advWeatherData = await response.json();
    renderDailyForecast(advWeatherData);
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

    //Render Daily Highs
    document.querySelector("#day-1-high").textContent = `${Math.round(advWeatherData.daily[1].temp.max)}`;
    document.querySelector("#day-2-high").textContent = `${Math.round(advWeatherData.daily[2].temp.max)}`;
    document.querySelector("#day-3-high").textContent = `${Math.round(advWeatherData.daily[3].temp.max)}`;
    document.querySelector("#day-4-high").textContent = `${Math.round(advWeatherData.daily[4].temp.max)}`;
    document.querySelector("#day-5-high").textContent = `${Math.round(advWeatherData.daily[5].temp.max)}`;
    document.querySelector("#day-6-high").textContent = `${Math.round(advWeatherData.daily[6].temp.max)}`;
    document.querySelector("#day-7-high").textContent = `${Math.round(advWeatherData.daily[7].temp.max)}`;

    //Render Daily Lows
    document.querySelector("#day-1-low").textContent = `${Math.round(advWeatherData.daily[1].temp.min)}`;
    document.querySelector("#day-2-low").textContent = `${Math.round(advWeatherData.daily[2].temp.min)}`;
    document.querySelector("#day-3-low").textContent = `${Math.round(advWeatherData.daily[3].temp.min)}`;
    document.querySelector("#day-4-low").textContent = `${Math.round(advWeatherData.daily[4].temp.min)}`;
    document.querySelector("#day-5-low").textContent = `${Math.round(advWeatherData.daily[5].temp.min)}`;
    document.querySelector("#day-6-low").textContent = `${Math.round(advWeatherData.daily[6].temp.min)}`;
    document.querySelector("#day-7-low").textContent = `${Math.round(advWeatherData.daily[7].temp.min)}`;

}


//Display information to the DOM
function displayData(weatherData){
    document.querySelector(".feels-like").innerHTML = `Feels like: ${weatherData.feelsLike.c} <sup>°C</sup>`;
    document.querySelector(".current-temp").innerHTML = `${weatherData.currentTemp.c}<sup class="superscript">°C</sup>`;
    document.querySelector(".humidity").textContent = `Humidity: ${weatherData.humidity}%`;
    document.querySelector(".wind-speed").textContent = `Wind: ${weatherData.windSpeed} m/s`;
    document.querySelector(".location").textContent = `${weatherData.cityName}, ${weatherData.country}`;
    document.querySelector(".description").textContent = weatherData.condition;
}
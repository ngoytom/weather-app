const form = document.querySelector("form")
const submit = document.querySelector(".submit-location")
const clock = document.querySelector(".time")
const date = document.querySelector(".date")

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

}

//Change Local Time to City Time of city searched ADVANCED WEATHER FUNCTION
updateCityTime = (weatherData) => {
    //https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
    console.log(new Date(weatherData.dt*1000+(weatherData.timezone*1000))); // plus
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
        coords: {
            lat: weatherData.coord.lat,
            lon: weatherData.coord.long,
        },
    }

    console.log(data.currentTemp.c);
    console.log(data.condition);
    console.log(data.windSpeed);
    return data;
}

async function getAdvancedWeatherData(location){    
    
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
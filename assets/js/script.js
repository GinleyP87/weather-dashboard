

async function formatPage(cityID) {

    var key = '40d8b8389636b89f162bb5d11734a1f1';

    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    if (cityID == null || cityID == '') {
        //cityID = "Cleveland";
       document.getElementById("weather").style.display = "none";
       document.getElementById("day1").style.display = "none";
       document.getElementById("day2").style.display = "none";
       document.getElementById("day3").style.display = "none";
       document.getElementById("day4").style.display = "none";
       document.getElementById("day5").style.display = "none";
    } 
    else {
        document.getElementById("weather").style.display = "block";
        document.getElementById("day1").style.display = "block";
        document.getElementById("day2").style.display = "block";
        document.getElementById("day3").style.display = "block";
        document.getElementById("day4").style.display = "block";
        document.getElementById("day5").style.display = "block";  
        var jsonToday = await getJsonData('https://api.openweathermap.org/data/2.5/weather?q=' + cityID + '&appid=' + key);

        //document.getElementById('rawdataToday').innerHTML = JSON.stringify(jsonToday, null, 4);

        var lat = jsonToday.coord.lat;

        var lon = jsonToday.coord.lon;

        drawWeatherToday(jsonToday);



        var jsonForecast = await getJsonData('https://api.openweathermap.org/data/2.5/forecast?q=' + cityID + '&appid=' + key);

        //document.getElementById('rawdataForecast').innerHTML = JSON.stringify(jsonForecast, null, 4);

        drawWeatherForecast(jsonForecast);



        var jsonForecastUV = await getJsonData("https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&cnt=1");

        //document.getElementById('rawdataForecastUV').innerHTML = JSON.stringify(jsonForecastUV, null, 4);

        drawWeatherTodayUV(jsonForecastUV);

        searchHistorySave(cityID);
    }

    searchHistoryDisplay();


    //var cityID = "Cleveland";



}



async function getJsonData(url) {

    const response = await fetch(url, {});
    const json = await response.json();
    return json;
}





function drawWeatherForecast(jsonData) {

    updateWeatherForecastFields(jsonData, 3, 1);

    updateWeatherForecastFields(jsonData, 11, 2);

    updateWeatherForecastFields(jsonData, 19, 3);

    updateWeatherForecastFields(jsonData, 27, 4);

    updateWeatherForecastFields(jsonData, 35, 5);



}

function updateWeatherForecastFields(d, index, idsuffix) {

    //var index = 3

    var temp = d.list[index].main.temp;

    temp = formatTemp(temp)

    var humidity = d.list[index].main.humidity;

    var windspeed = d.list[index].wind.speed;

    var weatherIcon = d.list[index].weather[0].icon;

    var date = d.list[index].dt_txt;

    date = new Date(date);

    date = formatDate(date);



    document.getElementById("temp" + idsuffix).innerHTML = "Temp: " + temp;

    document.getElementById("humidity" + idsuffix).innerHTML = "Humidity: " + humidity + " %";

    document.getElementById("windSpeed").innerHTML = "Wind Speed: " + windspeed;

    document.getElementById("weatherIcon" + idsuffix).innerHTML = "<img src=\"https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png\">";

    document.getElementById("date" + idsuffix).innerHTML = "Date: " + date;

}





function drawWeatherToday(jsonData) {

    var city = jsonData.name;

    var date = jsonData.dt;

    date = new Date(date * 1000);

    date = formatDate(date);



    var temp = jsonData.main.temp;

    temp = formatTemp(temp);



    var humidity = jsonData.main.humidity;

    var windspeed = jsonData.wind.speed;

    var weatherIcon = jsonData.weather[0].icon;



    document.getElementById("city").innerHTML = city;

    document.getElementById("date").innerHTML = date;

    document.getElementById("weatherIcon").innerHTML = "<img src=\"https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png\">";

    document.getElementById("temp").innerHTML = "Temp: " + temp;

    document.getElementById("humidity").innerHTML = "Humidity: " + humidity + "%";

    document.getElementById("windSpeed").innerHTML = "WindSpeed: " + windspeed;

}



function drawWeatherTodayUV(jsonData) {

}







function formatTemp(temp) {

    return Math.floor((temp - 273.15) * 1.8 + 32)
}



function formatDate(date) {

    // https://stackoverflow.com/a/6273342

    if (!isNaN(date.getTime())) {

        var day = date.getDate().toString();

        var month = (date.getMonth() + 1).toString();

        return (month[1] ? month : '0' + month[0]) + '/' +

            (day[1] ? day : '0' + day[0]) + '/' +

            date.getFullYear();

    }

}

function searchHistoryGet() {
    var seachHistoryJSONString = localStorage.getItem("searchHistory");
    var searchHistoryJSON;
    if (seachHistoryJSONString == null) {
        searchHistoryJSON = [];
    } else {
        searchHistoryJSON = JSON.parse(seachHistoryJSONString);
    }
    return searchHistoryJSON;
}

function searchHistorySave(cityName) {
    var searchHistoryJSON = searchHistoryGet();
   
    searchHistoryJSON.push(cityName);
    searchHistoryJSON = [...new Set(searchHistoryJSON)];
    seachHistoryJSONString = JSON.stringify(searchHistoryJSON);
    localStorage.setItem("searchHistory",seachHistoryJSONString);
}

function searchHistoryClear() {
    var searchHistoryJSON = [];
    var seachHistoryJSONString = JSON.stringify(searchHistoryJSON);
    localStorage.setItem("searchHistory",seachHistoryJSONString);
    formatPage(null);
}


function searchHistoryDisplay() {
   var html = "";
   var searchHistoryJSON = searchHistoryGet();
    searchHistoryJSON.forEach(city => html = html + searchHistoryDisplayButton(city));
    
    document.getElementById("searches").innerHTML = html;
    
}
function searchHistoryDisplayButton(cityName) {
    var html = "<button class=`$class$` id=`$id$` onclick=`formatPage('$cityName$')`>"
    html = html.replaceAll("`", "\"");
    html = html.replaceAll("$class$", "city-button");
    html = html.replaceAll("$id$", "cityBtn" + cityName);
    html = html.replaceAll("$cityName$", cityName);
    html = html + cityName;
    html = html + "</button>";
   return html;
} 

function searchBtn() {
    var city = document.getElementById('cityInput').value;
    formatPage(city);
}

onload = function() {
    formatPage(null);
}






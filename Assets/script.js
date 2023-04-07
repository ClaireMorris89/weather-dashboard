//how to fix apiUrl to include key; lat/lon??
var apiKey = '0348ae74fb93f182b4bf00cbb8ce9878';
// var apiUrl='api.openweathermap.org/data/2.5/forecast?q='+inputVal+'&appid='+apiKey
// var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={0348ae74fb93f182b4bf00cbb8ce9878}';
//var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+inputVal+'&appid=0348ae74fb93f182b4bf00cbb8ce9878';
var currentWeather = document.getElementById('current-date');
var searchButton=document.querySelector('button');
var searchHistoryDiv=document.getElementById('search-history');
var aside = document.querySelector('aside');


 function getApi (inputVal){
    var apiUrl='https://api.openweathermap.org/data/2.5/forecast?q='+inputVal+'&appid='+apiKey + '&units=imperial'
     fetch(apiUrl)
         .then(function (response){
            console.log(response)
             return response.json();
     })
     .then(function(data){ 
        console.log(data);
        //first day has its own stuff in the current box
        var currentCityName=document.createElement('h3');
            var currentTemp=document.createElement('p');
            var currentWind=document.createElement('p');
            var currentHumidity=document.createElement('p');
            var currentIcon=document.createElement('img');
            var currentDayText=document.createElement('p');
            var currentDay = new Date(data.list[0].dt*1000);  
            currentDay = currentDay.toLocaleString("en-us",{weekday:"long"});
            currentDayText.textContent=currentDay;
            // console.log(currentDay)
            var currentIconUrl= 'https://openweathermap.org/img/w/'+ data.list[0].weather[0].icon + '.png';
            currentIcon.src= currentIconUrl;
            currentCityName.textContent = data.city.name
            currentTemp.textContent = 'Temp: ' + Math.trunc(data.list[0].main.temp) + '°F';
            currentWind.textContent='Wind: ' + Math.trunc(data.list[0].wind.speed*2.237) + ' MPH';
            currentHumidity.textContent='Humidity: ' + data.list[0].main.humidity + '%';

             $('#current-date').empty();

             currentWeather.appendChild(currentDayText);
             currentWeather.appendChild(currentIcon);
             currentWeather.appendChild(currentCityName);
             currentWeather.appendChild(currentTemp);
             currentWeather.appendChild(currentWind);
             currentWeather.appendChild(currentHumidity);

        // var secondApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+data.city.coord.lat+'&lon='+data.city.coord.lon+'&appid=0348ae74fb93f182b4bf00cbb8ce9878';
         
        // fetch(secondApiUrl).then(function(response){
        // return response.json()}).then(function(data){console.log(data)})
        $("#forecast").empty();

        for (var i=1; i<40; i+=8){
            //the cards 5-day forecast
           

            //for loop for the other 5 days, since you're doing the same thing for all of them
            var day = new Date(data.list[i].dt*1000);  
            day = day.toLocaleString("en-us",{weekday:"long"})
           
            var dayCard = document.createElement("div")
             var weatherIcon=document.createElement('img');
             var cityName=document.createElement('h3');
             var temp=document.createElement('p');
             var wind=document.createElement('p');
             var humidity=document.createElement('p');
             dayText=document.createElement('p');
             //?? is it called these in console?
             var iconUrl= 'https://openweathermap.org/img/w/'+ data.list[i].weather[0].icon + '.png';
            weatherIcon.src= iconUrl;
             cityName.textContent = data.city.name;
             temp.textContent = 'Temp: ' + Math.trunc(data.list[i].main.temp)+'°F';
             wind.textContent='Wind: ' + Math.trunc(data.list[i].wind.speed*2.237) + ' MPH';
             humidity.textContent='Humidity: ' + data.list[i].main.humidity +'%';
            dayText.textContent = day;
            dayCard.classList.add('five-day');
           
            

            dayCard.appendChild(dayText)
            dayCard.appendChild(weatherIcon)
            dayCard.appendChild(cityName)
            dayCard.appendChild(temp)
            dayCard.appendChild(wind)
            dayCard.appendChild(humidity)
           
            document.querySelector("#forecast").appendChild(dayCard);
         }
     });
     
     var searchHistory= JSON.parse(localStorage.getItem('search-history'))|| [];
     searchHistory.push(inputVal);
     localStorage.setItem('search-history', JSON.stringify(searchHistory));
     
     listSearchHistory();
     hello();
    };
    
    function listSearchHistory(){
        var searchHistory=JSON.parse(localStorage.getItem('search-history')) || [];
        $('#search-history').empty();

        for (i=0; i<searchHistory.length; i++){
            var historyBtn=document.createElement('button');
            historyBtn.classList.add('history-button');
            historyBtn.innerHTML=searchHistory[i];
            historyBtn.setAttribute('value',searchHistory[i]);
            console.log(historyBtn);
            searchHistoryDiv.append(historyBtn);
            // historyBtn.addEventListener('click', searchHistoryWeather());
        }};

listSearchHistory();
hello();
 
    


    
    
    






    


searchButton.addEventListener('click',function(){
    var inputVal=document.querySelector('#search').value.trim();
    getApi(inputVal)
    document.getElementById('search').value='';
}) ;


function hello(){
$('.history-button').on('click',function(event){
    var searchInputVal=$(this).val();
    console.log(searchInputVal);
    var searchUrl='https://api.openweathermap.org/data/2.5/forecast?q='+searchInputVal+'&appid='+apiKey + '&units=imperial'
    historyApi();

    function historyApi(){
    fetch(searchUrl)
         .then(function (response){
            console.log(response)
             return response.json();
     })
     .then(function(data){ 
        console.log(data);
        //first day has its own stuff in the current box
        var currentCityName=document.createElement('h3');
            var currentTemp=document.createElement('p');
            var currentWind=document.createElement('p');
            var currentHumidity=document.createElement('p');
            var currentIcon=document.createElement('img');
            var currentDayText=document.createElement('p');
            var currentDay = new Date(data.list[0].dt*1000);  
            currentDay = currentDay.toLocaleString("en-us",{weekday:"long"});
            currentDayText.textContent=currentDay;
            var currentIconUrl= 'https://openweathermap.org/img/w/'+ data.list[0].weather[0].icon + '.png';
            currentIcon.src= currentIconUrl;
            currentCityName.textContent = data.city.name
            currentTemp.textContent = 'Temp: ' + Math.trunc(data.list[0].main.temp) + '°F';
            currentWind.textContent='Wind: ' + Math.trunc(data.list[0].wind.speed*2.237) + ' MPH';
            currentHumidity.textContent='Humidity: ' + data.list[0].main.humidity + '%';

             $('#current-date').empty();

             currentWeather.appendChild(currentDayText);
             currentWeather.appendChild(currentIcon);
             currentWeather.appendChild(currentCityName);
             currentWeather.appendChild(currentTemp);
             currentWeather.appendChild(currentWind);
             currentWeather.appendChild(currentHumidity);

     
         
        $("#forecast").empty();

        for (var i=1; i<40; i+=8){

            var day = new Date(data.list[i].dt*1000);  
            day = day.toLocaleString("en-us",{weekday:"long"})
           
            var dayCard = document.createElement("div")
             var weatherIcon=document.createElement('img');
             var cityName=document.createElement('h3');
             var temp=document.createElement('p');
             var wind=document.createElement('p');
             var humidity=document.createElement('p');
             dayText=document.createElement('p');
             //?? is it called these in console?
             var iconUrl= 'https://openweathermap.org/img/w/'+ data.list[i].weather[0].icon + '.png';
            weatherIcon.src= iconUrl;
             cityName.textContent = data.city.name;
             temp.textContent = 'Temp: ' + Math.trunc(data.list[i].main.temp)+'°F';
             wind.textContent='Wind: ' + Math.trunc(data.list[i].wind.speed*2.237) + ' MPH';
             humidity.textContent='Humidity: ' + data.list[i].main.humidity +'%';
            dayText.textContent = day;
            dayCard.classList.add('five-day');
           
            

            dayCard.appendChild(dayText)
            dayCard.appendChild(weatherIcon)
            dayCard.appendChild(cityName)
            dayCard.appendChild(temp)
            dayCard.appendChild(wind)
            dayCard.appendChild(humidity)
           
            document.querySelector("#forecast").appendChild(dayCard);
         }
     });
}
})

}

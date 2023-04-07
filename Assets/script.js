var apiKey = '0348ae74fb93f182b4bf00cbb8ce9878';
var currentWeather = document.getElementById('current-date');
var searchButton=document.querySelector('button');
var searchHistoryDiv=document.getElementById('search-history');
var aside = document.querySelector('aside');

//function to run initial fetch based on what user inputs into search bar 
 function getApi (inputVal){
    //api using the value of the input form and passing that through as a parameter into the api
    var apiUrl='https://api.openweathermap.org/data/2.5/forecast?q='+inputVal+'&appid='+apiKey + '&units=imperial'
    //getting info from the api and returning it json into console log so I can sort through what I want
     fetch(apiUrl)
         .then(function (response){
            console.log(response)
             return response.json();
     })
     //this is my function to take the specific data i want, create elements for it, and append to my current weather div
     .then(function(data){ 
        console.log(data);
        //first day has its own data in the 'current' box
        //creating elements for each piece of data i want to pull
            var currentCityName=document.createElement('h3');
            var currentTemp=document.createElement('p');
            var currentWind=document.createElement('p');
            var currentHumidity=document.createElement('p');
            var currentIcon=document.createElement('img');
            var currentDayText=document.createElement('p');
            //taking the dt and turning it into a weekday word
            var currentDay = new Date(data.list[0].dt*1000);  
            currentDay = currentDay.toLocaleString("en-us",{weekday:"long"});
            currentDayText.textContent=currentDay;
            //getting the url for the icon and creating a variable for it
            var currentIconUrl= 'https://openweathermap.org/img/w/'+ data.list[0].weather[0].icon + '.png';
            currentIcon.src= currentIconUrl;
            //adding the text content to each variable based on the response data
            currentCityName.textContent = data.city.name
            currentTemp.textContent = 'Temp: ' + Math.trunc(data.list[0].main.temp) + '°F';
            currentWind.textContent='Wind: ' + Math.trunc(data.list[0].wind.speed*2.237) + ' MPH';
            currentHumidity.textContent='Humidity: ' + data.list[0].main.humidity + '%';
            //empty out anything that's currently in my current-weather div so it doesn't overlap if i search a new city without refreshing the page
             $('#current-date').empty();
            //appending each element to my current weather container
             currentWeather.appendChild(currentDayText);
             currentWeather.appendChild(currentIcon);
             currentWeather.appendChild(currentCityName);
             currentWeather.appendChild(currentTemp);
             currentWeather.appendChild(currentWind);
             currentWeather.appendChild(currentHumidity);

        //empy out anything that's currently in my 5-day-forecast div so it doesn't double up if i search a new city without refreshing the page
        $("#forecast").empty();
        //create a loop to run for each index of the next 5 days
        //was a 3-hour weather update so i had to go every 8 hours to get a new day
        for (var i=1; i<40; i+=8){
            //turning the dt data into the name of the day
            var day = new Date(data.list[i].dt*1000);  
            day = day.toLocaleString("en-us",{weekday:"long"})
           //creating a card for each day of the forecast
            var dayCard = document.createElement("div")
            //creating an element for each piece of data i'm pulling from the response
             var weatherIcon=document.createElement('img');
             var cityName=document.createElement('h3');
             var temp=document.createElement('p');
             var wind=document.createElement('p');
             var humidity=document.createElement('p');
             dayText=document.createElement('p');
             var iconUrl= 'https://openweathermap.org/img/w/'+ data.list[i].weather[0].icon + '.png';
            weatherIcon.src= iconUrl;
            //setting the text content of each element i created to equal the data from response
             cityName.textContent = data.city.name;
             temp.textContent = 'Temp: ' + Math.trunc(data.list[i].main.temp)+'°F';
             wind.textContent='Wind: ' + Math.trunc(data.list[i].wind.speed*2.237) + ' MPH';
             humidity.textContent='Humidity: ' + data.list[i].main.humidity +'%';
            dayText.textContent = day;
            //adding css class to the card for styling
            dayCard.classList.add('five-day');
           
            
            //apending each element/piece of data to the card
            dayCard.appendChild(dayText)
            dayCard.appendChild(weatherIcon)
            dayCard.appendChild(cityName)
            dayCard.appendChild(temp)
            dayCard.appendChild(wind)
            dayCard.appendChild(humidity)
           //grabbing my forecast div from html and appending the cards to it
            document.querySelector("#forecast").appendChild(dayCard);
         }
     });
     //taking whatever is in my search history local storage and parsing it so i can push to it; or grabbing the empty array if nothing is in it
     var searchHistory= JSON.parse(localStorage.getItem('search-history'))|| [];
     //pushing each input value searched into the search history variable in local storage
     searchHistory.push(inputVal);
     //resetting the local storage to include the new input variable and creating a new searchHistory string 
     localStorage.setItem('search-history', JSON.stringify(searchHistory));
     //calling my listSearchHistory function so each searched city shows up on the page
     
     listSearchHistory();
     //calling my function that allows users to click on the saved search city buttons and recall the weather for that city
     //if i didn't call it here, it only worked once i refreshed the page; not once a new city was searched and the getApi function started
     reSearch();
    };

    //created function loop to get whatever is in my search history local storage array, empty it(so that doubles aren't listed), and then create a button for each city searched
    function listSearchHistory(){
        var searchHistory=JSON.parse(localStorage.getItem('search-history')) || [];
        //empty whatever is already in my search history(otherwise it lists double)
        $('#search-history').empty();

        for (i=0; i<searchHistory.length; i++){
            //creates a button for each item in the search history
            var historyBtn=document.createElement('button');
            //added a class here so that I could call it globally
            historyBtn.classList.add('history-button');
            //set the innerHTML of the button to whatever index we're on in the search history
            historyBtn.innerHTML=searchHistory[i];
            //setting the value of the search history to be the input value that was originally saved (name of city) so that I can recall that parameter later
            historyBtn.setAttribute('value',searchHistory[i]);
            //append each button into my div so it shows on the page
            //append vs appendChild??
            searchHistoryDiv.append(historyBtn);
        }};

//ran both of these functions so they worked on page load rather than just when I searched a new city
listSearchHistory();
reSearch();



//upon click of the search button, run this function:
searchButton.addEventListener('click',function(){
    //set the inputVal to be the (trimmed so no space) value of whatever is in the search bar
    var inputVal=document.querySelector('#search').value.trim();
    //run the getApi function with the inputVal as the parameter
    getApi(inputVal)
    //clear the search bar once it's been clicked
    document.getElementById('search').value='';
}) ;

//this ALMOST replaces reSearch function below, but appends another searchHistoryBtn everytime i click on one
// function reSearch(){
//     $('.history-button').on('click',function(event){
//     var searchInputVal=$(this).val();
//    var inputVal=searchInputVal;
//    getApi(inputVal);

// })
// }


//wrapped by history-button click in a function to call in my getApi function as well as globally, otherwise it only worked on refresh
function reSearch(){
    //on the click of the button with this specific class(that i created in my getApi function), run this function
$('.history-button').on('click',function(event){
    //setting this variable to equal the VALUE of whatever SPECIFIC button i'm pressing
    var searchInputVal=$(this).val();
    console.log(searchInputVal);
    //taking the api url and re-running the fetch with the new searchInputVal parameter
    var searchUrl='https://api.openweathermap.org/data/2.5/forecast?q='+searchInputVal+'&appid='+apiKey + '&units=imperial'
//calling my original fetch get API function but with the new parameter from history buton
    historyApi();
//same function as getApi, but ends before local storage and creating new buttons
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

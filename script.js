const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector("[not-found-image]");


//functionalities
currentTab = userTab;
const API_KEY = "45eee5b09a27287732e69c10d72e0b8f";
currentTab.classList.add("current-tab");
getFromSessionStorage();

// function for tab switching
function switchTab(clickedTab)
{
    if(currentTab != clickedTab)
    {
        // logic
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        // if you are not in search tab and intent to go in there
        if(!searchForm.classList.contains("active"))
        {
           userInfoContainer.classList.remove("active");
           grantAccessContainer.classList.remove("active");
           searchForm.classList.add("active");
        }

        // else case - if you intenet to go into user tab
        else{
            userInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            // calling the function to check if local coordintates are available or not
            getFromSessionStorage();
        }
    }
}

// what happens if someone clicks on specific tab
userTab.addEventListener("click", () => 
{
    switchTab(userTab);
});

searchTab.addEventListener("click", () => 
{
    switchTab(searchTab);
});

// checking if coordinates are available in the session storage or not and then doing further processing
function getFromSessionStorage()
{
   const localCoordinates = sessionStorage.getItem("user-coordinates");

    // if coordinates are not available then showing grant location access screeen
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");

    }
    // else if available then doing the API call
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// fuction to make API call on the basis of coordinates
async function fetchUserWeatherInfo(coordinates)
{
    const {lat, lon} = coordinates;

    grantAccessContainer.classList.remove("active");
    // making loading screen visible
    loadingScreen.classList.add("active");

    // making API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        // making loading screen invisible since data has been fetched
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }

    catch(err){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFound.classList.add("active");
    }
}

// function to render weather information 
function renderWeatherInfo(weatherInfo)
{
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryIcon]");
   const desc = document.querySelector("[data-weatherDesc]");
   const weatherIcon = document.querySelector("[data-weatherIcon]");
   const temp = document.querySelector("[data-temp]");
   const windspeed = document.querySelector("[data-windspeed]");
   const humidity = document.querySelector("[data-humidity]");
   const cloudiness = document.querySelector("[data-cloudiness]");

//rendering on the UI
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}

// fetching grant access button and adding event listener
const grantAccessButton = document.querySelector("[data-grantAccess]");

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw to display that location access is not supported
    }
}

function showPosition(position)
{
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click", getLocation);

//API call and process for search weather

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(searchInput.value === "")
    {
        return;
    }
    fetchSearchWeatherInfo(searchInput.value)
    searchInput.value = "";
})

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    
    catch(err)
    {
       //hw to handle on own
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFound.classList.add("active");
    }
}
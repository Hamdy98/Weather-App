const box = document.querySelector(".box");
const inputPart = box.querySelector(".input-part");
const infoText = inputPart.querySelector(".info-text");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const weatherIcon = document.querySelector(".weather-part img");
const arrowBack = box.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
  // if user pressed enter btn and input value is not empty
  if(e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if(navigator.geolocation) { // if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser Not Support Geolocation api");
  }
});

function onSuccess(position) {
  const{latitude, longitude} = position.coords //Getting lat and lon of the user device from coords obj
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=385f1dd11af10a6945b3cb7a3c8f2fba`;
  fetchData();
}

function onError(error) {
  infoText.innerText = error.message;
  infoText.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=385f1dd11af10a6945b3cb7a3c8f2fba`;
  fetchData();
}

function fetchData() {
  infoText.innerText = "Getting Weather Details...";
  infoText.classList.add("panding");
  // getting api response and returning it with parsing into js obj and in another
  // then function calling weatherDetails function with passing api result as an argument
  fetch(api).then(response => response.json()).then(reslut => weatherDetails(reslut));
}

function weatherDetails(info) {
  if(info.cod == "404") {
    infoText.innerText = `${inputField.value} isn't a valid city name`;
    infoText.classList.replace("panding", "error");
  } else {
    // let's get required properties value from the info object
    const city = info.name;
    const country = info.sys.country;
    const {description, id} = info.weather[0];
    const {feels_like, humidity, temp} = info.main;

    // Change weather-icon debend on id-weather
    if(id == 800) {
      weatherIcon.src = "../Weather Icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "../Weather Icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "../Weather Icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = "../Weather Icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "../Weather Icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "../Weather Icons/rain.svg";
    }

    // let's pass these values to a particular html element
    box.querySelector(".temp .num").innerText = Math.floor(temp);
    box.querySelector(".weather").innerText = description;
    box.querySelector(".location span").innerText = `${city}, ${country}`;
    box.querySelector(".temp .num-2").innerText = Math.floor(feels_like);
    box.querySelector(".humidity span").innerText = `${humidity}%`;

    infoText.classList.remove("error", "panding");
    box.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  box.classList.remove("active");
})
"use strict"

const state = {
  temp: null,
  tempValue: null,
	landscape: null,
	cityName: null,
	cityNameInput: null,
	increaseTempButton: null,
	decreaseTempButton: null,
  currentTempButton: null,
  skySelect: null,
  sky: null,
  gardenContent: null,
  cityNameReset: null,
  tempFahrenheit: null,
  tempCelsius: null
}

/////////////////
// TEMPERATURE //
/////////////////

const increaseTemp = () => {
  calculateTempValue(1);
	setColorAndLandscape(state.temp);
};

const decreaseTemp = () => {
  calculateTempValue(-1);
	setColorAndLandscape(state.temp);
}

const calculateTempValue = (changeBy) => {
	state.tempValue = parseInt(state.temp.textContent);
  state.tempValue += changeBy;
	state.temp.textContent = `${state.tempValue}`;
}

const setColorAndLandscape = () => {
  if (state.tempValue >= 80) {
    state.temp.className = '${temp.className} red';
    state.landscape.textContent = "🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂";
  } else if ( state.tempValue >= 70) {
    state.temp.className = '${temp.className} yellow';
    state.landscape.textContent = "🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷";
  } else if (state.tempValue >= 60) {
    state.temp.className = '${temp.className} green';
    state.landscape.textContent = "🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃";
  } else if (state.tempValue >= 50) {
    state.temp.className = '${temp.className} teal';
    state.landscape.textContent = "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
  } else {
    state.temp.className = '${temp.className} blue';
    state.landscape.textContent = "❄️🪾☃️🏂❄️🪾🥶☃️🏂❄️🪾☃️🏂";
  }
};

const setCityName = () => {
  state.cityName.textContent = state.cityNameInput.value;
}

////////////
// Axios //
//////////

const LOCATION_URL = 'http://127.0.0.1:5000/location';
const findLatAndLon = (cityName) => {
  return axios
    .get(LOCATION_URL,
      {
          params: {
              q: cityName,
              format: 'json'
          }
      }
    )
    .then(response => {
        const { lat, lon } = response.data[0];
        // console.log({ lat, lon })
        return { lat, lon };
    })
    .catch(error => {
        console.log('Invalid city name');
    });
};
const WEATHER_URL = 'http://127.0.0.1:5000/weather';

const getTemperature = (latitude, longitud) => {
  return axios
    .get(WEATHER_URL,
        {
            params: {
                lon: longitud,
                lat: latitude,
            }
        }
    )
    .then (response => {
        console.log(response.data["main"]["temp"])
        console.log(response.data.main.temp)
        return response.data["main"]["temp"]
    })
    .catch(error => {
        console.log('Invalid coordinates');
    });
  }

const getCurrentTemp = () => {
  findLatAndLon(state.cityNameInput.value)
    .then (response => {
      return  getTemperature(response.lat, response.lon)
    })
    .then((tempCurrent) => {
      state.temp.textContent = convertKelvinToFahrenheit(tempCurrent);
      state.tempValue = parseInt(state.temp.textContent);
      setColorAndLandscape();
    })
    .catch (error => {
        console.log('Can not get current temperature')

    })

};

const convertKelvinToFahrenheit= (tempCurrent) => {
  const kelvinBase = 273.15;
  tempCurrent = Math.round((tempCurrent - kelvinBase) * 9 /5 +32);
  return tempCurrent
};

const convertTempFC = (fromUnit, toUnit, tempCurrent) => {
  let tempNew;
  if (fromUnit === 'F' && toUnit === 'C') {
    tempNew = Math.round((tempCurrent - 32) * 5 / 9);
  } else if (fromUnit === 'C' && toUnit === 'F') {
    tempNew = Math.round((tempCurrent * 9 / 5) + 32);
  }
  return tempNew
};

const getCurrentTempUnit = () => {
  return state.tempFahrenheit.classList.contains('selected') ? 'F' : 'C';
};

const toggleSelectedUnit = (selectedUnit, otherUnit) => {
  selectedUnit.classList.add('selected');
  otherUnit.classList.remove('selected');
};

const tempUnitSwitchHandler = (fromUnit, toUnit, fromClass, toClass) => {
  return () => {
    if (getCurrentTempUnit() === toUnit) return;

    const tempCurrent = parseInt(state.temp.textContent);
    const tempNew = convertTempFC(fromUnit, toUnit, tempCurrent);
    state.temp.textContent = `${tempNew}`;
    toggleSelectedUnit(toClass, fromClass);
  };
};

/////////
// SKY //
////////
const skyIcons = {
  Clear: '          ☀️           ',
  Clouds:'☁️ ☁️ ☁️ ☁️ 🌤 ☁️ ☁️ ☁️ ☁️',
  Rain: '🌧️ 🌧️ 🌧️ 🌧️ 🌦️ 🌧️ 🌧️ 🌧️ 🌧️',
  Thunderstorm: '⛈️ ⛈️ ⛈️ ⛈️ 🌦️ ⛈️ ⛈️ ⛈️ ⛈️',
  Snow: '🌨️ ❄️ 🌨️ ❄️ 🌨️ ❄️ 🌨️ ❄️ 🌨️',
  Fog: '🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️',
}

const setSky = () => {
  const selectedValue = skySelect.value;
  state.sky.textContent = skyIcons[selectedValue];
  state.gardenContent.classList.remove("skyClear", "skyRain", "skySnow", "skyClouds", "skyThunderstorm", "skyFog");
  state.gardenContent.classList.add('sky' + selectedValue);
}

//////////////
////City/////
//////////////
const resetCityName = () => {
  state.cityNameInput.defaultValue = 'Anchorage';
  state.cityNameInput.value = state.cityNameInput.defaultValue
  setCityName();
  getCurrentTemp();
  // state.cityName.textContent = state.cityNameInput.defaultValue;
  // state.cityNameInput.value = '';
  // setCityName();
  // state.cityName.textContent = '';

};

//////////////
// Controls //
/////////////

const registerEvents = () => {
  // Temperature event handlers
	state.increaseTempButton.addEventListener('click', increaseTemp);
	state.decreaseTempButton.addEventListener('click', decreaseTemp);
  // City name event handler
  state.cityNameInput.addEventListener('input', setCityName);
  state.currentTempButton.addEventListener('click', getCurrentTemp);
  state.skySelect.addEventListener('change', setSky);
  state.cityNameReset.addEventListener('click', resetCityName);
  state.tempFahrenheit.addEventListener('click', tempUnitSwitchHandler('C', 'F', state.tempCelsius, state.tempFahrenheit));
  state.tempCelsius.addEventListener('click', tempUnitSwitchHandler('F', 'C', state.tempFahrenheit, state.tempCelsius));
}

const loadControls = () => {
  state.temp = document.getElementById('tempValue');
	state.landscape = document.getElementById("landscape");
	state.cityName = document.getElementById("headerCityName");
	state.increaseTempButton = document.getElementById("increaseTempControl");
	state.decreaseTempButton = document.getElementById("decreaseTempControl");
	state.cityNameInput = document.querySelector("#cityNameInput");
  state.currentTempButton = document.querySelector("#currentTempButton");
  state.skySelect = document.getElementById("skySelect");
  state.sky = document.getElementById("sky");
  state.gardenContent = document.getElementById("gardenContent");
  state.cityNameReset = document.getElementById("cityNameReset");
  state.tempFahrenheit = document.querySelector(".tempFahrenheit");
  state.tempCelsius = document.querySelector(".tempCelsius");
}

const onLoaded = () => {
    // steps to carry out when the page has loaded
    loadControls();
    registerEvents();
    setCityName();
    getCurrentTemp();
};

onLoaded()

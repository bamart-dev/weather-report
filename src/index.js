"use strict"
// GLOBAL VARIABLES
// const TEMP_ICONS = {
//   hot: '🐍  🦂 🌵 🌵 🐍  🏜  🦂 🌵',
//   warm:'🌸🌿 🌼 🌷🌻🌿 ☘️🌱 🌻🌷 🌼',
//   mild:'🌾🌾 🍃 🪨  🛤 🌾🌾🌾 🍃 🌾',
//   cold:'🌲 🌲 🍂 🌲 🍁 🌲 🍂 🌲 🍂',
//   freeze: '☃️ 🏂 ❄️ 🥶 ☃️ ❄️ ☃️ 🏂 ❄️',
// };

const SKY_ICONS = {
  Clear: '          ☀️           ',
  Clouds:'☁️ ☁️ ☁️ ☁️ 🌤 ☁️ ☁️ ☁️ ☁️',
  Rain: '🌧️ 🌧️ 🌧️ 🌧️ 🌧️ 🌧️ 🌧️ 🌧️ 🌧️',
  Thunderstorm: '⛈️ ⛈️ ⛈️ ⛈️ ⛈️ ⛈️ ⛈️ ⛈️ ⛈️',
  Snow: '🌨️ ❄️ 🌨️ ❄️ 🌨️ ❄️ 🌨️ ❄️ 🌨️',
  Fog: '🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️🌫️',
};

const WEATHER_IDS = {
  'Clear': '800',
  'Clouds': '8',
  'Fog': '7',
  'Snow': '6',
  'Drizzle': '5',
  'Rain': '3',
  'Thunderstorm': '2'
};

const TEMP = {
  hot: {
    F: 80,
    C: 27,
    icon: '🐍  🦂 🌵 🌵 🐍  🏜  🦂 🌵'
  },
  warm: {
    F: 70,
    C: 21,
    icon: '🌸🌿 🌼 🌷🌻🌿 ☘️🌱 🌻🌷 🌼'
  },
  mild: {
    F: 60,
    C: 15,
    icon: '🌾🌾 🍃 🪨  🛤 🌾🌾🌾 🍃 🌾'
  },
  cold: {
    F: 50,
    C: 10,
    icon: '🌲 🌲 🍂 🌲 🍁 🌲 🍂 🌲 🍂'
  },
  freeze: {
    F: 40,
    C: 5,
    icon: '☃️ 🏂 ❄️ 🥶 ☃️ ❄️ ☃️ 🏂 ❄️'
  }
};

const state = {
  temp: null,
  tempValue: null,
  increaseTempButton: null,
  decreaseTempButton: null,
  currentTempButton: null,
  tempFahrenheit: null,
  tempCelsius: null,
  cityNameHeader: null,
  cityNameInput: null,
  cityNameReset: null,
  skySelect: null,
  sky: null,
  landscape: null,
  gardenContent: null
};

const WEATHER_URL = 'https://weather-report-proxy-server-p10d.onrender.com/weather';
const LOCATION_URL = 'https://weather-report-proxy-server-p10d.onrender.com/location';

/////////////////
// TEMPERATURE //
/////////////////
const getCurrentForecast = () => {
  findLatAndLon(state.cityNameInput.value)
    .then (response => {
      return  getForcast(response.lat, response.lon)
    })
    .then((weatherData) => {
      state.temp.textContent = convertKelvinToFahrenheit(weatherData[0]);
      state.tempValue = parseInt(state.temp.textContent);
      setColorAndLandscape();
      setSkyByCityLookup(weatherData[1]);
      toggleSelectedUnit(state.tempFahrenheit, state.tempCelsius);
    })
    .catch (error => {
        console.log('Can not get current temperature:', `(${error})`)
    })
};

const setColorAndLandscape = () => {
  if (state.tempValue >= TEMP.hot.F) {
    state.temp.className = '${temp.className} red';
    state.landscape.textContent = TEMP.hot.icon;
  } else if ( state.tempValue >= TEMP.warm.F) {
    state.temp.className = '${temp.className} yellow';
    state.landscape.textContent = TEMP.warm.icon;
  } else if (state.tempValue >= TEMP.mild.F) {
    state.temp.className = '${temp.className} green';
    state.landscape.textContent = TEMP.mild.icon;
  } else if (state.tempValue >=  TEMP.cold.F) {
    state.temp.className = '${temp.className} teal';
    state.landscape.textContent = TEMP.cold.icon;
  } else {
    state.temp.className = '${temp.className} blue';
    state.landscape.textContent = TEMP.freeze.icon;
  }
};

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

////////////////////////////////////
// TEMPERATURE CONVERSION & UNITS //
///////////////////////////////////
const convertKelvinToFahrenheit= (tempCurrent) => {
  const kelvinBase = 273.15;
  tempCurrent = Math.round((tempCurrent - kelvinBase) * 9 / 5 + 32);
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
const setSkyIconsAndBg = (value) => {
  state.sky.textContent = SKY_ICONS[value];
  state.gardenContent.className = `garden__content sky${value}`;
}

const setSkyByCityLookup = (weatherSkyData) => {
  let skyId = weatherSkyData.toString();

  if (skyId === WEATHER_IDS.Clear){
    state.skySelect.value = "Clear";
    setSkyIconsAndBg(state.skySelect.value)

  } else if (skyId.startsWith(WEATHER_IDS.Clouds)) {
    state.skySelect.value = "Clouds";
    setSkyIconsAndBg(state.skySelect.value)

  } else if (skyId.startsWith(WEATHER_IDS.Fog)) {
    state.skySelect.value = "Fog";
    setSkyIconsAndBg(state.skySelect.value)

  } else if (skyId.startsWith(WEATHER_IDS.Snow)) {
    state.skySelect.value = "Snow";
    setSkyIconsAndBg(state.skySelect.value)

  } else if (skyId.startsWith(WEATHER_IDS.Rain) || skyId.startsWith(WEATHER_IDS.Drizzle)) {
    state.skySelect.value = "Rain";
    setSkyIconsAndBg(state.skySelect.value)

  } else if (skyId.startsWith(WEATHER_IDS.Thunderstorm)) {
    state.skySelect.value = "Thunderstorm";
    setSkyIconsAndBg(state.skySelect.value)

  }
};

const setSkyByDropdownMenu = () => {
  setSkyIconsAndBg(state.skySelect.value)
}

/////////////
// HEADER //
///////////
const setHeader = () => {
  state.cityNameHeader.textContent = state.cityNameInput.value;
}

////////////////////
// RESET WEATHER //
//////////////////
const resetWeather = () => {
  state.cityNameInput.defaultValue = 'Anchorage';
  state.cityNameInput.value = state.cityNameInput.defaultValue
  setHeader();
  toggleSelectedUnit(state.tempFahrenheit, state.tempCelsius)
  getCurrentForecast();

};

///////////////////////////////////////////////////////////
// HTTP REQUESTS - Location and Weater API through Proxi //
///////////////////////////////////////////////////////////

const findLatAndLon = (cityName) => {
  return axios

    .get(LOCATION_URL, {params: {q: cityName, format: 'json'}})
    .then(response => {
        const { lat, lon } = response.data[0];
        return { lat, lon };
    })
    .catch(error => {
        console.log('Invalid city name:', `(${error})`);
    });
};

const getForcast = (latitude, longitud) => {
  return axios
    .get(WEATHER_URL, { params: { lon: longitud,lat: latitude } }
    )
    .then (response => {
        return [response.data.main.temp, response.data.weather[0].id]
    })
    .catch(error => {
        console.log('Invalid coordinates:', `(${error})`);
    });
  }


//////////////
// CONTROLS //
/////////////
const registerEvents = () => {
  // Temperature event handlers
  state.increaseTempButton.addEventListener('click', increaseTemp);
  state.decreaseTempButton.addEventListener('click', decreaseTemp);
  state.currentTempButton.addEventListener('click', getCurrentForecast);
  state.tempFahrenheit.addEventListener('click', tempUnitSwitchHandler('C', 'F', state.tempCelsius, state.tempFahrenheit));
  state.tempCelsius.addEventListener('click', tempUnitSwitchHandler('F', 'C', state.tempFahrenheit, state.tempCelsius));
  // Other event handlers
  state.cityNameInput.addEventListener('input', setHeader);
  state.skySelect.addEventListener('change', setSkyByDropdownMenu);
  state.cityNameReset.addEventListener('click', resetWeather);
}

const loadControls = () => {
  // Temperature Controls
  state.temp = document.getElementById('tempValue');
  state.increaseTempButton = document.getElementById("increaseTempControl");
  state.decreaseTempButton = document.getElementById("decreaseTempControl");
  state.currentTempButton = document.querySelector("#currentTempButton");
  state.tempFahrenheit = document.querySelector(".tempFahrenheit");
  state.tempCelsius = document.querySelector(".tempCelsius");
  // City Controls
  state.cityNameHeader = document.getElementById("headerCityName");
  state.cityNameInput = document.querySelector("#cityNameInput");
  state.cityNameReset = document.getElementById("cityNameReset");
  // Garden/Sky Controls
  state.skySelect = document.getElementById("skySelect");
  state.sky = document.getElementById("sky");
  state.landscape = document.getElementById("landscape");
  state.gardenContent = document.getElementById("gardenContent");

}

const onLoaded = () => {
  // steps to carry out when the page has loaded
  loadControls();
  registerEvents();
  setHeader();
  getCurrentForecast();
};

onLoaded() // called to set controls/defaults on page load

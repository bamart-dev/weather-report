"use strict"

const state = {
  temp: null,
  tempValue: null,
	landscape: null,
	increaseTempButton: null,
	decreaseTempButton: null,
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

const calculateTempValue = (x) => {
	state.tempValue = parseInt(state.temp.textContent);
  state.tempValue += x;
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

const registerTempEvents = () => {
	state.increaseTempButton.addEventListener('click', increaseTemp);
	state.decreaseTempButton.addEventListener('click', decreaseTemp);
}

//////////////
// Controls //
/////////////

const loadControls = () => {
	state.temp = document.getElementById('tempValue');
	state.landscape = document.getElementById("landscape");
	state.increaseTempButton = document.getElementById("increaseTempControl");
	state.decreaseTempButton = document.getElementById("decreaseTempControl");
}

const onLoaded = () => {
  // steps to carry out when the page has loaded
  loadControls();
  registerTempEvents();
};

onLoaded()

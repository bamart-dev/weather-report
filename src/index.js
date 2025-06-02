"use strict"

const increaseTemp = () => {
  const temp = document.getElementById("tempValue");
  let tempValue = temp.textContent;
  tempValue++;
  temp.textContent = `${tempValue}`;
  setColorAndLandscape(temp);
};

const decreaseTemp = () => {
  const temp = document.getElementById("tempValue");
  let tempValue = temp.textContent;
  tempValue--;
  temp.textContent = `${tempValue}`;
  setColorAndLandscape(temp);
}

const setColorAndLandscape = (temp) => {
  const landscape = document.getElementById("landscape");
  let tempValue = temp.textContent;
  if (tempValue >= 80) {
    temp.className = '${temp.className} red';
    landscape.textContent = "🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂";
  } else if (tempValue >= 70) {
    temp.className = '${temp.className} yellow';
    landscape.textContent = "🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷";
  } else if (tempValue >= 60) {
    temp.className = '${temp.className} green';
    landscape.textContent = "🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃";
  } else if (tempValue >= 50) {
    temp.className = '${temp.className} teal';
    landscape.textContent = "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
  } else {
    temp.className = '${temp.className} blue';
    landscape.textContent = "❄️🪾☃️🏂❄️🪾🥶☃️🏂❄️🪾☃️🏂";
  }
};

const increaseTempEventHandler = () => {
  const increaseButton = document.getElementById("increaseTempControl");
  increaseButton.addEventListener('click', increaseTemp);
};

const decreaseTempEventHandler = () => {
  const decreaseButton = document.getElementById("decreaseTempControl");
  decreaseButton.addEventListener('click', decreaseTemp);
};


document.addEventListener('DOMContentLoaded', () => {
  increaseTempEventHandler();
  decreaseTempEventHandler();
});
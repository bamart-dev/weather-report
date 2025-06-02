"use strict"

const increaseTemp = () => {
    const temp = document.getElementById("tempValue");
    let tempValue = temp.textContent;
    tempValue++;
    temp.textContent = `${tempValue}`;
    tempColor(temp);
};

const decreaseTemp = () => {
    const temp = document.getElementById("tempValue");
    let tempValue = temp.textContent;
    tempValue--;
    temp.textContent = `${tempValue}`;
    tempColor(temp);
}

const tempColor = (temp) => {
    let tempValue = temp.textContent;
    if (tempValue >= 80) {
        temp.className = '${temp.className} red';
    } else if (tempValue >= 70) {
        temp.className = '${temp.className} yellow';
    } else if (tempValue >= 60) {
        temp.className = '${temp.className} green';
    } else if (tempValue >= 50) {
        temp.className = '${temp.className} teal';
    } else {
        temp.className = '${temp.className} blue';
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
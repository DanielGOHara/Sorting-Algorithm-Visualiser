import React from 'react';
import './SortingStyles.css';
import Slider from './Slider';
import Speed from './Speed';
import { data } from './algorithmData'
import { getSortedAlgo } from "./SortingAlgorithms/sortingAlgorithms";
import { setSliderDisable } from "./Slider";
import { setSpeedDisable } from './Speed';

let arrayMax = 100, arrayMin = 20, tempMax = arrayMax, animationSpeed = 1, tempSpeed = animationSpeed, timeOutSpeed = 0;
let selectedAlgo = "InsertionSort";

export default class SortingVisualiser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      String: "",
      isDisabled: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  /* When the app is opened this is called */

  componentDidMount() {
    this.resetArray();
    this.timer();
    this.updateAlgo("InsertionSort")

    // eslint-disable-next-line
  }

  /* Resets the chart array with a set of new random values, also inserts one 100 value */

  resetArray() {
    const array = [];
    let index = randomInt(arrayMin, arrayMax)
    let count = 0;
    for(let i = 0; i < arrayMax; i++) {
      if(index === i) {
        array.push(100);
      } else {
        array.push(randomInt(5, 100));
      }
    }

    /* Checks to ensure at least one value is 100 */

    for(let i = 0; i < array.length; i++) {
      if(array[i] === 100) {
        count++;
      }
    }
    if(count === 0) {
      index = randomInt(0, array.length - 1);
      array[index] = 100;
    }
    this.setState({array});
  }

  /* Updates the selectedAlgo variable and the space complexity information */

  updateAlgo(newAlgo) {
    for(let i = 0; i < data.length; i++) {
      if(newAlgo === data[i].algorithm) {
        document.getElementById('worstPerf').innerHTML = data[i].worstPerformance;
        document.getElementById('bestPerf').innerHTML = data[i].bestPerformance;
        document.getElementById('averagePerf').innerHTML = data[i].averagePerformance;
        document.getElementById('worstSpace').innerHTML = data[i].worstSpaceComplex;
      }
    }
    selectedAlgo = newAlgo;
    this.setState({selectedAlgo});
  }

  /* Timer interval to consistently check in the updated value from the slider */

  timer() {
    setInterval(() => this.checkMax(), 5);
  }

  /* Compares arrayMax and tempMax, if they are different arrayMax is set to tempMax and resetArray is called */

  checkMax() {
    if(this.state.isDisabled === true) {
    } else {
      if (arrayMax !== tempMax) {
        arrayMax = tempMax;
        this.resetArray();
      }
      if (animationSpeed !== tempSpeed) {
        animationSpeed = tempSpeed;
      }
    }
    if(this.state.isDisabled === false) {
      setSliderDisable(false);
      setSpeedDisable(false);
    }
  }

  /* Sorts algorithm, checks if a sorted array is already on screen and resets it if that is the case */

  sort() {
    setSliderDisable(true);
    setSpeedDisable(true);
    this.resetArray();
    this.animateSorting(getSortedAlgo(selectedAlgo, this.state.array));
  }

  /* Disables all user control once the sort button is pressed and re-enables it after the array is sorted */

  onChange() {
    this.setState({isDisabled: true});
    setTimeout(() => {
      this.setState({isDisabled: false});
    }, timeOutSpeed);
  }

  /* Takes the animations array and creates the animation on screen depending on the selected algorithm */

  animateSorting(animations) {
    console.log(animations);
    const arrayBars = document.getElementsByClassName('array-bar');
    let auxiliaryArray = [];

    /* Animation for MergeSort */

    if (selectedAlgo === "MergeSort") {
      for (let i = 0; i < animations.length; i++) {
        const isColourChange = i % 3 !== 2;
        if (isColourChange) {
          const [barOne, barTwo] = animations[i];
          const barOneStyle = arrayBars[barOne].style;
          const barTwoStyle = arrayBars[barTwo].style;
          const colour = i % 3 === 0 ? 'red' : 'black';
          timeOutSpeed = timeOutSpeed + i * animationSpeed;
          setTimeout(() => {
            barOneStyle.backgroundColor = colour;
            barTwoStyle.backgroundColor = colour;
          }, i * animationSpeed);
        } else {
          setTimeout(() => {
            const [barOne, newHeight] = animations[i];
            const barOneStyle = arrayBars[barOne].style;
            barOneStyle.height = `${newHeight}%`;
          }, i * animationSpeed);
        }
        timeOutSpeed = i * animationSpeed;
      }

    /* Animation for QuickSort */

    } else if (selectedAlgo === "QuickSort") {
      for (let i = 0; i < animations.length; i++) {
        const [barOne, barTwo, string] = animations[i];
        if(animations[i].length > 3) {
          auxiliaryArray = animations[i];
        }
        if (string === "pivot") {
          const barOneStyle = arrayBars[barOne].style;
          setTimeout(() => {
            barOneStyle.backgroundColor = 'yellow';
            setTimeout(() => {
              barOneStyle.backgroundColor = 'black'
            }, i * animationSpeed / animations.length);
          }, i * animationSpeed);
        }
        if (string === "swap" || string === "pivot, right") {
          const valueOne = auxiliaryArray[barOne];
          const valueTwo = auxiliaryArray[barTwo];
          const barOneStyle = arrayBars[barOne].style;
          const barTwoStyle = arrayBars[barTwo].style;
          setTimeout(() => {
            barOneStyle.backgroundColor = 'red';
            barTwoStyle.backgroundColor = 'red';
            barOneStyle.height = `${valueTwo}%`;
            barTwoStyle.height = `${valueOne}%`;
            setTimeout(() => {
              barOneStyle.backgroundColor = 'black';
              barTwoStyle.backgroundColor = 'black';
            }, i * animationSpeed / animations.length);
          }, i * animationSpeed);
        }
        timeOutSpeed = i * animationSpeed;
      }

    /* Animation for HeapSort, BubbleSort and CocktailSort */

    } else if (selectedAlgo === "HeapSort" || selectedAlgo === "BubbleSort" || selectedAlgo === "CocktailSort") {
      for (let i = 0; i < animations.length; i++) {
        const [barOne, barTwo, string] = animations[i];
        if (animations[i].length > 3) {
          auxiliaryArray = animations[i];
        }
        if (string === "swap" || string === "0, end") {
          const valueOne = auxiliaryArray[barOne];
          const valueTwo = auxiliaryArray[barTwo];
          const barOneStyle = arrayBars[barOne].style;
          const barTwoStyle = arrayBars[barTwo].style;
          setTimeout(() => {
            barOneStyle.backgroundColor = 'red';
            barTwoStyle.backgroundColor = 'red';
            barOneStyle.height = `${valueTwo}%`;
            barTwoStyle.height = `${valueOne}%`;
            setTimeout(() => {
              barOneStyle.backgroundColor = 'black';
              barTwoStyle.backgroundColor = 'black';
            }, i * animationSpeed / animations.length);
          }, i * animationSpeed);
        }
        timeOutSpeed = i * animationSpeed;
      }

    /* Animation for InsertionSort */

    } else if (selectedAlgo === "InsertionSort") {
        for (let i = 0; i < animations.length; i++) {
          const [barOne, barTwo, string] = animations[i];
          if (animations[i].length > 3) {
            auxiliaryArray = animations[i];
          }
          try {
            if (string === "swap") {
              const valueTwo = auxiliaryArray[barTwo];
              const barOneStyle = arrayBars[barOne].style;
              setTimeout(() => {
                barOneStyle.backgroundColor = 'red';
                barOneStyle.height = `${valueTwo}%`;
                setTimeout(() => {
                  barOneStyle.backgroundColor = 'black';
                }, i * animationSpeed / animations.length);
              }, i * animationSpeed);
            }
            timeOutSpeed = i * animationSpeed;
          } catch {
            console.log("| Error | BarOne: " + barOne + " BarTwo: " + barTwo);
          }
        }
    }
  }

  render() {
    const {array} = this.state;

    /* Sets the width depending on the arrays length */

    const numWidth =
      array.length < 30 ? 2.55 :
        array.length < 40 ? 1.75 :
          array.length < 50 ? 1.34 :
            array.length < 75 ? 0.75 :
              array.length < 100 ? 0.51:
                array.length < 150 ? 0.37:
                  array.length < 176 ? 0.36 : 2;
    const width = `${numWidth}%`;

    /* Sets the margin depending on the arrays length */

    const numMargin =
      array.length < 30 ? 4.5 :
        array.length < 40 ? 4 :
          array.length < 50 ? 3.5 :
            array.length < 75 ? 3 :
              array.length < 100 ? 2.5:
                array.length < 150 ? 1.5:
                  array.length < 176 ? 1 : 2;
    const margin = `${numMargin}px`;

    /* Reveals the bars value depending on the arrays length */

    const color = array.length < 30 ? "white": "transparent";
    return (
      <>
        <header className = "headerContainer">
          <section className = "header">
            <label id = "title">Daniel's Sorting Algorithm Visualiser</label>
            <div className = "speed-container">
              <label id = "speed-title">Sort Speed:</label><p id = "speed-p"><label id = "speed-instructions">(1 - Fastest, 100 - Slowest)</label></p><Speed/>
            </div>
            <button disabled = {this.state.isDisabled} onClick = {() => {this.sort(); this.onChange()}} id = "sort-button">Sort</button>
            <label id = "selected-container">Currently Selected: <label id = "selected-algorithm">{selectedAlgo}</label></label>
            <button disabled = {this.state.isDisabled} onClick = {() => this.resetArray()} id = "new-array">Generate New Array</button>
            <div className = "slider-container">
              <label>ArraySize: </label>
              <Slider/>
            </div>
          </section>
        </header>
        <section className = "array-container">
          {array.map((value, idx) => (
            <div className = "array-bar" value = {value} key = {idx} style = {{height: `${value}%`, width: width, marginLeft: margin, marginRight: margin, color: color}}/>
          ))}
        </section>
        <footer className = "footer">
          <label id = "footer-title">Algorithms: </label>
          <p id = "footer-p">
            <button disabled = {this.state.isDisabled} onClick = {() => this.updateAlgo("MergeSort")} id = "mergeSort">Merge Sort</button>
            <button disabled = {this.state.isDisabled} onClick = {() => this.updateAlgo("QuickSort")} id = "quickSort">Quick Sort</button>
            <button disabled = {this.state.isDisabled} onClick = {() => this.updateAlgo("HeapSort")} id = "heapSort">Heap Sort</button>
            <button disabled = {this.state.isDisabled} onClick = {() => this.updateAlgo("BubbleSort")} id = "bubbleSort">Bubble Sort</button>
            <button disabled = {this.state.isDisabled} onClick = {() => this.updateAlgo("CocktailSort")} id = "cocktailSort">Cocktail Sort</button>
            <button disabled = {this.state.isDisabled} onClick = {() => this.updateAlgo("InsertionSort")} id = "insertionSort">Insertion Sort</button>
          </p>
          <label id = "spaceTimeTitle">Space Time Complexity: </label><br></br><br></br>
          <span className = "algorithmInfo">
            Worst Performance: <label id = "worstPerf"></label>
            | Best Performance: <label id = "bestPerf"></label><br></br>
            Average Performance: <label id = "averagePerf"></label>
            | Worse Space Complexity: <label id = "worstSpace"></label>
          </span>
        </footer>
        <label className = "project-details">Daniel O'Hara P2435725 De MontFort University Final Year Project 2021</label>
      </>
    );
  }
}

/* Returns a random integer */

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Compares the javascript sorted array to the algorithm sorted array */

// eslint-disable-next-line
function arraysAreEqual(sortedArray, stateArray) {
  if(sortedArray.length !== stateArray.length) {
    return false;
  } else {
    for(let i = 0; i < sortedArray.length; i++) {
      if(sortedArray[i] !== stateArray[i]) {
        return false;
      }
    }
  }
  return true;
}

/* Returns the arrayMax variable */

export function getArraySize() {
  return arrayMax;
}

/* Checks incoming variable is within the array size limits and applies it */

export function setArraySize(newValue) {
  if(newValue < arrayMin) {
    tempMax = arrayMin;
  } else if(newValue > 175) {
    tempMax = 175;
  } else {
    tempMax = newValue;
  }
}

/* Returns the animationSpeed variable */

export function getSpeed() {
  return animationSpeed;
}

/* Checks incoming variable is within the speed limits and applies it */

export function setSpeed(newValue) {
  if(newValue < 1) {
    tempSpeed = 1;
  } else if(newValue > 100) {
    tempSpeed = 100;
  } else {
    tempSpeed = newValue;
  }
}




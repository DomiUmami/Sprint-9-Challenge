import React, { useState } from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/result'

// Suggested initial states
const initialState = {
  message: '',
  email: '',
  steps: 0,
  currentIndex: 4 // the index the "B" is at
};

export default function AppFunctional(props) {
  const [state, setState] = useState(initialState);

  function getXYMessage() {
    const { currentIndex } = state;
    const x = (currentIndex % 3) + 1;
    const y = Math.floor(currentIndex / 3) + 1;
    return `Coordinates (${x}, ${y})`;
  }

  function move(direction) {
    const { currentIndex } = state;
    let nextIndex = currentIndex;
    let cantGoMessage = '';
  
    switch (direction) {
      case 'left':
        if (currentIndex % 3 === 0) {
          cantGoMessage = "You can't go left";
        } else {
          nextIndex = currentIndex - 1;
          setState(prevState => ({
            ...prevState,
            steps: prevState.steps + 1 // Update steps only when movement is possible
          }));
        }
        break;
      case 'right':
        if ((currentIndex + 1) % 3 === 0) {
          cantGoMessage = "You can't go right";
        } else {
          nextIndex = currentIndex + 1;
          setState(prevState => ({
            ...prevState,
            steps: prevState.steps + 1 // Update steps only when movement is possible
          }));
        }
        break;
      case 'up':
        if (currentIndex < 3) {
          cantGoMessage = "You can't go up";
        } else {
          nextIndex = currentIndex - 3;
          setState(prevState => ({
            ...prevState,
            steps: prevState.steps + 1 // Update steps only when movement is possible
          }));
        }
        break;
      case 'down':
        if (currentIndex > 5) {
          cantGoMessage = "You can't go down";
        } else {
          nextIndex = currentIndex + 3;
          setState(prevState => ({
            ...prevState,
            steps: prevState.steps + 1 // Update steps only when movement is possible
          }));
        }
        break;
      default:
        break;
    }
  
    if (nextIndex >= 0 && nextIndex <= 8) {
      setState(prevState => ({
        ...prevState,
        currentIndex: nextIndex,
        message: cantGoMessage ? cantGoMessage : '',
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        cantGoMessage
      }));
    }
  }
  

  function handleChange(evt) {
    const { id, value } = evt.target;
    setState(prevState => ({
      ...prevState,
      [id]: value
    }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const { email } = state;
  
    if (email.trim() === '') {
      setState(prevState => ({
        ...prevState,
        message: 'Ouch: email is required'
      }));
      return; // Exit early if email is empty
    }
  
    const { currentIndex } = state;
    const x = (currentIndex % 3) + 1;
    const y = Math.floor(currentIndex / 3) + 1;

    // Proceed with POST request using Axios
    axios.post(URL, { 
      email: state.email,
      steps: state.steps,
      x, // Include x coordinate
      y, // Include y coordinate
    })
      .then(response => {
        //debugger
        setState(prevState => ({
          ...prevState,
          message: response.data.message,
          email: ''
        }))
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || 'Ouch: email must be a valid email';
        setState(prevState => ({
          ...prevState,
          message: errorMessage
        }))
      })
  }

  function reset() {
    setState(initialState);
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {state.steps} {state.steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div key={idx} className={`square${idx === state.currentIndex ? ' active' : ''}`}>
            {idx === state.currentIndex ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>LEFT</button>
        <button id="up" onClick={() => move('up')}>UP</button>
        <button id="right" onClick={() => move('right')}>RIGHT</button>
        <button id="down" onClick={() => move('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input id="email" type="email" placeholder="type email" value={state.email} onChange={handleChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}


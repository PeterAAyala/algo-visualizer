import React from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import './buttons.css';
// import logo from './logo.svg';
// import './App.css';

function Square(props) {
  return (
    <button
      className={props.class}
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      {props.value}
    </button>
  )
}

class Buttons extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      setting: null,
    };
  }

  handleRadioSelect = (event) => {
    this.state.setting = event.target.value;
    console.log(this.state.setting);
  }

  render () {
    return (
    <div className ='radio-toolbar' onChange={this.handleRadioSelect} id = 'wall-select'>
      <input type='radio' id='addWall' name='radAnswer' value='addWall'/>
      <label htmlFor='addWall'>Add Wall</label>
    
      <input type='radio' id='removeWall' name='radAnswer' value='removeWall' />
      <label htmlFor='removeWall'>Remove Wall</label> 
    </div>
    
    )};
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    
    const initClassUpdate = Array(10).fill('square').map(x => Array(20).fill('square'));
    initClassUpdate[0][0] = 'square start';
    initClassUpdate[9][19] = 'square end';

    this.state = {
      value: null,
      grid: Array(10).fill(null).map(x => Array(20).fill(null)),
      classGrid: initClassUpdate,//Array(10).fill('square').map(x => Array(20).fill('square')),
      mouseDown: false,
      wallEdit: null,
      startBlock: [0,0],
      startFlag: false,
    };
  }
  
  // Event handler for mouse hold down 
  handleEvent = (i,j) => (event) => {
    /*if (this.state.startBlock === [i,j] && event.type === 'mousedown'){
      console.log("test");
      this.setState({
        mouseDown: true,
        startFlag: true,
      });
    } else */if (event.type === 'mousedown'){
      console.log("test2");
      const buttonSelection = document.querySelector('input[name="radAnswer"]:checked').value;
      this.setState({ 
        mouseDown: true, 
        wallEdit: buttonSelection,
      });
      console.log(buttonSelection);
    } else {
      console.log("test3");
      this.setState({ 
        mouseDown: false,
        startFlag: false,
      });
    }
  }
  

  renderSquare(i, j) {
    return (
      <Square 
        key = {i+j}
        class = {this.state.classGrid[i][j]}//'square'
        value = {this.state.grid[i][j]}
        onClick = {() => this.handleClick(i,j)}
        onMouseOver = {() => this.handleHover(i,j)}
        onMouseDown = {this.handleEvent(i,j)}
        onMouseUp = {this.handleEvent(i,j)}
      />
    )
  };

  handleHover (i, j){
    /*if (this.state.mouseDown && this.state.startFlag) {
      const prevStart = this.state.startBlock;
      const classUpdate = this.state.classGrid.slice();

      classUpdate[i][j] = 'square start';
      classUpdate[prevStart[0]][prevStart[1]] = 'square';
      this.setState({
        classGrid: classUpdate,
      });
      
    } else */if (this.state.mouseDown){

      const current = this.state.grid.slice();
      current[i][j] = (this.state.wallEdit === 'addWall') ? 'X' : null;
      const classUpdate = this.state.classGrid.slice();
      if (classUpdate[i][j].includes('start') || classUpdate[i][j].includes('end')) {
        {}
      } else {
        classUpdate[i][j] = (this.state.wallEdit === 'addWall') ? 'square wall' : 'square';
      }

      this.setState({
        grid: current,
        classGrid: classUpdate,
      });
    }
  }

  /*
  initBoard() {
    const initClassUpdate = this.state.classGrid.slice();
    initClassUpdate[0][0] = 'square wall';
    initClassUpdate[9][19] = 'square wall';
    this.setState({
      classGrid: initClassUpdate,
    })
  }
  */

  handleClick (i, j) {
    const current = this.state.grid.slice();
    current[i][j] = 'X';
    const classUpdate = this.state.classGrid.slice();
    classUpdate[i][j] = 'square wall';
    this.setState({
      grid: current,
      classGrid: classUpdate,
    });
  }

  render () {
    //console.log(this.handleEvent);
    //this.initBoard();
    const GRID_ROW_LENGTH = 10;
    const GRID_COL_LENGTH = 20; 
    const grid = [];

    for (let row = 0; row < GRID_ROW_LENGTH; row++){
      const currentRow = [];
      for (let col = 0; col < GRID_COL_LENGTH; col++){
        currentRow.push(this.renderSquare(row, col))
      }
      grid.push(currentRow)
    }

    return (
      <div>
        {grid.map((row, rowId) => {
          return (
            <div key={rowId} className='board-row'>
              {row.map((cell, cellId) => {
                return (cell);
              })}
            </div>
          )
        })}
      </div>
    )};
}


function App() {
  return (
    <Fragment> 
      <Buttons/>
      <Board/>
    </Fragment>
  );
}

export default App;

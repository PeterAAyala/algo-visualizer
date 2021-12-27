import React from 'react';
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

class Board extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      value: null,
      grid: Array(10).fill(null).map(x => Array(20).fill(null)),
      classGrid: Array(10).fill('square').map(x => Array(20).fill('square')),
      mouseDown: false,
    };
  }
  
  handleEvent = (event) => {
    if (event.type === 'mousedown'){
      this.setState({ mouseDown: true });
      //console.log("test");
    } else {
      this.setState({ mouseDown: false });
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
        onMouseDown = {this.handleEvent}
        onMouseUp = {this.handleEvent}
      />
    )
  };

  handleHover (i, j){
    if (this.state.mouseDown){
      const current = this.state.grid.slice();
      current[i][j] = (current[i][j] === 'X') ? null : 'X';
      const classUpdate = this.state.classGrid.slice();
      classUpdate[i][j] = (classUpdate[i][j] === 'square wall') ? 'square' : 'square wall';
      this.setState({
        grid: current,
        classGrid: classUpdate,
      });
    }
  }

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
    //console.log(grid);
    //console.log(this.state.grid);
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
    <Board/>
  );
}

export default App;

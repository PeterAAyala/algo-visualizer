import React from 'react';
// import logo from './logo.svg';
// import './App.css';

function Square(props) {
  return (
    <button
      className={props.class}
      onClick={props.onClick}
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
    };
  }
  
  renderSquare(i, j) {
    return (
      <Square 
        key = {i+j}
        class = {this.state.classGrid[i][j]}//'square'
        value = {this.state.grid[i][j]}
        onClick = {() => this.handleClick(i,j)}/>
    )
  };

  handleClick (i, j) {
    const current = this.state.grid.slice();
    current[i][j] = 'X';
    const classUpdate = this.state.classGrid.slice();
    classUpdate[i][j] = 'square wall'
    this.setState({
      grid: current,
      classGrid: classUpdate,
    });
  }

  render () {
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

    /*
    const items = [];
    for (const [index, value] of this.state.squares.entries()) {
      items.push({renderSquare(index)})
    }

    return (
      <div>
        {items}
      </div>
    )
    
    for (let i = 0; i < 3; i++){
      <div className='board-row'>
        for (let j = 0; j < 3; j++){}
      </div>
    }
    


    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )};*/
}


function App() {
  return (
    <Board/>
  );
}

export default App;

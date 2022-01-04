import { selectOptions } from '@testing-library/user-event/dist/select-options';
import React from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import './buttons.css';

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

function SolveButton(props) {
  return (
    <button
      className={props.class}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


// return the 
function checkNeighbors(matrix, cell){
  // Matrix: Board.state.grid, with Array of Arrays type
  // Cell: [row, col] within Matrix
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const neighbors = [];

  // Check cell to the top 
  if (cell[0] == 0){
    {}
  } else {
    if (matrix[cell[0] - 1][cell[1]] != 1){
      const resultingKey = (cell[0]-1)*numCols + cell[1];
      neighbors.push(resultingKey);
    } 
  }

  // Check cell to the left
  if (cell[1] == 0){
    {}
  } else {
    if (matrix[cell[0]][cell[1] - 1] != 1){
      const resultingKey = (cell[0])*numCols + (cell[1]-1);
      neighbors.push(resultingKey);
    }
  }

  // Check cell to the bottom
  if (cell[0] == numRows - 1){
    {}
  } else {
    if (matrix[cell[0] + 1][cell[1]] != 1) {
      const resultingKey = (cell[0]+1)*numCols + cell[1];
      neighbors.push(resultingKey);
    }
  }

  // Check cell to the right
  if (cell[1] == numCols - 1){
    {}
  } else {
    if (matrix[cell[0]][cell[1] + 1] != 1){
      const resultingKey = (cell[0])*numCols + (cell[1]+1);
      neighbors.push(resultingKey);
    }
  }

  return neighbors;
}

// Take in the grid board, create a dict of which 
function createGraph(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  var result = {};
  
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++){
      const resultingKey = i*numCols+j;
      result[resultingKey] = {
        neighbors: checkNeighbors(matrix, [i,j]),
        location: [i,j]
      };
    }
  }
  return result;
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
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
    const gridInit = Array(10).fill(null).map(x => Array(20).fill(null));
    gridInit[0][0] = 2;
    gridInit[9][19] = 3;

    this.state = {
      value: null,
      grid: gridInit,
      classGrid: initClassUpdate,
      mouseDown: false,
      wallEdit: null,
      startBlock: [0,0],
      startFlag: false,
      endBlock: [9, 19],
      endFlag: false,
      finalPath: null,
    };
  }
  
  // Event handler for mouse hold down 
  handleEvent = (i,j) => (event) => {
    if (arrayEquals([i,j], this.state.startBlock) && event.type === 'mousedown'){
      this.setState({
        mouseDown: true,
        startFlag: true,
      });
    } else if (arrayEquals([i,j], this.state.endBlock) && event.type === 'mousedown'){
      this.setState({
        mouseDown: true,
        endFlag: true,
      });
    } else if (event.type === 'mousedown'){
      const buttonSelection = document.querySelector('input[name="radAnswer"]:checked').value;
      this.setState({ 
        mouseDown: true, 
        wallEdit: buttonSelection,
      });
      console.log(buttonSelection);
    } else {
      this.setState({ 
        mouseDown: false,
        startFlag: false,
        endFlag: false,
      });
    }
  }
  

  renderSquare(i, j, len) {
    return (
      <Square 
        key = {i*len+j}
        class = {this.state.classGrid[i][j]}//'square'
        value = {this.state.grid[i][j]}
        onClick = {() => this.handleClick(i,j)}
        onMouseOver = {() => this.handleHover(i,j)}
        onMouseDown = {this.handleEvent(i,j)}
        onMouseUp = {this.handleEvent(i,j)}
      />
    )
  };

  updateRender(coord, classDesc){
    const classUpdate = this.state.classGrid.slice();
    if (!(classUpdate[coord[0]][coord[1]].includes('start') || classUpdate[coord[0]][coord[1]].includes('end'))){
      classUpdate[coord[0]][coord[1]] = 'square ' + classDesc;
    }
    this.setState((state) => {
      return {classGrid: classUpdate};
    });
  }

  parentChainReturn (chain, start, end) {
    var startFlag = false;
    var node = end;
    var result = [node];

    while (!(startFlag)) {
      const parent = chain[node];
      result.push(parent);
      node = parent;
      if (node == start) startFlag = true; 
    }
    console.log(result);
    const len = result.length;
    if (len == 2) return [];
    return result.slice(1,len-1);
  }

  renderFinalPath2 = () => {
    const path = this.state.finalPath;
    const matrixGrid = createGraph(this.state.grid);

    const loopy = () => {
      if (path.length!=0){
        var q = path.shift();
        console.log(q);
        const loc = matrixGrid[q]['location'];
        this.updateRender(loc, 'result');
      }
      if(path.length!=0) { 
        setTimeout(loopy, 100);
      }
    }
    loopy();

  }
  /*
  renderFinalPath = (path, matrixGrid, classDesc) => {
    //var go = true;
    //var temp = path;
    if (path.length!=0){
      var q = path.shift();
      console.log(q);
      const loc = matrixGrid[q]['location'];
      this.updateRender(loc, classDesc);
    }
    if(path.length!=0) { 
      //sleep(1000);
      setTimeout(this.renderFinalPath(path, matrixGrid, classDesc), 0);
    }
  }*/

  solveAlgo () {
    const Start = this.state.startBlock[0]*20 +this.state.startBlock[1] ;
    const End = this.state.endBlock[0]*20+this.state.endBlock[1];
    var queue = [];
    var visited = Array(200).fill(false);
    var parentChain = Array(200).fill(null);
    const matrixGrid = createGraph(this.state.grid);
    var go = true;

    console.log(matrixGrid);
    //console.log(End);
    queue.push(Start);
    visited[Start] = true;



    const loop = () => {
      if (queue.length!=0 && go){ 
        var s = queue.shift();
        for (let i = 0; i < matrixGrid[s]['neighbors'].length; i++) {
          const element = matrixGrid[s]['neighbors'][i];
          const coord = matrixGrid[element]['location'];
          if (element == End) go = false;
          if (!(visited[element])) {
            parentChain[element] = s;
            queue.push(element);
            visited[element] = true;
            console.log(queue);
            console.log(parentChain);
            this.updateRender(coord, 'searched');

          }
        }
      }
      if(queue.length!=0 && go) { 
        setTimeout(loop, 100);
      } else {
        //console.log('done');
        const finalPath = this.parentChainReturn(parentChain, Start, End);
        this.setState({
          finalPath: finalPath,
        });
        //setTimeout(this.renderFinalPath(finalPath, matrixGrid, 'result'), 10000);
        this.renderFinalPath2();
        //console.log(this.parentChainReturn(parentChain, Start, End));
      }
    }
    loop();
  
    //console.log(this.parentChainReturn(parentChain, Start, End));
    // console.log(visited);
  }

  renderSolve() {
    return (
      <SolveButton
        key={'solve'}
        class={'null'}
        onClick={() => this.solveAlgo()}
      />
    )
  }

  handleHover (i, j){
    if (this.state.mouseDown && this.state.startFlag) {
      const prevStart = this.state.startBlock;
      const classUpdate = this.state.classGrid.slice();

      classUpdate[i][j] = 'square start';
      classUpdate[prevStart[0]][prevStart[1]] = 'square';
      this.setState({
        classGrid: classUpdate,
        startBlock: [i,j],
      });
      
    } else if (this.state.mouseDown && this.state.endFlag){
      const prevEnd = this.state.endBlock;
      const classUpdate = this.state.classGrid.slice();

      classUpdate[i][j] = 'square end';
      classUpdate[prevEnd[0]][prevEnd[1]] = 'square';
      this.setState({
        classGrid: classUpdate,
        endBlock: [i,j],
      });
    } else if (this.state.mouseDown){

      const current = this.state.grid.slice();
      current[i][j] = (this.state.wallEdit === 'addWall') ? 1 : null;
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

  handleClick (i, j) {
    const current = this.state.grid.slice();
    current[i][j] = 'X';
    const classUpdate = this.state.classGrid.slice();
    classUpdate[i][j] = 'square wall';
    console.log(createGraph(this.state.grid));
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
        currentRow.push(this.renderSquare(row, col, GRID_COL_LENGTH))
      }
      grid.push(currentRow)
    }

    return (

      <div>
        {this.renderSolve()}
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

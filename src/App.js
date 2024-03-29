import { selectOptions } from '@testing-library/user-event/dist/select-options';
import React from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import { createGraph, arrayEquals, parentChainReturn } from './supportFunctions.js';
import { divideGrid } from './mazes.js';
import { recursiveDivisionMaze } from './mazes.js';
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

/*

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
*/
class Board extends React.Component {
  constructor(props) {
    super(props);
    
    var w = window.innerWidth;
    var h = window.innerHeight;
    const numRows = Math.floor(h * 0.70 / 28);
    const numCols = Math.floor(w * 1.00 / 28);
    const splitRows = Math.floor(numRows/2);
    const splitCols = Math.floor(numCols/4);
    const splitColsEnd = splitCols * 3
    const initClassUpdate = Array(numRows).fill('square').map(x => Array(numCols).fill('square'));
    initClassUpdate[splitRows][splitCols] = 'square start';
    initClassUpdate[splitRows][splitColsEnd] = 'square end';
    const gridInit = Array(numRows).fill(null).map(x => Array(numCols).fill(null));
    const weightsInit = Array(numRows).fill(1).map(x => Array(numCols).fill(1));
    gridInit[splitRows][splitCols] = 2;
    gridInit[splitRows][splitColsEnd] = 3;

    this.state = {
      value: null,
      grid: gridInit,
      classGrid: initClassUpdate,
      weightsGrid: weightsInit,
      mouseDown: false,
      wallEdit: null,
      startBlock: [splitRows,splitCols],
      startFlag: false,
      endBlock: [splitRows,splitColsEnd],
      endFlag: false,
      finalPath: null,
      windowWidth: w,
      windowHeight: h,
      numRows: numRows,
      numCols: numCols,
    };
  }
  
  // Topmost navigation bar of the website with the dropdown menus 
  renderNavBar() {
    return (
      <div>
        <ul>
          <li className='dropdown'>
            <a className='dropbtn'>Algorithms &or;</a>
            <div className = 'dropdown-content'>
              <a onClick={() => this.solveAlgo(true)}>Breadth-First-Search</a> 
              <a onClick={() => this.solveAlgo(false)}>Depth-First-Search</a>
            </div>
          </li>
          <li className='dropdown'>
            <a className='dropbtn'>Mazes and Patterns &or; </a>
            <div className='dropdown-content'>
              <a onClick={() => this.generateRandomMaze()}>Simple Random Maze</a> 
              <a onClick={() => this.generateStairwayMaze()}>Simple Stair Pattern</a> 
              <a onClick={() => this.generateRecursiveMaze()}>Recursive Maze</a>
            </div>

          </li>
          <li><a onClick={() => this.clearBoard(false)}>Clear Walls</a></li>
          <li><a onClick={() => this.clearBoard(true)}>Clear Board</a></li>
          <li onClick={() => this.solveAlgo(true)}><a>Visualize!</a></li>
        </ul>
      </div>
    )
  }
  
  

  // Event handler for mouse hold down .
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
      //const buttonSelection = document.querySelector('input[name="radAnswer"]:checked').value;
      this.setState({ 
        mouseDown: true, 
        //wallEdit: buttonSelection,
      });
      
    } else {
      this.setState({ 
        mouseDown: false,
        startFlag: false,
        endFlag: false,
      });
    }
  }
  
  clearBoard (wallFlag) {
    const classUpdate = this.state.classGrid.slice();
    const grid = this.state.grid.slice();
    for (let i = 0; i < classUpdate.length; i++) {
      for (let j = 0; j < classUpdate[0].length; j++) {
        if (classUpdate[i][j].includes('result') || classUpdate[i][j].includes('searched')){
          classUpdate[i][j] = 'square';
        }
        if (classUpdate[i][j].includes('wall') && wallFlag){
          classUpdate[i][j] = 'square';
          grid[i][j] = null;
        }
      }
    }
    this.setState({
      classGrid: classUpdate,
      grid: grid,
    });
  }

  renderSquare(i, j, len) {
    return (
      <Square 
        key = {i*len+j}
        class = {this.state.classGrid[i][j]}
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
    var cellClass = classUpdate[coord[0]][coord[1]];

    if (!(cellClass.includes('start') || cellClass.includes('end'))){
      classUpdate[coord[0]][coord[1]] = 'square ' + classDesc;
    }
    this.setState((state) => {
      return {classGrid: classUpdate};
    });
  }

  renderFinalPath = (path, matrixGrid) => {
    const loopy = () => {
      if (path.length!=0){
        var q = path.shift();
        console.log(q);
        const loc = matrixGrid[q]['location'];
        this.updateRender(loc, 'result');
      }
      if(path.length!=0) { 
        setTimeout(loopy, 10);
      }
    }
    loopy();
  }

  // If True, do BFS. Otherwise, DFS.
  bFS_DFS (BFS) {
    
    const numRows = this.state.numRows;
    const numCols = this.state.numCols;
    const numCells = numRows * this.state.numCols;
    const Start = this.state.startBlock[0] * numCols +this.state.startBlock[1];
    const End = this.state.endBlock[0] * numCols+this.state.endBlock[1];
    
    var queue = [];
    var visited = Array(numCells).fill(false);
    var inQueue = Array(numCells).fill(false);
    var parentChain = Array(numCells).fill(null);
    const matrixGrid = createGraph(this.state.grid);
    var go = true;
    
    queue.push(Start);
    visited[Start] = true;

    const loop = () => {
      if (queue.length!=0 && go){
        
        /*
        if (BFS) {
          var s = queue.shift();
        } else {
          var s = queue.pop();
        } 

        visited[s] = true;
        if (s == End) go = false;
        for (let i = 0; i < matrixGrid[s]['neighbors'].length; i++) {
          const neighbor = matrixGrid[s]['neighbors'][i];
          //if (neighbor == End) go = false;
          if (!(inQueue[neighbor])) {
            parentChain[neighbor] = s;
            queue.push(neighbor);
            inQueue[neighbor] = true;
          } 
        }
        //console.log(queue.length);
        const coord = matrixGrid[s]['location'];
        this.updateRender(coord, 'searched');
        */
        
        if (BFS){
          var s = queue.shift();
          for (let i = 0; i < matrixGrid[s]['neighbors'].length; i++) {
            const element = matrixGrid[s]['neighbors'][i];
            const coord = matrixGrid[element]['location'];
            if (element == End) go = false;
            if (!(visited[element])) {
              parentChain[element] = s;
              queue.push(element);
              visited[element] = true;
              this.updateRender(coord, 'searched');
  
            }
          }
        } 

        else {
          var s = queue.pop();
          visited[s] = true;
          if (s == End) go = false;
          for (let i = 0; i < matrixGrid[s]['neighbors'].length; i++) {
            const neighbor = matrixGrid[s]['neighbors'][i];
            //if (neighbor == End) go = false;
            if (!(visited[neighbor])) {
              parentChain[neighbor] = s;
              queue.push(neighbor);
              //inQueue[neighbor] = true;
            } 
          }
          //console.log(queue.length);
          const coord = matrixGrid[s]['location'];
          this.updateRender(coord, 'searched');
        }

         

          /*
            const element = matrixGrid[s]['neighbors'][i];
            const coord = matrixGrid[element]['location'];
            if (element == End) go = false;
            if (!(visited[element])) {
              parentChain[element] = s;
              queue.push(element);
              visited[element] = true;
              this.updateRender(coord, 'searched');
  
            }
          }
          */
        
        
        
      }
      if (go) { 
        setTimeout(loop, 0);
      } else if (queue.length == 0){
        console.log(queue);
        console.log('Not solvable');
      } else {
        console.log(queue);
        const finalPath = parentChainReturn(parentChain, Start, End);
        this.setState({
          finalPath: finalPath,
        });
        this.renderFinalPath(this.state.finalPath, matrixGrid)
      }
    }
    loop();

  }


  // Support function which generates a random maze with each square having 
  // 30% chance of being a wall
  generateRandomMaze () {
    this.clearBoard(true);
    const classUpdate = this.state.classGrid.slice();
    const grid = this.state.grid.slice();
    const prob = 0.3;

    for (let i = 0; i < classUpdate.length; i++){
      for (let j = 0; j < classUpdate[0].length; j++){
        let randomNumber = Math.random();
        if (randomNumber <= prob && grid[i][j] < 2){
          classUpdate[i][j] = 'square wall';
          grid[i][j] = 1
        };
      }
    }
    this.setState({
      classGrid: classUpdate,
      grid: grid,
    });
  }

  // Generates a maze that looks similar to a stairway.
  generateStairwayMaze () {
    this.clearBoard(true);
    const classUpdate = this.state.classGrid.slice();
    const grid = this.state.grid.slice();
    let rowToPopulate = classUpdate.length - 1;
    let upwardFlag = true;
    
    for (let j = 0; j < classUpdate[0].length; j++){
      if (grid[rowToPopulate][j] < 2 && rowToPopulate != classUpdate.length - 1){
        classUpdate[rowToPopulate][j] = 'square wall';
        grid[rowToPopulate][j] = 1;
      }  
      // Determine whether to move up or down for stairway.
      // Also determine direction of way stairway is traveling.
      upwardFlag ? rowToPopulate-- : rowToPopulate++;
      if (rowToPopulate == classUpdate.length - 1 || rowToPopulate == 0){
        upwardFlag = !(upwardFlag)
      }
    }

    this.setState({
      classGrid: classUpdate,
      grid: grid,
    });

  }

  generateRecursiveMaze () {
    this.clearBoard(true);
    const newGrid = this.state.grid.slice();
    const classUpdate = this.state.classGrid.slice();
    const newWalls = recursiveDivisionMaze(newGrid, this.state.startBlock,this.state.endBlock);
    console.log(newWalls);
    for (let i = 0; i < newWalls.length; i++){
      
      let wx = newWalls[i][0];
      let wy = newWalls[i][1];
      console.log(wx,wy);
      
      newGrid[wx][wy] = 1;
      classUpdate[wx][wy] = 'square wall';
    }
    //const newGrid = divideGrid(grid, 0, 0, grid[0].length, grid.length);
    //console.log(newGrid);
    //const newGrid2 = recursiveDivisionMaze(grid, false,false);
    //console.log(newGrid2);
    
    this.setState({
      grid: newGrid,
      classGrid: classUpdate,
    });

  }

  solveAlgo (BFS_flag) {
    this.clearBoard(false);
    this.bFS_DFS(BFS_flag);
    /*
    const numRows = this.state.numRows;
    const numCols = this.state.numCols;
    const numCells = numRows * this.state.numCols;
    const Start = this.state.startBlock[0] * numCols +this.state.startBlock[1];
    const End = this.state.endBlock[0] * numCols+this.state.endBlock[1];
    
    var queue = [];
    var visited = Array(numCells).fill(false);
    var parentChain = Array(numCells).fill(null);
    const matrixGrid = createGraph(this.state.grid);
    var go = true;
    
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
            this.updateRender(coord, 'searched');

          }
        }
      }
      if (go) { 
        setTimeout(loop, 0);
      } else if (queue.length == 0){
        console.log(queue);
        console.log('Not solvable');
      } else {
        console.log(queue);
        const finalPath = parentChainReturn(parentChain, Start, End);
        this.setState({
          finalPath: finalPath,
        });
        this.renderFinalPath(this.state.finalPath, matrixGrid)
      }
    }
    loop();
    */
  }

  /*
  renderSolve() {
    return (
      <SolveButton
        key={'solve'}
        class={'null'}
        onClick={() => this.solveAlgo()}
      />
    )
  }
*/

  handleHover (i, j){
    const prevStart = this.state.startBlock;
    const classUpdate = this.state.classGrid.slice();
    if (this.state.mouseDown && this.state.startFlag) {
      const prevStart = this.state.startBlock;
      this.clearBoard(false);

      classUpdate[i][j] = 'square start';
      classUpdate[prevStart[0]][prevStart[1]] = 'square';
      this.setState({
        classGrid: classUpdate,
        startBlock: [i,j],
      });
      
    } else if (this.state.mouseDown && this.state.endFlag){
      const prevEnd = this.state.endBlock;
      this.clearBoard(false);

      classUpdate[i][j] = 'square end';
      classUpdate[prevEnd[0]][prevEnd[1]] = 'square';
      this.setState({
        classGrid: classUpdate,
        endBlock: [i,j],
      });
    } else if (this.state.mouseDown){

      const current = this.state.grid.slice();
      current[i][j] = (current[i][j] == 1) ? null : 1;
      const weights = this.state.weightsGrid.slice();
      //weights[i][j]
      //current[i][j] = (this.state.wallEdit === 'addWall') ? 1 : null;

      if (classUpdate[i][j].includes('start') || classUpdate[i][j].includes('end')) {
        {}
      } else {
        classUpdate[i][j] = (classUpdate[i][j].includes('wall')) ? 'square' : 'square wall';
      }
      /*  Keeping for now - to us if I create a toggle Add / Remove 
      if (classUpdate[i][j].includes('start') || classUpdate[i][j].includes('end')) {
        {}
      } else {
        classUpdate[i][j] = (this.state.wallEdit === 'addWall') ? 'square wall' : 'square';
      }
      */

      this.setState({
        grid: current,
        classGrid: classUpdate,
      });
    }
  }

  handleClick (i, j) {
    const current = this.state.grid.slice();
    const classUpdate = this.state.classGrid.slice();

    if (classUpdate[i][j].includes('start') || classUpdate[i][j].includes('end')) {
      {}
    } else {
      classUpdate[i][j] = (classUpdate[i][j].includes('wall')) ? 'square' : 'square wall';
      current[i][j] = (current[i][j] == 1) ? null : 1;
    }
    console.log(createGraph(this.state.grid));
    this.setState({
      grid: current,
      classGrid: classUpdate,
    });
  }

  render () {
    
    const GRID_ROW_LENGTH = this.state.numRows;
    const GRID_COL_LENGTH = this.state.numCols; 
    
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
        {this.renderNavBar()}
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
      
      <Board/>
    </Fragment>
  );
}

export default App;

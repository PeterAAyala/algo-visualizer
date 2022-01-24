function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

/* 
 * Return adjacent squares to {cell} not blocked by a wall 
 *
 * @param {Array(Array)} matrix: the Board, where cell value = 1 indicates a wall
 * @param {[int, int]} cell: the cell within the matrix to check for adjacent neighbors
 * @return {[int List]} adjacent cell keys not vlocked by a wall 
 */
export const checkNeighbors = function(matrix, cell){
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
    // return shuffle(neighbors);
    return neighbors;
}

/*
 * Returns a dictionary, where each key of dict represents key of a Square, and 
 * each entry contains [x,y] location on Board and adjacent neighbors not blocked
 * 
 * @param {Array.(Array)} matrix of Board 
 * @return {dict} entry for each key
 */

export const createGraph = function(matrix) {
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

 
// Returns true if two Arrays share same values and length
export const arrayEquals = function(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    }

/*
 * Returns the solved path from algorithm, starting at End Square 
 * and ending at Start Square
 * 
 * @param {Array} chain, where chain[i] represents parent key for Cell <key=i>
 * @param {int} start: key of Start block
 * @param {int} end: key of End block
 * @return {Array} from End to Start
 */
export const parentChainReturn = function(chain, start, end) {
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

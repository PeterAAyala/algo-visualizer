function chooseOrientation(width, height) {
    if (width < height){
        return "Horizontal"
    } else if (height < width){
        return "Vertical"
    } else {
        return Math.floor(Math.random() * 2) == 0 ? "Horizontal" : "Vertical"
    }
}


export const divideGrid = function(grid, x, y, width, height) {
    //height = grid.length;
    //width = grid[0].length;
    console.log(grid,x,y,width,height);
    let orientation = chooseOrientation(width, height);
    let horizontalFlag = (orientation == "Horizontal");

    if (height < 3 || width < 3){ console.log("break"); return }
    
    // Where the vertical or horizontal line is drawn
    // wx represents where in position x a vertical line is drawn (odd only)
    // wy represents where in position y a horizontal line is drawn
    let wx = x + (horizontalFlag ? 0 : Math.floor(Math.random()*(width-1)/2)*2+1) ;
    let wy = y + (horizontalFlag ? Math.floor(Math.random()*(height-1)/2)*2+1 : 0);

    // Where the opening in the horizontal or vertical line is drawn
    // passage_x represents where on the horizontal line a passage is opened 
    let passage_x = wx + (horizontalFlag ? Math.floor(Math.random()*width/2)*2 : 0);
    let passage_y = wy + (horizontalFlag ? 0 : Math.floor(Math.random()*height/2)*2);
    
    //console.log([wx, wy, passage_x,passage_y]);

    let lengthOfLine = (horizontalFlag ? width : height);
    for (let i = 0; i < lengthOfLine; i++){
        if (horizontalFlag && (passage_x != i+wx)) {
            grid[wy][i+wx] = 1
        }
        if (!(horizontalFlag) && (passage_y != i+wy)) {
            grid[i+wy][wx] = 1
        }
    }
    
    
    let nx = x;
    let ny = y;
    let nwidth = horizontalFlag ? width : wx//wx - x + 1;
    let nheight = horizontalFlag ? wy : height;
    console.log([horizontalFlag, nx, ny, nwidth, nheight]);
    divideGrid(grid, nx, ny, nwidth, nheight);
    
    
    let nx2 = horizontalFlag ? x : wx + 1;
    let ny2 = horizontalFlag ? wy + 1 : y;
    let nwidth2 = horizontalFlag ? width : x + width - wx - 1;//- 1;
    let nheight2 = horizontalFlag ? y + height - wy - 1 : height;
    console.log([horizontalFlag, width, height, nx2, ny2, nwidth2, nheight2]);
    divideGrid(grid, nx2, ny2, nwidth2, nheight2);
    
    
    return grid;
}


let walls;
export const recursiveDivisionMaze = function(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let vertical = range(grid[0].length);
  let horizontal = range(grid.length);
  walls = [];
  getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode);
  return walls;
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode) {
  if (vertical.length < 2 || horizontal.length < 2) {
    return;
  }
  let dir;
  let num;
  if (vertical.length > horizontal.length) {
    dir = 0;
    num = generateOddRandomNumber(vertical);
  }
  if (vertical.length <= horizontal.length) {
    dir = 1;
    num = generateOddRandomNumber(horizontal);
  }

  if (dir === 0) {
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      vertical.slice(0, vertical.indexOf(num)),
      horizontal,
      grid,
      startNode,
      finishNode
    );
    getRecursiveWalls(
      vertical.slice(vertical.indexOf(num) + 1),
      horizontal,
      grid,
      startNode,
      finishNode
    );
  } else {
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      vertical,
      horizontal.slice(0, horizontal.indexOf(num)),
      grid,
      startNode,
      finishNode
    );
    getRecursiveWalls(
      vertical,
      horizontal.slice(horizontal.indexOf(num) + 1),
      grid,
      startNode,
      finishNode
    );
  }
}



//dir === 0 => Horizontal
//dir === 1 => Vertical

function addWall(dir, num, vertical, horizontal, startNode, finishNode) {
  let isStartFinish = false;
  let tempWalls = [];
  if (dir === 0) {
    if (horizontal.length === 2) return;
    for (let temp of horizontal) {
      if (
        (temp === startNode[0] && num === startNode[1]) ||
        (temp === finishNode[0] && num === finishNode[1])
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([temp, num]);
    }
  } else {
    if (vertical.length === 2) return;
    for (let temp of vertical) {
      if (
        (num === startNode[0] && temp === startNode[1]) ||
        (num === finishNode[0] && temp === finishNode[1])
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([num, temp]);
    }
  }
  if (!isStartFinish) {
    tempWalls.splice(generateRandomNumber(tempWalls.length), 1);
  }
  for (let wall of tempWalls) {
    walls.push(wall);
  }
}

function generateRandomNumber(max) {
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 !== 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return randomNum;
}

function generateOddRandomNumber(array) {
    let max = array.length - 1;
    let randomNum =
      Math.floor(Math.random() * (max / 2)) +
      Math.floor(Math.random() * (max / 2));
    if (randomNum % 2 === 0) {
      if (randomNum === max) {
        randomNum -= 1;
      } else {
        randomNum += 1;
      }
    }
    return array[randomNum];
  }

function range(len) {
    let result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  }

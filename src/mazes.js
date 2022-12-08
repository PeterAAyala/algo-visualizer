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
    let orientation = chooseOrientation(width, height);
    let horizontalFlag = (orientation == "Horizontal");

    if (height < 2 || width < 2){ return }

    // Where the vertical or horizontal line is drawn
    let wx = x + (horizontalFlag ? 0 : Math.random(width - 2)) ;
    let wy = y + (horizontalFlag ? Math.random(height - 2) : 0);
    // Where the opening in the horizontal or vertical line is drawn
    let passage_x = wx + (horizontalFlag ? Math.random(width) : 0);
    let passage_y = wy + (horizontalFlag ? 0 : Math.random(height));

    let lengthOfLine = (horizontalFlag ? width : height);
    for (i = 0; i < lengthOfLine; i++){
        if (horizontalFlag && passage_x != i) {
            grid[i][wy] = 1
        }
        if (!(horizontalFlag) && passage_y != i ) {
            grid[wx][i] = 1
        }
    }

    let nx = x;
    let ny = y;
    let nwidth = horizontalFlag ? width : wx - x + 1;
    let nheight = horizontalFlag ? wy - y + 1 : height;
    divideGrid(grid, nx, ny, nwidth, nheight);
    
    let nx2 = horizontalFlag ? x : wx + 1;
    let ny2 = horizontalFlag ? wy + 1 : y;
    let nwidth2 = horizontalFlag ? width : x + width - 1;
    let nheight2 = horizontalFlag ? y + height - wy - 1 : height;
    divideGrid(grid, nx2, ny2, nwidth2, nheight2);

    return divideGrid(grid, x, y, width, height);
}

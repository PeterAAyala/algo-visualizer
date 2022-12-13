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

    if (height < 2 || width < 2){ console.log("break"); return }
    
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

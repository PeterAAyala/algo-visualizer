export const BFS = function (startKey, endKey, grid) {
    //const Start = this.state.startBlock[0]*20 +this.state.startBlock[1] ;
    //const End = this.state.endBlock[0]*20+this.state.endBlock[1];
    const len = grid.length * grid[0].length;
    const matrixGrid = createGraph(grid);
    var queue = [];
    var visited = Array(len).fill(false);
    var parentChain = Array(len).fill(null);
    var go = true;
    //const matrixGrid = createGraph(this.state.grid);
    //console.log(matrixGrid);
    
    queue.push(startKey);
    visited[startKey] = true;

    const loop = () => {
      if (queue.length!=0 && go){ 
        var s = queue.shift();
        for (let i = 0; i < matrixGrid[s]['neighbors'].length; i++) {
          const element = matrixGrid[s]['neighbors'][i];
          const coord = matrixGrid[element]['location'];
          if (element == endKey) go = false;
          if (!(visited[element])) {
            parentChain[element] = s;
            queue.push(element);
            visited[element] = true;
            this.updateRender(coord, 'searched');
          }
        }
      }
      if (go) { 
        setTimeout(loop, 10);
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
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;


Array.prototype.each = function(callback) {
  var i = 0;
  while (i < this.length) {
    callback.call(this, this[i]);
    i++;
  }
  return this;
};

Array.prototype.map = function(callback) {
  var i = this.length;
  var found = []
  while (i--) {
    if(callback.call(this, this[i])) {
      found.push(this[i]);
    }
  }
  return found;
};

Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};

Array.prototype.remove = function(element) {
  for(var i=0; i<this.length;i++ ) {
    if(this[i]==element) {
      this.splice(i,1);
      break;
    }
  }
};

function World(numCols, numRows, ctx, squareDim) {
    console.log('World constructor called')
  this.numCols = numCols;
  this.numRows = numRows;
  this.sq = squareDim;
  this.ctx = ctx;

    ctx.fillStyle = "rgb(255,255,120)";

  var i = numCols * numRows;
  var x, y;

  this.cells = new Array(numRows);
  this.nextCells = new Array(numRows);
    for (var row = 0; row < this.numRows; row++) {
        this.cells[row] = new Array(numCols);
        this.nextCells[row] = new Array(numCols);
    }
  this.randomize();
  this.render();
}

globalToggle = function(e) {
    //console.log('global toggle called')
    coords = canvas.relMouseCoords(e);
    var mouseX  = coords.x;
    var mouseY  = coords.y;
    //console.log(mouseX + ',' + mouseY);
    world.toggle(mouseX, mouseY);
}

World.prototype.toggle = function(mouseX, mouseY) {
    var row = Math.floor(mouseY / this.sq);
    var col = Math.floor(mouseX / this.sq);


    console.log('(row,col|live) before/after')
    var liveNeighboursCount = this.countCellNeighbors(row, col);
    console.log('(' + row + ','+col+'| '+liveNeighboursCount+')' );
    //console.log('world toggle called (row,col): (' + row + ','+col+')' );
    if ( this.cells[row][col] ) {
        // Turn it off
        //console.log('was on');
        this.cells[row][col] = 0;
        this.turnOff(row,col);
    } else {
        // Turn it on
        //console.log('was off');
        this.cells[row][col] = 1;
        this.turnOn(row,col);
    }
    liveNeighboursCount = this.countCellNeighbors(row, col);
    console.log('(' + row + ','+col+'| '+liveNeighboursCount+')' );
}

World.prototype.tick = function() {
    console.log('tick called')

  for (var row = 0; row < this.numRows; row++) {
      //console.log('row and num rows: ' +row + ' and ' + this.numRows)
  for (var col = 0; col < this.numCols; col++) {
      var liveNeighboursCount = this.countCellNeighbors(row, col);
      if (liveNeighboursCount < 2) {
        this.nextCells[row][col] = 0;
      } else if(liveNeighboursCount == 3 || liveNeighboursCount ==4) {
        this.nextCells[row][col] = 1;
      } else if(liveNeighboursCount > 4) {
        this.nextCells[row][col] = 0;
      }
  }
  }
    for (var row = 0; row < this.numRows; row++) {
        for (var col = 0; col < this.numCols; col++) {
            this.cells[row][col] = this.nextCells[row][col];
        }
    }
}

World.prototype.placeOnInterval = function(num, interval) {
    if( num < 0 ){
        return interval + num;
    } else if ( num >= interval ) {
        return num - interval;
    } else {
        return num;
    }
}

World.prototype.countCellNeighbors = function(row, col) {
    var neighborCount = 0;

    for( var rowInd = row-1; rowInd <= row+1; rowInd++ ){
        for( var colInd = col-1; colInd <= col+1; colInd++ ){

// PUT BACK IN CONDITION FOR NOT COUNTING CELL ITSELF
                var rowOnInt = this.placeOnInterval(rowInd,this.numRows);
                var colOnInt = this.placeOnInterval(colInd,this.numCols);
                neighborCount += this.cells[rowOnInt][colOnInt];
                //console.log('rowInd, colInd, count:' + rowOnInt + ', '+ colOnInt + ', '+ neighborCount);
                
        }
    }
    //console.log('row, col, count:' + row + ', '+ col + ', '+ neighborCount);

    return neighborCount;
}

World.prototype.clearAll = function() {
    this.ctx.clearRect ( 0 , 0 , this.numCols*this.sq , this.numRows*this.sq );
}

World.prototype.clear = function() {
    for (var row = 0; row < this.numRows; row++) {
        for (var col = 0; col < this.numCols; col++) {
            this.cells[row][col] = 0;
        }
    }
    this.render();
}

World.prototype.turnOn = function(row, col) {
    this.ctx.fillRect(col*this.sq, row*this.sq, this.sq-1, this.sq-1);
}

World.prototype.turnOff = function(row, col) {
    this.ctx.clearRect(col*this.sq, row*this.sq, this.sq-1, this.sq-1);
}

World.prototype.render = function() {
    console.log('render called')
    this.clearAll();
    for (var row = 0; row < this.numRows; row++) {
        for (var col = 0; col < this.numCols; col++) {
            if (this.cells[row][col]) {
                this.turnOn(row,col);
            }
        }
    }
}

World.prototype.randomize = function() {
    console.log('randomize called')
    this.ctx.clearRect ( 0 , 0 , this.numCols*this.sq , this.numRows*this.sq );
    for (var row = 0; row < this.numRows; row++) {
        for (var col = 0; col < this.numCols; col++) {
            var testVal = Math.random() > 0.7;
            //var msg = 'row, col, rand: ' + row + ', ' + col + ', ' + testVal;
            //console.log( msg );
            
            if (testVal) {
                this.cells[row][col] = 1;
            } else {
                this.cells[row][col] = 0;
            }
        }
    }
    this.render();
}


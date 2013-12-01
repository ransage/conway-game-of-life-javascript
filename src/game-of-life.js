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

  var i = numCols * numRows;
  var x, y;

  this.cells = new Array(numRows);
    for (var row = 0; row < this.numRows; row++) {
        this.cells[row] = new Array(numCols);
    }
  this.randomize();
  this.render();
}

World.prototype.toggle = function(x, y) {
    console.log('toggle called')
    var row = x / this.sq;
    var col = y / this.sq;
    this.cells[row][col] = 1 - this.cells[row][col];
}

World.prototype.tick = function() {
    console.log('tick called')
  for (var row = 1; row < this.numRows-2; row++) {
  for (var col = 1; col < this.numCols-2; col++) {
/*
  for (var row = 0; row < this.numRows; row++) {
      console.log('row and num rows: ' +row + ' and ' + this.numRows)
  for (var col = 0; col < this.numCols; col++) {
*/
      var liveNeighboursCount = this.countCellNeighbors(row, col);
      if (liveNeighboursCount < 2) {
        this.cells[row][col] = 0;
      } else if(liveNeighboursCount == 3 || liveNeighboursCount ==4) {
        this.cells[row][col] = 1;
      } else if(liveNeighboursCount > 4) {
        this.cells[row][col] = 0;
      }
  }
  }
}

World.prototype.placeOnInterval = function(num, interval) {
    return num;
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

    for( var rowInd = row-1; rowInd++; rowInd <= row+1 ){
        for( var colInd = col-1; colInd++; colInd <= col+1 ){
            //if(rowInd != row && colInd != col){
            var rowOnInt = placeOnInterval(rowInd,this.numRows);
            var colOnInt = placeOnInterval(colInd,this.numCols);
            neighborCount += this.cells[rowOnInt][colOnInt];
            //}
        }
    }
    //console.log('row, col, count:' + row + ', '+ col + ', '+ neighborCount);

    return neighborCount;
}

World.prototype.render = function() {
    console.log('render called')
    this.ctx.clearRect ( 0 , 0 , this.numCols*this.sq , this.numRows*this.sq );
    for (var row = 0; row < this.numRows; row++) {
        for (var col = 0; col < this.numCols; col++) {
            if (this.cells[row][col]) {
                this.ctx.fillRect(row*this.sq, col*this.sq, this.sq-1, this.sq-1);
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
}


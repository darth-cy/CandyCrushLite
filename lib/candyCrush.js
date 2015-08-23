(function(){
  if(typeof CandyCrush === "undefined"){
    window.CandyCrush = {};
  };

  var CandyCrushOpts = {
    rows: 9,
    cols: 5,
    colors: ["red", "blue", "green", "yellow", "purple", "orange"]
  };

  var nullCandy = function(row, col){
    this.row = row;
    this.col = col;
    this.isCandy = function(){
      return false;
    };
  };

  var Game = CandyCrush.Game = function(el, handler){
    this.$candyField = $(el);
    this.candies = [];

    this.eventHandler = handler;
    this.eventHandler.setGame(this);

    this.rowCount = CandyCrushOpts.rows;
    this.colCount = CandyCrushOpts.cols;
    this.colors = CandyCrushOpts.colors;

    this.initEmptyGrid();
    this.addCandies();
  };

  Game.prototype.initEmptyGrid = function(){
    this.candyGrid = new Array(this.rowCount);

    for(var row = 0; row < this.rowCount; row++){
      this.candyGrid[row] = new Array(this.colCount);

      for(var col = 0; col < this.colCount; col++){
        this.candyGrid[row][col] = new nullCandy(row, col);
      }
    }
  };

  Game.prototype.addCandies = function(){
    for(var row = 8; row >= 0; row--){
      for(var col = 4; col >= 0; col--){
        this.addCandy(row, col);
      }
    }
  };

  Game.prototype.detectClear = function(){
    console.log("clearing!");

    var thisGame = this;
    var detected = false;

    for(var row = 1; row < this.rowCount; row++){
      for(var col = 0; col < this.colCount; col++){

        if(!this.candyGrid[row][col].isCandy()){ continue; }

        var comb = this.findLongestHorizontal(row, col);

        if(comb.length >= 3){

          comb.forEach(function(candy){
            thisGame.removeCandy(candy.row, candy.col);
          })

          detected = true;

        }

        var comb = this.findLongestVertical(row, col);

        if(comb.length >= 3){

          comb.forEach(function(candy){
            thisGame.removeCandy(candy.row, candy.col);
          })

          detected = true;

        }
      }
    }

    if(detected){
      thisGame.adjust();
    }

    return detected;
  };

  Game.prototype.addCandy = function(row, col){
    var color = this.randomColor();

    var $newDiv = $("<div>").addClass("candy-box")
                           .addClass("row-" + row + "-col-" + col)
                           .addClass("candy-" + color);
    $newDiv.attr("row-index", row);
    $newDiv.attr("col-index", col);
    $newDiv.attr("color", color);

    this.bindEvents($newDiv);

    var newCandy = new CandyCrush.Candy(row, col, $newDiv);

    this.$candyField.append($newDiv);
    this.candyGrid[row][col] = newCandy;
    this.candies.push(newCandy);
  };

  Game.prototype.removeCandy = function(row, col){
    var targetCandy = this.findCandy(row, col);
    if(targetCandy){
      var index = this.candies.indexOf(targetCandy);
      this.candies.splice(index, 1);

      this.candyGrid[row][col] = new nullCandy(row, col);
      targetCandy.destroy();
    }
  };

  Game.prototype.findCandy = function(row, col){
    for(var i = 0; i < this.candies.length; i++){
      if(this.candies[i].row == row && this.candies[i].col == col){
        return this.candies[i];
      }
    }
    return undefined;
  };

  Game.prototype.swap = function(cords1, cords2){
    var firstTarget = this.findCandy(cords1[0], cords1[1]);
    var secondTarget = this.findCandy(cords2[0], cords2[1]);

    if(cords1[0] - cords2[0] == 1){
      firstTarget.moveUp();
      secondTarget.moveDown();
    }

    if(cords1[0] - cords2[0] == -1){
      firstTarget.moveDown();
      secondTarget.moveUp();
    }

    if(cords1[1] - cords2[1] == 1){
      firstTarget.moveLeft();
      secondTarget.moveRight();
    }

    if(cords1[1] - cords2[1] == -1){
      firstTarget.moveRight();
      secondTarget.moveLeft();
    }

    this.detectClear();
  };

  Game.prototype.adjust = function(){
    var thisGame = this;
    var unadjusted = true;

    while(unadjusted){

      unadjusted = false;

      thisGame.candies.forEach(function(candy){
        if(candy.row + 1 > thisGame.rowCount - 1){
          return 0;
        }
        if(!thisGame.candyGrid[candy.row + 1][candy.col].isCandy()){
          thisGame.candyGrid[candy.row][candy.col] = new nullCandy();
          thisGame.candyGrid[candy.row + 1][candy.col] = candy;

          candy.moveDown();
          unadjusted = true;
        }
      })

      thisGame.refillCandy();
    }

    thisGame.detectClear();

    return true;
  };

  Game.prototype.refillCandy = function(){
    for(var i = 0; i < this.colCount; i++){
      if(!this.candyGrid[0][i].isCandy()){
        this.candyGrid[0][i] = undefined;
        this.addCandy(0, i);
      }
    }
  };

  Game.prototype.findLongestHorizontal = function(row, col){
    var comb = [];

    var firstCandy = this.candyGrid[row][col];
    if(firstCandy.isCandy()){
      comb.push(firstCandy);
    }

    var thisCol = col + 1;
    while(thisCol < this.colCount){
      otherCandy = this.candyGrid[row][thisCol];
      
      if(!otherCandy.isCandy() || !otherCandy.isSameColor(firstCandy)){
        break;
      }

      comb.push(otherCandy);
      thisCol += 1;
    }

    return comb;
  };

  Game.prototype.findLongestVertical = function(row, col){
    var comb = [];

    var firstCandy = this.candyGrid[row][col];
    if(firstCandy.isCandy()){
      comb.push(firstCandy);
    }

    var thisRow = row + 1;

    while(thisRow < this.rowCount){
      otherCandy = this.candyGrid[thisRow][col];

      if(!otherCandy.isCandy() || !otherCandy.isSameColor(firstCandy)){
        break;
      }

      comb.push(otherCandy);
      thisRow += 1;
    }

    return comb;
  };

  Game.prototype.randomColor = function(){
    var index = Math.floor(Math.random() * 5);
    return this.colors[index];
  };

  Game.prototype.bindEvents = function($el){
    var handler = this.eventHandler;

    $el.on("click", handler.handleClick.bind(handler));
    $el.on("mousedown", handler.handleMouseDown.bind(handler));
    $el.on("mouseup", handler.handleMouseUp.bind(handler));
  }
})();

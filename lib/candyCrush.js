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

    this.score = 0;
    this.updateScoreBoard();

    this.initEmptyGrid();
    this.addCandies();
  };

  // Initialization utilities
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

  // All detect and clear functions
  Game.prototype.detectClear = function(){
    var thisGame = this;
    var detected = false;

    if(thisGame.detectClearLShape() || thisGame.detectClearRowCol()){
      setTimeout(this.adjust.bind(this), 200);
      return true;
    }else{
      thisGame.installEvents();
      return false;
    }
  };

  Game.prototype.detectClearLShape = function(){
    var thisGame = this;
    var detected = false;

    for(var row = 1; row < thisGame.rowCount; row++){
      for(var col = 0; col < thisGame.colCount; col++){
        if(!thisGame.candyGrid[row][col].isCandy()){ continue; }

        var LShape = thisGame.findLongestLShape(row, col);
        if(LShape){
          LShape[0].upgrade();

          for(var index = 1; index < LShape.length; index++){
            var candy = LShape[index];

            thisGame.score += 50;
            thisGame.updateScoreBoard();
            thisGame.removeCandy(candy.row, candy.col);
          }

          detected = true;
        }
      }
    }

    return detected;
  }

  Game.prototype.detectClearRowCol = function(){
    var thisGame = this;
    var detected = false;

    for(var row = 1; row < thisGame.rowCount; row++){
      for(var col = 0; col < thisGame.colCount; col++){

        if(!thisGame.candyGrid[row][col].isCandy()){ continue; }

        var comb = thisGame.findLongestRight(row, col);
        if(comb.length >= 3){

          if(comb.length > 3){
            comb[0].upgrade();
          }else{
            thisGame.removeCandy(comb[0].row, comb[0].col);
          }

          for(var index = 1; index < comb.length; index++){
            var candy = comb[index];
            thisGame.score += 10;
            thisGame.updateScoreBoard();

            thisGame.removeCandy(candy.row, candy.col);
          }

          detected = true;
        }

        var comb = thisGame.findLongestDown(row, col);
        if(comb.length >= 3){

          if(comb.length > 3){
            comb[0].upgrade();
          }else{
            thisGame.removeCandy(comb[0].row, comb[0].col);
          }

          for(var index = 1; index < comb.length; index++){
            var candy = comb[index];
            thisGame.score += 10;
            thisGame.updateScoreBoard();

            thisGame.removeCandy(candy.row, candy.col);
          }

          detected = true;
        }
      }
    }

    return detected;
  }

  // Candy utility functions
  Game.prototype.addCandy = function(row, col){
    var color = this.randomColor();

    var $newDiv = $("<div>").addClass("candy-box")
                           .addClass("row-" + row + "-col-" + col)
                           .addClass("candy-" + color);
    $newDiv.attr("row-index", row);
    $newDiv.attr("col-index", col);
    $newDiv.attr("color", color);

    var newCandy = new CandyCrush.Candy(row, col, $newDiv, this.eventHandler);
    newCandy.installEvents();

    this.$candyField.append(newCandy.$div);
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

  // Candy positioning functions
  Game.prototype.swap = function(cords1, cords2, isKickBack){
    var thisGame = this;

    var firstTarget = this.findCandy(cords1[0], cords1[1]);
    var secondTarget = this.findCandy(cords2[0], cords2[1]);

    this.candyGrid[cords1[0]][cords1[1]] = secondTarget;
    this.candyGrid[cords2[0]][cords2[1]] = firstTarget;

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

    if(isKickBack){ return 0; }
    thisGame.muteEvents();

    setTimeout(function(){
      if(!thisGame.detectClear()){
        thisGame.swap(cords2, cords1, true);
      }
    }, 500);
  };

  Game.prototype.adjust = function(){
    var thisGame = this;
    var unadjusted = false;

    thisGame.candies.forEach(function(candy){
      if(candy.row + 1 > thisGame.rowCount - 1){
        return 0;
      }
      if(!thisGame.candyGrid[candy.row + 1][candy.col].isCandy()){
        thisGame.candyGrid[candy.row + 1][candy.col] = candy;
        thisGame.candyGrid[candy.row][candy.col] = new nullCandy(candy.row, candy.col);

        candy.moveDown();
        unadjusted = true;
        thisGame.refillCandy();
      }
    })

    if(unadjusted){
      setTimeout(thisGame.adjust.bind(thisGame), 300);
    }else{
      setTimeout(thisGame.detectClear.bind(thisGame), 300);
    }
    //
    // // while(unadjusted){
    //
    //   function movecandies(){
    //     unadjusted = false;
    //
    //     thisGame.candies.forEach(function(candy){
    //       if(candy.row + 1 > thisGame.rowCount - 1){
    //         return 0;
    //       }
    //       if(!thisGame.candyGrid[candy.row + 1][candy.col].isCandy()){
    //         thisGame.candyGrid[candy.row + 1][candy.col] = candy;
    //         thisGame.candyGrid[candy.row][candy.col] = new nullCandy();
    //
    //         candy.moveDown();
    //         unadjusted = true;
    //         thisGame.refillCandy();
    //       }
    //     })
    //
    //     if(unadjusted){
    //       setTimeout(movecandies, 300);
    //     }
    //   }
    //
    //   movecandies();
    //
    //
    // thisGame.detectClear();
    // return true;
  };

  // Candy maintainenece functions
  Game.prototype.refillCandy = function(){
    for(var i = 0; i < this.colCount; i++){
      if(!this.candyGrid[0][i].isCandy()){
        this.candyGrid[0][i] = undefined;
        this.addCandy(0, i);
      }
    }
  };

  // Utilities
  Game.prototype.findLongestRight = function(row, col){
    var comb = [];

    var firstCandy = this.candyGrid[row][col];
    if(!firstCandy.isCandy()){
      return [];
    }

    comb.push(firstCandy);
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

  Game.prototype.findLongestLeft = function(row, col){
    var comb = [];

    var firstCandy = this.candyGrid[row][col];
    if(!firstCandy.isCandy()){
      return [];
    }

    comb.push(firstCandy);
    var thisCol = col - 1;
    while(thisCol >= 0){
      otherCandy = this.candyGrid[row][thisCol];

      if(!otherCandy.isCandy() || !otherCandy.isSameColor(firstCandy)){
        break;
      }

      comb.push(otherCandy);
      thisCol -= 1;
    }

    return comb;
  };

  Game.prototype.findLongestDown = function(row, col){
    var comb = [];

    var firstCandy = this.candyGrid[row][col];
    if(!firstCandy.isCandy()){
      return [];
    }

    comb.push(firstCandy);
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

  Game.prototype.findLongestUp = function(row, col){
    var comb = [];

    var firstCandy = this.candyGrid[row][col];
    if(!firstCandy.isCandy()){
      return [];
    }

    comb.push(firstCandy);
    var thisRow = row - 1;

    while(thisRow >= 0){
      otherCandy = this.candyGrid[thisRow][col];

      if(!otherCandy.isCandy() || !otherCandy.isSameColor(firstCandy)){
        break;
      }

      comb.push(otherCandy);
      thisRow -= 1;
    }

    return comb;
  };

  Game.prototype.findLongestLShape = function(row, col){
    var comb = [];
    var thisGame = this;
    var thisCandy = this.candyGrid[row][col];

    if(!thisCandy.isCandy()){
      return undefined;
    };

    comb.push(thisCandy);

    var left = thisGame.findLongestLeft(row, col);
    var right = thisGame.findLongestRight(row, col);
    var up = thisGame.findLongestUp(row, col);
    var down = thisGame.findLongestDown(row, col);

    if((left.length + right.length - 1) >= 3 && (up.length + down.length - 1) >= 3){
      debugger;
      [left, right, up, down].forEach(function(arr){
        for(var i = 1; i < arr.length; i++){
          comb.push(arr[i]);
        }
      })
      return comb;
    }

    return undefined;
  }

  Game.prototype.randomColor = function(){
    var index = Math.floor(Math.random() * 5);
    return this.colors[index];
  };

  Game.prototype.muteEvents = function(){
    this.candies.forEach(function(candy){
      candy.muteEvents();
    });
  };

  Game.prototype.installEvents = function(){
    this.candies.forEach(function(candy){
      candy.installEvents();
    });
  };

  Game.prototype.updateScoreBoard = function(){
    var content = "<h1>Current Candy Score:<br>"+ this.score +"</h1>";
    $("#current-score-board").html(content);
    return this.score;
  };

})();

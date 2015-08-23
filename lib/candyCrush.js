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

  var Game = CandyCrush.Game = function(el){
    this.$candyField = $(el);
    this.candies = [];

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
    for(var row = 0; row < 9; row++){
      for(var col = 0; col < 5; col++){
        this.addCandy(row, col);
      }
    }
  };

  Game.prototype.addCandy = function(row, col){
    var $newDiv = $("<div>").addClass("candy-box")
                           .addClass("row-" + row + "-col-" + col)
                           .addClass("candy-" + this.randomColor());
    $newDiv.attr("row-index", row);
    $newDiv.attr("col-index", col);

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
    this.ajust();
  };

  Game.prototype.findCandy = function(row, col){
    for(var i = 0; i < this.candies.length; i++){
      if(this.candies[i].row == row && this.candies[i].col == col){
        return this.candies[i];
      }
    }
    return undefined;
  };

  Game.prototype.ajust = function(){
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
    }

    return true;
  };

  Game.prototype.randomColor = function(){
    var index = Math.floor(Math.random() * 5);
    return this.colors[index];
  };

  var Candy = CandyCrush.Candy = function(row, col, $div){
    this.$div = $div;
    this.row = row;
    this.col = col;
  };

  Candy.prototype.moveDown = function(){
    this.$div.removeClass("row-" + (this.row) + "-col-" + (this.col));
    this.$div.addClass("row-" + (Number(this.row) + 1) + "-col-" + (this.col));

    this.$div.attr("row-index", Number(this.row) + 1);
    this.row = Number(this.row) + 1;
  };

  Candy.prototype.destroy = function(){
    this.$div.remove();
  };

  Candy.prototype.isCandy = function(){
    return true;
  };

  var EventHandler = CandyCrush.EventHandler = function(game){
    this.game = game;
  };

  EventHandler.prototype.processClick = function(event){
    var $clicked = $(event.currentTarget);
    if($clicked.hasClass("candy-box")){
      var row = $clicked.attr("row-index");
      var col = $clicked.attr("col-index");

      this.game.removeCandy(row, col);
    }else{
      return 0;
    }
  }
})();

(function(){
  if(typeof CandyCrush === "undefined"){
    window.CandyCrush = {};
  };

  var CandyCrushOpts = {
    rows: 8,
    cols: 5,
    colors: ["red", "blue", "green", "yellow", "purple", "orange"]
  };

  var nullCandy = {
    isCandy: function(){
      return false;
    }
  };

  var Game = CandyCrush.Game = function(el){
    this.$candyField = $(el);
    this.candies = [];

    this.rowCount = CandyCrushOpts.rows;
    this.colCount = CandyCrushOpts.cols;
    this.colors = CandyCrushOpts.colors;

    this.candyGrid = Array.apply(null, Array(this.rowCount)).map(function(){
      return Array.apply(null, Array(this.colCount)).map(function(){
        return nullCandy;
      })
    })

    this.addCandies();
  };

  Game.prototype.addCandies = function(){
    for(var row = 0; row < 9; row++){
      for(var col = 0; col < 5; col++){
        this.addCandy(row, col);
      }
    }
  };

  Game.prototype.randomColor = function(){
    var index = Math.floor(Math.random() * 5);
    return this.colors[index];
  };

  Game.prototype.addCandy = function(row, col){
    var $newDiv = $("<div>").addClass("candy-box")
                           .addClass("row-" + row + "-col-" + col)
                           .addClass("candy-" + this.randomColor());
    $newDiv.attr("row-index", row);
    $newDiv.attr("col-index", col);

    var newCandy = new CandyCrush.Candy(row, col, $newDiv);

    this.$candyField.append($newDiv);
    this.candies.push(newCandy);
  };

  var Candy = CandyCrush.Candy = function(row, col, $el){
    this.$el = $el;
    this.row = row;
    this.col = col;
  };
})();

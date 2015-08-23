(function(){
  if(typeof CandyCrush === "undefined"){
    window.CandyCrush = {};
  }

  var Candy = CandyCrush.Candy = function(row, col, $div, handler){
    this.$div = $div;
    this.handler = handler;
    this.color = this.$div.attr("color");
    this.row = row;
    this.col = col;
  };

  // Status logics
  Candy.prototype.upgrade = function(){
    this.$div.removeClass("candy-" + this.color);
    this.$div.addClass("candy-" + this.color + "-wrapped");
  };

  // All positioning logics
  Candy.prototype.moveDown = function(){
    this.$div.removeClass("row-" + (this.row) + "-col-" + (this.col));
    this.$div.addClass("row-" + (Number(this.row) + 1) + "-col-" + (this.col));

    this.$div.attr("row-index", Number(this.row) + 1);
    this.row = Number(this.row) + 1;
  };

  Candy.prototype.moveLeft = function(){
    this.$div.removeClass("row-" + (this.row) + "-col-" + (this.col));
    this.$div.addClass("row-" + (this.row) + "-col-" + (Number(this.col) - 1));

    this.$div.attr("col-index", Number(this.col) - 1);
    this.col = Number(this.col) - 1;
  };

  Candy.prototype.moveRight = function(){
    this.$div.removeClass("row-" + (this.row) + "-col-" + (this.col));
    this.$div.addClass("row-" + (this.row) + "-col-" + (Number(this.col) + 1));

    this.$div.attr("col-index", Number(this.col) + 1);
    this.col = Number(this.col) + 1;
  };

  Candy.prototype.moveUp = function(){
    this.$div.removeClass("row-" + (this.row) + "-col-" + (this.col));
    this.$div.addClass("row-" + (Number(this.row) - 1) + "-col-" + (this.col));

    this.$div.attr("row-index", Number(this.row) - 1);
    this.row = Number(this.row) - 1;
  };

  // Subsistance logics
  Candy.prototype.destroy = function(){
    this.burst();
    this.$div.remove();
  };

  Candy.prototype.burst = function(){
    var posClass = "row-" + this.row + "-col-" + this.col;
    var $burstDiv = $("<div>").addClass("burst-effect-box").addClass(posClass);
    this.$div.after($burstDiv);

    setTimeout(function(){ $burstDiv.remove(); }, 200);
  };

  // Utilities
  Candy.prototype.isCandy = function(){
    return true;
  };

  Candy.prototype.isSameColor = function(otherCandy){
    if(this.color == otherCandy.color){
      return true;
    }else{
      return false;
    }
  };

  // Event switches
  Candy.prototype.installEvents = function(){
    var handler = this.handler;
    this.$div.on("mousedown", handler.handleMouseDown.bind(handler));
    this.$div.on("mouseup", handler.handleMouseUp.bind(handler));
  };

  Candy.prototype.muteEvents = function(){
    this.$div.off("mousedown");
    this.$div.off("mouseup");
  };

})();

(function(){
  if(typeof CandyCrush === "undefined"){
    window.CandyCrush = {};
  }

  var EventHandler = CandyCrush.EventHandler = function(game){
    this.game = game;
    this.firstTarget = undefined;
    this.secondTarget = undefined;
  };

  EventHandler.prototype.handleClick = function(event){
    event.preventDefault();

    var $clicked = $(event.currentTarget);
    if($clicked.hasClass("candy-box")){
      var row = $clicked.attr("row-index");
      var col = $clicked.attr("col-index");

      this.game.removeCandy(row, col);
    }else{
      return 0;
    }
  };

  EventHandler.prototype.handleMouseDown = function(event){
    event.preventDefault();

    if(this.firstTarget){
      return 0;
    }

    var $clicked = $(event.currentTarget);

    if($clicked.hasClass("candy-box")){
      this.firstTarget = [$clicked.attr("row-index"), $clicked.attr("col-index")];
    }else{
      return 0;
    }
  };

  EventHandler.prototype.handleMouseUp = function(event){
    event.preventDefault();

    var $clicked = $(event.currentTarget);
    if($clicked.hasClass("candy-box") && this.firstTarget){
      this.secondTarget = [$clicked.attr("row-index"), $clicked.attr("col-index")];

      // Do not trigger if it's the same candy.
      if(this.firstTarget[0] == this.secondTarget[0] && this.firstTarget[1] == this.secondTarget[1]){
        console.log("same candy.");
        this.clearTargets();
        return 0;
      }

      // Do not trigger if they are not neighboring candy.
      if((Math.abs(this.firstTarget[0] - this.secondTarget[0]) + Math.abs(this.firstTarget[1] - this.secondTarget[1])) > 1){
        console.log("too far away");
        this.clearTargets();
        return 0;
      }

      // Trigger swap.
      this.triggerSwap();
    }
  };

  EventHandler.prototype.clearTargets = function(){
    this.firstTarget = undefined;
    this.secondTarget = undefined;
  };

  EventHandler.prototype.triggerSwap = function(){
    // trigger swap logic here.
    console.log("swaping!");
    this.game.swap(this.firstTarget, this.secondTarget);

    this.clearTargets();
  };
})();

(function(){
  if(typeof CandyCrush === "undefined"){
    window.CandyCrush = {};
  }

  var EventHandler = CandyCrush.EventHandler = function(game){
    this.game = game;
    this.firstTarget = undefined;
    this.secondTarget = undefined;
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
  };

  EventHandler.prototype.handleMouseDown = function(event){
    var $clicked = $(event.currentTarget);
    if($clicked.hasClass("candy-box")){
      var this.firstTarget = [$clicked.attr("row-index"), $clicked.attr("col-index")];
    }else{
      return 0;
    }
  };

  EventHandler.prototype.handleMouseUp = function(event){
    var $clicked = $(event.currentTarget);
    if($clicked.hasClass("candy-box") && this.firstTarget){
      var this.secondTarget = [$clicked.attr("row-index"), $clicked.attr("col-index")];

      if(this.firstTarget[0] == this.secondTarget[0] && this.firstTarget[1] == this.secondTarget[1]){
        this.clearTargets();
        return 0;
      }

      if((Math.abs(this.firstTarget[0] - this.secondTarget[0]) + Math.abs(this.firstTarget[1] - this.secondTarget[1])) > 1){
        this.clearTargets();
        return 0;
      }



    }
  };

  EventHandler.prototype.clearTargets = function(){
    this.firstTarget = undefined;
    this.secondTarget = undefined;
  };
})();

(function(){
  if(typeof CandyCrush === "undefined"){
    window.CandyCrush = {};
  }

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

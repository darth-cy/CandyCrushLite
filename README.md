# CandyCrushLite #
This is the sensational Candy Crush game developed using HTML elements and css class toggling. It has intuitive drag control built on mouse events.

### Sample Screenshot ###
![candy-picture]

[candy-picture]: ./images/candy-crush.png

### How to Run ###
Follow the live link of this game here: [live]

[live]: http://razynoir.github.io/candy-crush/

### Development Process ###
+ Construct and test HTML capabilities, especially the sliding animation of div class using absolute positioning.
+ Write game logic that enables alignment checking, multiple alignment and L-shape recognition. The game handles all logic of the candies. Candies are not aware of the game state.
+ Bind mouse events.
+ Implement the clearing mechanism, which is an interconnected function loop that exert clearing logics in sequential order.

### Clearing Mechanism Details ###
+ The clearing logic consists of two core functions that call each other repeatedly if the detect and clearing process are not complete.

```javascript
Game.prototype.detectClear = function(){
  ...

  // Three conditions that requires readjusting the grid.
  if(thisGame.detectClearLShape() ||
     thisGame.detectClearRowCol() ||
     thisGame.setoffBombs()){
    setTimeout(this.adjust.bind(this), 200);
    return true;
  }else{
    // If not, all the muted key events are turned back on.
    thisGame.installEvents();
    return false; // End of clearing logic.
  }
};

Game.prototype.adjust = function(){
  var thisGame = this;
  var unadjusted = false;

  thisGame.candies.forEach(function(candy){
    ... // Adjustment logic.
  })

  if(unadjusted){
    // Keep adjusting if unajusted
    setTimeout(thisGame.adjust.bind(thisGame), 300);
  }else{
    // Call detectClear to see if the current adjustment will yield more alignment.
    setTimeout(thisGame.detectClear.bind(thisGame), 300);
  }
};
```

### Development Highlights ###
+ Scheduled Clearing: The clearing logic is constructed using two core functions. They call each other repeatedly until the <code>detectClear</code> function returns false, in which case there's not more combinations to clear.
+ Bomb Activation: The bomb activation logic is implemented by writing a <code>remove</code> function on the candy class, which behaves differently according to the current state of the candy. If a candy is wrapped, the candy will not remove itself but instead upgrade itself to a bomb. The game then collects bombs and setoff them sequentially.
+ Complex Shape Detection: The game enables long alignment detection and also L shape detection. The game achieves this by two functions that finds the longest candy column and row.

### Future Development Considerations ###
+ Switch to Canvas: Currently all the information about a candy is completed exposed on the DOM, which opens up vulnerability to DOM hacks. Canvas can be more beneficial because the elements on canvas has complete information hiding capability.

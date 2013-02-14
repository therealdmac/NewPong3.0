var debugCanvas = document.getElementById('debugcanvas');
var debugContext = debugCanvas.getContext('2d');


function CollisionHandler(){
	this.quadTree = new QuadTree({x:0,y:0,width:debugCanvas.width, height:debugCanvas.height});
	this.subDivide = function(objArr){
		this.quadTree.clear();
		this.quadTree.insert(objArr);
		
		var objects = [];
		this.quadTree.getAllObjects(objects);
 
		for (var x = 0, len = objects.length; x < len; x++){
			this.quadTree.findObjects(obj = [], objects[x]);
			for (y = 0, length = obj.length; y < length; y++) {
				for (z = y+1, length = obj.length; z < length; z++) {
					collisionDetection(obj[y], obj[z])
				}
			}		
		} 
	}
}
/**
 * QuadTree object.
 *
 * The quadrant indexes are numbered as below:
 *     |
 *  1  |  0
 * ----+----
 *  2  |  3
 *     |
 */
function QuadTree(boundBox, lvl) {
  var maxObjects = 1;
  this.bounds = boundBox || {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  var objects = [];
  this.nodes = [];
  var level = lvl || 0;
  var maxLevels = 5;
  
  if(debugFlag){
	debugContext.beginPath();
	debugContext.strokeStyle = 'yellow';
	debugContext.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	debugContext.stroke();
	}
 
  /*
   * Clears the quadTree and all nodes of objects
   */
  this.clear = function() {
    objects = [];
     
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }
     
    this.nodes = [];
  };
   
  /*
   * Get all objects in the quadTree
   */
  this.getAllObjects = function(returnedObjects) {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].getAllObjects(returnedObjects);
    }
     
    for (var i = 0, len = objects.length; i < len; i++) {
      returnedObjects.push(objects[i]);
    }
     
    return returnedObjects;
  };
   
  /*
   * Return all objects that the object could collide with
   */
  this.findObjects = function(returnedObjects, obj) {
    if (typeof obj === "undefined") {
      console.log("UNDEFINED OBJECT");
      return;
    }
     
    var index = this.getIndex(obj);
    if (index != -1 && this.nodes.length) {
      this.nodes[index].findObjects(returnedObjects, obj);
    }
     
    for (var i = 0, len = objects.length; i < len; i++) {
      returnedObjects.push(objects[i]);
    }
     
    return returnedObjects;
  };
     
  /*
   * Insert the object into the quadTree. If the tree
   * excedes the capacity, it will split and add all
   * objects to their corresponding nodes.
   */
  this.insert = function(obj) {
    if (typeof obj === "undefined") {
      return;
    }
     
    if (obj instanceof Array) {
      for (var i = 0, len = obj.length; i < len; i++) {
        this.insert(obj[i]);
      }
       
      return;
    }
     
    if (this.nodes.length) {
      var index = this.getIndex(obj);
      // Only add the object to a subnode if it can fit completely
      // within one
      if (index != -1) {
        this.nodes[index].insert(obj);
         
        return;
      }
    }
     
    objects.push(obj);
     
    // Prevent infinite splitting
    if (objects.length > maxObjects && level < maxLevels) {
      if (this.nodes[0] == null) {
        this.split();
      }
       
      var i = 0;
      while (i < objects.length) {
         
        var index = this.getIndex(objects[i]);
        if (index != -1) {
          this.nodes[index].insert((objects.splice(i,1))[0]);
        }
        else {
          i++;
        }
      }
    }
  };
   
  /*
   * Determine which node the object belongs to. -1 means
   * object cannot completely fit within a node and is part
   * of the current node
   */
  this.getIndex = function(obj) {
     
    var index = -1;
    var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
    var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
     
    // Object can fit completely within the top quadrant
    var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
    // Object can fit completely within the bottom quandrant
    var bottomQuadrant = (obj.y > horizontalMidpoint);
   
    // Object can fit completely within the left quadrants
    if (obj.x < verticalMidpoint &&
        obj.x + obj.width < verticalMidpoint) {
      if (topQuadrant) {
        index = 1;
      }
      else if (bottomQuadrant) {
        index = 2;
      }
    }
    // Object can fix completely within the right quandrants
    else if (obj.x > verticalMidpoint) {
      if (topQuadrant) {
        index = 0;
      }
      else if (bottomQuadrant) {
        index = 3;
      }
    }
     
    return index;
  };
   
  /*
   * Splits the node into 4 subnodes
   */
  this.split = function() {
    // Bitwise or [html5rocks]
    var subWidth = (this.bounds.width / 2) | 0;
    var subHeight = (this.bounds.height / 2) | 0;
     
    this.nodes[0] = new QuadTree({
      x: this.bounds.x + subWidth,
      y: this.bounds.y,
      width: subWidth,
      height: subHeight
    }, level+1);
    this.nodes[1] = new QuadTree({
      x: this.bounds.x,
      y: this.bounds.y,
      width: subWidth,
      height: subHeight
    }, level+1);
    this.nodes[2] = new QuadTree({
      x: this.bounds.x,
      y: this.bounds.y + subHeight,
      width: subWidth,
      height: subHeight
    }, level+1);
    this.nodes[3] = new QuadTree({
      x: this.bounds.x + subWidth,
      y: this.bounds.y + subHeight,
      width: subWidth,
      height: subHeight
    }, level+1);
  };
}

function distanceMachine(x1, y1, x2, y2) {

  // Distance between 2 balls
  var distanceX = (x2 - x1)*(x2 - x1);
  var distanceY = (y2 - y1)*(y2 - y1);
  var distance = Math.sqrt(( distanceX + distanceY ));

  return distance;

}
/********* added by beeb ***********/
function determineBlinkingBall(obj1, obj2){
  if( (obj1.typeofball == 'blinkingBall') && 
      (obj2.typeofball == 'enemyball' || obj2.typeofball == 'enemyballBig') ){
    return 1;

  }else if((obj2.typeofball == 'blinkingBall') &&
           (obj1.typeofball == 'enemyball' || obj2.typeofball == 'enemyballBig') ){
    return 2;
  
  }else if( (obj1.typeofball == 'blinkingBall' || obj2.typeofball == 'blinkingBall') && 
            (obj1.typeofball == 'mainball' || obj2.typeofball == 'mainball') ){
    console.log('mainball collided with the blinking ball');
    return 3;

  }else{
    return 4;
  }
}

var enemyBallModifiedCounter = 0;
function modifyEnemyBall(thisObj){
  if(enemyBallModifiedCounter != 5){
    thisObj.init(thisObj.x, thisObj.y, imageRepository.enemyballBig);
    enemyBallModifiedCounter++;
  }
  console.log('the no of times blinking ball was modified: ' + enemyBallModifiedCounter);
}

/********* added by beeb ***********/
function collisionDetection(obj1, obj2) {

	var x1 = obj1.x;
	var y1 = obj1.y;

	var x2 = obj2.x;
	var y2 = obj2.y;

  var goodToGo = 0;

  var combinedRadius = obj1.width/2 + obj2.width/2;

	// Distance between 2 balls
  var distance = distanceMachine(obj1.x, obj1.y, obj2.x, obj2.y);

  
	var distanceX = (x2 - x1)*(x2 - x1);
	var distanceY = (y2 - y1)*(y2 - y1);
	var distance = Math.sqrt(( distanceX + distanceY ));

  /*
  Sticky ball solution:
  Check how much each ball overlaps, and then push it back by that amount of pixel. 
  This code will choose a ball to push back instead of pushing both
  */

  // if there is a collision 
 var radian = Math.acos( (distanceX/(distance+1))*Math.PI/180 );
 var overlapDistance = combinedRadius - distance; //+2 is a buffer

 //console.log('overlapdisnace is ' +overlapDistance)

  // Object2 must be on the left side of Object1
  var object1, object2;
  var blinkingFlag;
  //Case 1 & 2: the mainball is attracted to the blinking ball and
  //the blinking ball gets destroyed along with the mainball being modified
  if(overlapDistance > 0){
    //the blinking flag is used to indicate that 2 objects detected are:
    //a blinking ball and an enemy ball
    //blinkingFlag = determineBlinkingBall(obj1, obj2);
    //if(blinkingFlag != 4) console.log('blinkingFlag is: ' + blinkingFlag);
    blinkingFlag = 4;
    switch(blinkingFlag){
      case 1://since obj1 is blinking ball destroy the other
        //console.log('obj2 is: ' + obj2.typeofball + ' and was destroyed');
        game.pool.DeleteObj(obj2);
        modifyEnemyBall(obj1);
        break;

      case 2://since obj2 is blinking ball destroy the other
        //console.log('obj1 is: ' + obj1.typeofball + ' and was destroyed');
        game.pool.DeleteObj(obj1);
        modifyEnemyBall(obj2);
        break;

      case 3://to destroy the blinking upon collision with the mainball
        if(obj1.typeofball == 'blinkingBall'){
          //console.log('obj1 is: ' + obj1.typeofball + ' and was destroyed after collision with mainball');
          game.pool.DeleteObj(obj1);
          enemyBallModifiedCounter = 0;
        }else{
          //console.log('obj2 is: ' + obj2.typeofball + ' and was destroyed after collision with mainball');
          game.pool.DeleteObj(obj2);
          enemyBallModifiedCounter = 0;
        }
        break;

      case 4://the objects are mainball and enemy balls
        // object 2 at left of object 1
        if(obj2.x < obj1.x){
          object2 = obj2;
          object1 = obj1;
        }else{ // object 2 is at the right, swap it
          object2 = obj1;
          object1 = obj2;
        }
        correction(object1, object2);
        physicsEngine(object1, object2);
        break;
    }//switch case
     
  }//if statement
/*
    // object 2 at left of object 1
    if(obj2.x < obj1.x) {
      object2 = obj2;
      object1 = obj1;
    } else { // object 2 is at the right, swap it
      object2 = obj1;
      object1 = obj2;
    }

    correction(object1, object2);

    physicsEngine(object1, object2);

*/
  //} 


	
	return false;
}




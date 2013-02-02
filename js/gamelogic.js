function CollisionHandler(w,h){
	this.quadTree = new QuadTree({x:0,y:0,width:w, height:h});

	this.subDivide = function(objArr){
		this.quadTree.clear();
		this.quadTree.insert(objArr);
		//alert("" + objArr.length + " " + this.quadTree.level);
		
		var objects = [];
		this.quadTree.getAllObjects(objects);
		//alert(objects.length);
 
		for (var x = 0, len = objects.length; x < len; x++){
			this.quadTree.findObjects(obj = [], objects[x]);
			//alert("" + x + " " +obj.length + obj[0].x);
			for (y = 0, length = obj.length; y < length; y++) {
				for (z = y+1, length = obj.length; z < length; z++) {
					//alert("" + x + " " + y);
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
  var maxObjects = 10;
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

function collisionDetection(obj1, obj2) {
	
	//console.log(game.mainball.x);

	var x1 = obj1.x;
	var y1 = obj1.y;

	var x2 = obj2.x;
	var y2 = obj2.y;
	//alert(""+x1+" "+y1+" "+x2+" "+y2);

//	var x3 = game.enemyball.x;	
//	var y3 = game.enemyball.y;

	// Distance 1 (between mainball and mainball2)
	var distance1X = (x2 - x1)*(x2 - x1);
	var distance1Y = (y2 - y1)*(y2 - y1);
	var distance1 = Math.sqrt(( distance1X + distance1Y ));

	// Distance 2 (between mainball and enemyball)
//	var distance2X = (x3 - x1)*(x3 - x1);
//	var distance2Y = (y3 - y1)*(y3 - y1);
//	var distance2 = Math.sqrt(( distance2X + distance2Y ));

	// Distance 3 (between mainball2 and enemyball)
//	var distance3X = (x3 - x2)*(x3 - x2);
//	var distance3Y = (y3 - y2)*(y3 - y2);
//	var distance3 = Math.sqrt(( distance3X + distance3Y ));

	

//	if( ( distance2 ) < 50) {
		// run in parallel while animate is still running
//		physicsEngine(game.mainball, game.enemyball);

//	}

	if( ( distance1 ) < 50) {
		physicsEngine(obj1, obj2);
		//alert(""+x1+" "+y1+" "+x2+" "+y2);
	}

//	if( ( distance3 ) < 50) {
//		physicsEngine(game.mainball2, game.enemyball);
//	}

	return false;
}


// enemyBall Shooter
function shooterTimer() {

}





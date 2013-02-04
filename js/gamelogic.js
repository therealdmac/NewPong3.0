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

function collisionDetection(obj1, obj2) {

	var x1 = obj1.x;
	var y1 = obj1.y;

	var x2 = obj2.x;
	var y2 = obj2.y;

  var combinedRadius = obj1.width/2 + obj2.width/2;

	// Distance between 2 balls
	var distanceX = (x2 - x1)*(x2 - x1);
	var distanceY = (y2 - y1)*(y2 - y1);
	var distance = Math.sqrt(( distanceX + distanceY ));

  // Check how much it overlaps
  if ( distance < combinedRadius) {

    // clear it
    obj2.context.clearRect(obj2.x, obj2.y, obj2.width, obj2.height);

    var overlapDistance = combinedRadius - distance;
    var radian = Math.acos( (distanceX/distance)*Math.PI/180 );
    //console.log('*****************');  
    //console.log('Radian is ' +radian);  
    //console.log('distanceX/distance is ' +distanceX/distance);  
    var moveX = overlapDistance*Math.cos(radian);
    var moveY = overlapDistance*Math.sin(radian);

    /*
    console.log('Object 1 is ' +obj1.typeofball);
    console.log('Object 2 is ' +obj2.typeofball);
    console.log('Total distance is ' +distance);
    console.log('Overlap Distance is ' +overlapDistance);  
    console.log('MoveX is ' +moveX); 
    console.log('MoveY is ' +moveY); 
    */
    if(y2 > y1) {
      moveY = -moveY;
    }

    //console.log('obj2 x is ' +obj2.x);
    //console.log('obj2 y is ' +obj2.y);

    obj2.x = obj2.x - moveX;
    obj2.y = obj2.y - moveY;

    //console.log('new obj2 x is ' +obj2.x);
    //console.log('new obj2 y is ' +obj2.y);

    /*
    obj2.context.fillStyle="#FFFF00";
    obj2.context.fillRect(obj2.x+obj2.width/2,obj2.y+obj2.height/2,2,2); */

    obj2.draw();

    
  }

  
  //  console.log

	if( overlapDistance) {
    //alert('colided');
		physicsEngine(obj1, obj2);
	}
	
	return false;
}
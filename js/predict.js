console.log('predict was created');

function BinaryHeap(){
  this.content = [];
  this.scoreFunction = function(pair){
	return -pair.time;
	}
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    element.heapID = content.length;
	this.content.push(element);
	// Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
	  end.heapID = -1;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i] == node) {
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
		end.heapID = -1;
        if (i != len - 1) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node))
            this.bubbleUp(i);
          else
            this.sinkDown(i);
        }
        return;
      }
    }
    throw new Error("Node not found.");
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];
		  this.content[parentN].heapID = parentN;
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN].heapID = parentN;
        this.content[n].heapID = n;
        
		
		this.content[parentN] = element;
        this.content[n] = parent;
		// Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to move it further.
      else {
        break;
      }
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap != null) {
        this.content[n].heapID = n;
        this.content[swap].heapID = swap;
        
		this.content[n] = this.content[swap];
        this.content[swap] = element;
		n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  },
  
  heapSort: function()
    {
      var temp;

      for (var i = (this.size() / 2)-1; i >= 0; i--)
        this.siftDown(i, this.size());

      for (var i = this.size()-1; i >= 1; i--)
      {
		temp.heapID = this.content[0].heapID;
        this.content[0].heapID = this.contents[i].heapID;
        this.content[i].heapID = temp.heapID;
        
        temp = this.content[0];
        this.content[0] = this.content[i];
        this.content[i] = temp;
		this.siftDown(0, i-1);
      }
    },
	
	siftDown: function(root, bottom){
		var done, maxChild, temp;

	done = 0;
	while ((root*2 <= bottom) && (!done))
	{
		if (root*2 == bottom)
			maxChild = root * 2;
		else if (numbers[root * 2] > numbers[root * 2 + 1])
			maxChild = root * 2;
		else
			maxChild = root * 2 + 1;

    if (this.content[root] < this.content[maxChild])
    {
      temp = this.content[root];
      this.content[root] = this.content[maxChild];
      this.content[maxChild] = temp;
      root = maxChild;
    }
    else
      done = 1;
  }
}
};

var priority = new BinaryHeap();

function processPairs(pair1, pair2) {
	console.log("asdfsafds" + pair1.obj1.x);
	var pairFlag = pair1.compare(pair2);
	// Pair 1 is the new pair that may be pushed into the heap
	// Pair 2 is the pair in the heap currently being compared against
	switch(pairFlag){
	case 0: // Object ids in the pairs are an exact match
		pair2.decrement(cycleCheck());
	case 1: // Only one object id in the pair are a match
		if(pair1.colTime > pair2.colTime){
			// Reject the new pair			
		}
		else if(pair1.colTime < pair2.colTime){
			// Delete the pair in the queue
			// Push the new pair into the heap
			// Call physics engine
			priority.remove(pair2);
			priority.push(pair1);
			physicsEngine(pair1.obj1, pair1.obj2);		
		}
	case 2: // No matches
		// Push the new pair into the heap
		// Call physics engine
		priority.push(pair1);
		physicsEngine(pair1.obj1, pair1.obj2);
	}
}

function Pair(obj1,obj2){
	this.obj1 = obj1;
	this.obj2 = obj2;
	this.heapID = -1;
	
	this.computeCollisionLocation = function(){
		
		var location1 = []; //0 for x axis value, 1 for y axis value
		
		location1[0] = 100;
		location1[1] = 100;
		
		
		return location1; //Need only one ball's location
	}
	
	this.computeCollisionTime = function() {
		
		var coldistance = Math.sqrt((obj1.x - location[0])*(obj1.x - location[0]) 
						          + (obj1.y - location[1])*(obj1.y - location[1]));
		var colspeed = Math.sqrt(obj1.speedX*obj1.speedX + obj1.speedY*obj1.speedY);
		var coltime = coldistance / colspeed;
	
		return coltime;
	}
	
	this.colTime = this.computeCollisionTime();
	
	
	this.decrementTime = function(frameRate) {
		this.colTime -= frameRate;
	}
	
	this.compare = function(pair) {
		if(this.obj1.id == pair.obj1.id && this.obj2.id == pair.obj2.id)
			return 0;
		if(this.obj1.id == pair.obj1.id || this.obj1.id == pair.obj2.id)
			return 1;
		if(this.obj2.id == pair.obj1.id || this.obj2.id == pair.obj2.id)
			return 1;
		return 2;
	}
	
	//Newly computed trajectory
	this.obj1newSpeedX = 0;
	this.obj1newSpeedY = 0;
	this.obj2newSpeedX = 0;
	this.obj2newSpeedY = 0;
	
	//this.obj1ExpectedCollisionX = obj1.x+obj1newSpeedX*n;
	//this.obj1ExpectedCollisionY = obj1.y+obj1newSpeedY*n;
	
	//Update Expected Distance at new frame
	//this.updateDistance(){
	//	distance -= decrement;
	//}
	
	//Checks if ball has completed the collision course
	//i.e. not deflected by the wall or other balls
	//this.collisionSuccess(buffer){
	//	if(this.obj1ExpectedCollisionX > this.obj1.x - buffer &&
	//		this.obj1ExpectedCollisionX < this.obj1.x + buffer &&
	//		this.obj1ExpectedCollisionY > this.obj1.y - buffer &&
	//		this.obj1ExpectedCollisionY < this.obj1.y + buffer)
	//		 
	//		 return true;
	//	else
	//		return false;
	//}
}
var currPair;
function setPriority(obj1,obj2){
	
	currPair = new Pair(obj1, obj2);
	//console.log(obj1.x);
	priority.heapSort();
	for(var i=0; i<priority.size(); i++){
		processPairs(currPair, priority.content[i])
	}		
}
console.log('correction was created');

function correction(obj1,obj2, overlapDistance, radian) {

	// obj2 is the object on the left



	if(typeof(obj1) === "undefined" ||
	 		  typeof(obj2) === "undefined" ){
	 	//console.log('object is undefined');
	 }else{
	 	//obj1.clipImg();
	    
	 	//if obj2 is on the left

	 	
		var x1 = obj1.x;
		var y1 = obj1.y;

		var x2 = obj2.x;
		var y2 = obj2.y;

		var distanceX = (x2 - x1)*(x2 - x1);
		var distanceY = (y2 - y1)*(y2 - y1);
		var distance = Math.sqrt(( distanceX + distanceY ));

		var combinedRadius = obj1.width/2 + obj2.width/2;
		var overlapDistance = combinedRadius - distance; //+2 is a buffer

	      //console.log('overlapped');


	      var radian = Math.acos( (distanceX/(distance+1))*Math.PI/180 );

	      var moveX = overlapDistance*Math.cos(radian)+5;
	      var moveY = overlapDistance*Math.sin(radian)+5;

	      if(y2 < y1) {
	        moveY = -moveY;
	      }

	    //  console.log('moveX is ' +moveX);
	    //  console.log('moveY is ' +moveY);

	   // alert('getting ready to be clipped');
	  // alert('ready to be clipped');
	   obj2.clipImg();

	    obj1.clipImg();

	    obj2.x = obj2.x - moveX/2;
	    obj2.y = obj2.y + moveY/2;
	    

	    obj1.x = obj1.x + moveX/2;
	    obj1.y = obj1.y - moveY/2;
	   // alert('object2 clipped');
	    
	     
		

	    
	    

	    

	    		


		


/*
	    for(var i=0; i >= moveX; i = i+0.01) {
	    	obj2.x = obj2.x - (i);
	    }

	    if(moveY < 0) { // move up
			for(var i=0; i <= moveY; i = i-0.01) {
		    	obj2.y = obj2.y + (i);
		    }
	    } else { // move down
	    	for(var i=0; i >= moveY; i = i+0.01) {
		    	obj2.y = obj2.y + (i);
		    }
	    } */
	    
	      

	      obj2.draw(); 
	      // console.log('correction activated');
	}

}
function correction(obj1,obj2) {

	var x1 = obj1.x;
	var y1 = obj1.y;

	var x2 = obj2.x;
	var y2 = obj2.y;

	var distanceX = (x2 - x1)*(x2 - x1);
	var distanceY = (y2 - y1)*(y2 - y1);
	var distance = Math.sqrt(( distanceX + distanceY ));

	var combinedRadius = obj1.width/2 + obj2.width/2;
	var overlapDistance = combinedRadius - distance; //+2 is a buffer

	if(typeof(obj1) === "undefined" ||
	 		  typeof(obj2) === "undefined" ){
	 	//console.log('object is undefined');
	 }else{

	      //console.log('overlapped');
	      obj2.clip();

	      var radian = Math.acos( (distanceX/(distance+1))*Math.PI/180 );

	      var moveX = overlapDistance*Math.cos(radian);
	      var moveY = overlapDistance*Math.sin(radian);

	      if(y2 > y1) {
	        moveY = -moveY;
	      }

	      obj2.x = obj2.x - moveX;
	      obj2.y = obj2.y - moveY;

	      obj2.draw(); 
	}

}
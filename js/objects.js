//Tracks the total number of balls generated at any time
var counter = 0;
var paddleTiltedDegree = 0;
var paddleTiltedInRadians = 0;
/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */

function Drawable() {

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
		
	this.init = function(x, y, image) {
		// Defualt variables
		this.x = x;
		this.y = y;
		if(image)
			this.image = image;
		else
			this.image = imageRepository.errorimg; //default image
		this.width = this.image.width;
		this.height = this.image.height;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
	this.move = function() {
	};
}

  /**
 * Object Pool class
 */

 function ObjectPool(m) {
	
	this.maxSize = m;
	this.allObj = [];
	this.num = [];
	var objCount = 0;
	
	this.CreateObj = function(i){
		
		var newObj = CreateObjects(i);
		this.allObj.push(newObj);
		counter++;
		newObj.index = objCount;
		objCount++;
		newObj.id = objCount;
		this.num.push(counter);
		return newObj;
	}
	this.DeleteObjByIndex = function(i){
		if(i>=this.allObj.length || i<0){
			alert("No object found!");
			return;
		}
		this.allObj[i].clipImg();
		this.allObj.splice(i,1);
		this.num.splice(i,1);
		
		for(var j=i; j<this.allObj.length; j++)
			this.allObj[j].index = j;
		objCount--;
	}

	this.DeleteObj = function(obj){
		this.DeleteObjByIndex(obj.index);
	}

	this.draw = function(i){
		for(var i=0; i<this.allObj.length; i++){
			//alert(""+this.allObj[i].x + " " + this.allObj[i].y);
			this.allObj[i].draw();
		}
	}

	this.animate = function(i){
		for(var i=0; i<this.allObj.length; i++){
			//this.allObj[i].move();
			//debugContext.clearRect(this.allObj[i].x-15, this.allObj[i].y-30, 50 ,50 );
			if(debugFlag){
				//alert(""+this.allObj[i].x + " " + this.allObj[i].y);
				debugContext.font="20px Arial";
				debugContext.fillStyle = 'yellow';
				debugContext.fillText(this.num[i], this.allObj[i].x, this.allObj[i].y);
				this.allObj[i].drawArrow();
			}
		}
		this.draw();
	}
 }

	function CreateObjects(i) {
		switch(i){
		case 1:
			return new Enemyball();
			break;
		case 0:
			return new Mainball();
			break;
		/******* added by beeb **************/
		
		case 3:
			return new BlinkingBall();
			break;
		/******** added by beeb *************/
		}		
	}

/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background" canvas 
 */
function Background() {

	// Implement abstract function
	this.draw = function() {
		// Pan background
		//this.y += this.speed;
		this.context.drawImage(this.image, this.x, this.y);
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();



/*
 *
 * Create the Paddle object that the player controls. The paddle is
 * drawn on the "paddle" canvas and uses dirty rectangles to move
 * around the screen.
 */
 	var upkeyDetect = 0;
	var downKeyDetect = 0;
	var leftKeyDetect = 0;
	var rightKeyDetect = 0;
	var spaceKeyDetect = 0;

function Paddle(){

	this.speed = 10;

	/******************** added by beeb **************/
	this.paddleIsInTheRightRegionOfCanvas = false;
	this.paddleIsInTheLeftRegionOfCanvas = false;
	this.paddleRegion = null;
	this.xRight = 0;
	this.yRight = 0;
	/******************** added by beeb **************/

	this.draw = function(){
		//need to establish the center (x,y) of the new location the image is to be drawn &
		//the angle to rotate has to be in radians
		if(paddleTiltedDegree != 0){
			this.context.clearRect(0, 0, paddle.width, paddle.height);//to clear the canvas
			this.context.save();
			this.context.translate(this.x, this.y);
			this.context.translate(this.width/2, this.height/2);
			this.context.rotate(paddleTiltedInRadians);
			this.context.drawImage(this.image, -this.width/2, -this.height/2);
			this.context.restore();
		}else{
			this.context.clearRect(0, 0, paddle.width, paddle.height);
			this.context.drawImage(this.image, this.x, this.y);
		}
		//this.context.drawImage(this.image, this.x, this.y, this.xRight, this.yRight);
	};

	//by vic: "up" is clockwise, "down" is anticlockwise
	this.tiltPaddle = function(paddleCenterPointXCoordinate, paddleCenterPointYCoordinate, paddleTiltedDegree) {
	/* Required input: x and y coordinates of center of paddle, 
	 * degree of tilt of paddle (negative value = " / "; positive value = " \ ")
	 * Angles in radians
	 * Remember to make sure the player can't un-tilt the paddle 
	 * if the tilted paddle is touching the wall
	 */
	//console.log('paddleCenterPointXCoordinate is: ' + paddleCenterPointXCoordinate);
	//console.log('paddleCenterPointYCoordinate is: ' + paddleCenterPointYCoordinate);
	console.log('paddleTiltedDegree is: ' + paddleTiltedDegree);

	var xDistanceFromCenterOfPaddle, yDistanceFromCenterOfPaddle;
	var paddleLeftMostPointXCoordinate, paddleLeftMostPointYCoordinate;
	var paddleRightMostPointXCoordinate, paddleRightMostPointYCoordinate;
	
	//Special case: paddleTiltedDegree = 0
		if(paddleTiltedDegree == 0){
			paddleLeftMostPointXCoordinate = paddleCenterPointXCoordinate - paddle.width;
			paddleLeftMostPointYCoordinate = paddleCenterPointYCoordinate;
			paddleRightMostPointXCoordinate = paddleCenterPointXCoordinate + paddle.width;
			paddleRightMostPointYCoordinate = paddleCenterPointYCoordinate;
		}else{
			//Calculate x and y distance of leftmost point on paddle 
			//from the center of paddle
			xDistanceFromCenterOfPaddle = paddle.width * Math.cos(paddleTiltedDegree);
			yDistanceFromCenterOfPaddle = paddle.width * Math.sin(paddleTiltedDegree);
		
			//Obtain new coordinates of leftmost point on paddle
			paddle.x = paddleCenterPointXCoordinate - xDistanceFromCenterOfPaddle;
			paddle.y = paddleCenterPointYCoordinate + yDistanceFromCenterOfPaddle;
	
			//console.log('paddle x left after tilting is: ' + paddle.x);//for testing
			//console.log('paddle y left after tilting is: ' + paddle.y);
			//Obtain new coordinates of rightmost point on paddle
			paddle.xRight = paddleCenterPointXCoordinate + xDistanceFromCenterOfPaddle;
			paddle.yRight = paddleCenterPointYCoordinate - xDistanceFromCenterOfPaddle;

			//console.log('paddle x right after tilting is: ' + paddle.xRight);
			//console.log('paddle y right after tilitng is: ' + paddle.yRight);

		}
	}//tiltPaddle

	this.move = function(){	
	// Determine if there was a move action and if he paddle moved,
	// erase it's current image so it can be redrawn in it's new location
	if (KEY_STATUS.left || KEY_STATUS.right ){//|| KEY_STATUS.up || KEY_STATUS.down){
		this.context.clearRect(this.x, this.y, this.width, this.height);
		
		if (KEY_STATUS.left) {
			this.x -= this.speed;
			// Keep player within the screen
			if (this.x <= 0) 
				this.x = 0;

		}else if(KEY_STATUS.right){
			this.x += this.speed;
			if (this.x >= this.canvasWidth - this.width)
				this.x = this.canvasWidth - this.width;
		}
		// Finish by redrawing the paddle
		this.draw();
	}//key detecting if statement..

	if(KEY_STATUS.space){
		console.log("Game time: " + gameTime + "; Press time: " + pressspacetime + "\n");
	}
		
	if(KEY_STATUS.space && ((gameTime - pressspacetime) > 50 || pressspacetime == 0) ){
		//alert("asdf");
		console.log('up key detected count is: ' + spaceKeyDetect);
		pressspacetime = gameTime;
		var newball = game.pool.CreateObj(1);
		newball.init(this.x + (this.width / 2),
					 this.y + (this.width / 2), 
					 imageRepository.mainball);
		newball.speedX = 0;
		newball.speedY = -2.0;
	}
		
	if(KEY_STATUS.up && ((gameTime - pressspacetime) > 50 || pressspacetime == 0) ){
		//alert("up");
		console.log('up key detected count is: ' + upkeyDetect++);
		pressspacetime = gameTime;
				if(paddleTiltedDegree != 45){
					paddleTiltedDegree += 15;
					paddleTiltedInRadians = degreeToRadian(paddleTiltedDegree);
					this.tiltPaddle(this.x + (this.width / 2),
									this.y + (this.width / 2),
									paddleTiltedDegree);
				//	console.log('the current paddle tilted degree is: ' + paddleTiltedDegree);
				}
			//}
		//this.draw();
	}
	if(KEY_STATUS.down && ((gameTime - pressdowntime) > 50 || pressdowntime == 0) ){
		//alert("down");
		console.log('down key detected count is: ' + downKeyDetect++);
		pressdowntime = gameTime;
		if(paddleTiltedDegree != -45){
				paddleTiltedDegree -= 15;
				paddleTiltedInRadians = degreeToRadian(paddleTiltedDegree);
				this.tiltPaddle(this.x + (this.width / 2),
						   		this.y + (this.width / 2),
						   		paddleTiltedDegree);
			//console.log('the current paddle titlted degree is: ' + paddleTiltedDegree);
		}
		//this.draw();
	}

	};//move function
	
var pressspacetime = 0;
var pressuptime = 0;
var pressdowntime = 0;

}
Paddle.prototype = new Drawable();

/********** added by beeb *************/
function sin(x) {
    return Math.sin(x / 180 * Math.PI);
}

function cos(x) {
    return Math.cos(x / 180 * Math.PI);
}
function degreeToRadian(thisAngle){
	return thisAngle * 0.0174532925199432957;
}
/********** added by beeb *************/
function Shooter() {

	this.enemyballPool = 30;

	this.speed = 2;

	this.draw = function() {

		// clear current image
		this.context.clearRect(this.x, this.y, this.width, this.height);

		// move according to speed's direction
		this.x += this.speed;

		if (this.x < 10) {
			this.speed = -this.speed;
		} else if (this.x >= this.canvasWidth - this.width) {
			this.speed = -this.speed;
		}

		this.context.drawImage(this.image, this.x, this.y);
	};

	this.shoot = function() {

		var enemyStartX = game.shooter.x,
			enemyStartY = game.shooter.y;


		if (enemyballPoolonScreen < this.enemyballPool) {

			this.createdEnemyBall = game.pool.CreateObj(1);
			this.createdEnemyBall.typeofball = 'enemyball';
			this.createdEnemyBall.init(enemyStartX, enemyStartY, imageRepository.enemyball);
			
			enemyballPoolonScreen++;

		}
		//console.log('no. of enemyball on screen = ' +enemyballPoolonScreen);

	}

	this.shootBig = function() {

		var enemyStartX = game.shooter.x,
			enemyStartY = game.shooter.y;


		if (enemyballPoolonScreen < this.enemyballPool) {

			this.createdEnemyBall = game.pool.CreateObj(1);
			this.createdEnemyBall.mass = 5;
			this.createdEnemyBall.typeofball = 'enemyballBig';
			this.createdEnemyBall.init(enemyStartX, enemyStartY, imageRepository.enemyballBig);

			enemyballPoolonScreen++;

		}
		
	}

	//************ added by beeb ****************
	/*
	 * Objective of doing this: create the blinking ball,
	 * assign a speed to it, should be created only once now,
	 * call the manipulator to "attract" the mainball to this blinking ball 
	 * and increase the mainballs mass
	 */

	this.shootBlinkingBall = function() {

		var enemyStartX = game.shooter.x,
			enemyStartY = game.shooter.y;

		this.createdBlinkingBall = game.pool.CreateObj(1);

		this.createdBlinkingBall.mass = 10;
		this.createdBlinkingBall.typeofball = 'blinkingBall';
		this.createdBlinkingBall.init(enemyStartX, enemyStartY, imageRepository.blinkingBall);

		enemyballPoolonScreen++;
		blinkingballPool++;



	}
	
}
Shooter.prototype = new Drawable();

/**
 * Ball class
 */
 
function Ball() {

 	//this.radius = 0;
 	//this.centerX = 0;
 	//this.centerY = 0;
 	//this.direction = 0;

 	this.index = -1;
	this.id = -1;
	this.speed = 5;
	this.speedX = this.speed;
	this.speedY = this.speed;
	
	this.pWidth = this.width + 100;
	this.pHeight = this.height + 100;
	this.pX = this.x - (this.pWidth-this.width)/2;
	this.pY = this.y - (this.pHeight-this.height)/2;

	this.typeofball = null;

	// clip the ball into a perfect circle shape
	this.clipImg = function() {
    	this.context.save();
		this.context.beginPath();
		this.context.arc(this.x+this.width/2,this.y+this.height/2,this.height/2, 0, 2*Math.PI,true);
		this.context.fill();
		this.context.closePath();		
		this.context.clip();
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.context.restore();
    }
	
	this.drawArrow = function(){
		debugContext.save();
		debugContext.translate(this.x+this.width/2, this.y+this.height/2+imageRepository.arrow.height/2);
		debugContext.rotate(Math.atan2(this.speedY, this.speedX));
		debugContext.drawImage(imageRepository.arrow,0,0);
		debugContext.restore();
	}
	
    this.boundaryXCollision = function() {

    	// X Collision
	    if (this.x <= this.leftEdge) {       
	    	this.speedX = this.speed;
	    	this.collidedwithleftEdge = true;
	    	this.collidedwithrightEdge = false;
	    	//this.friction();   
	    }     
	    else if (this.x >= this.rightEdge - this.width) {
	      	this.speedX = -this.speed;  
	      	this.collidedwithleftEdge = false;
	    	this.collidedwithrightEdge = true;
	      //this.friction();   
	    }
    }

    this.boundaryYCollision = function() {

    }

    /******** added by beeb *******/
    this.ballRegion = function(){
    	
    }
    /******** added by beeb *******/
    this.gravity = function() {
    	if(this.speedY < 1 ) {
    		this.speedY += 1.1;
    	} 
    	//this.speedY += 0.5;
    }
    

}
Ball.prototype = new Drawable();


/**
 * Create the Main Ball object that the player controls. The Main Ball is
 * drawn on the "main" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Mainball() {

	this.collisionCounter = 0;
 	
    this.leftEdge = 0;
    this.rightEdge = this.canvasWidth;
    this.topEdge = 0;
    this.bottomEdge = this.canvasHeight;
	this.image = imageRepository.mainball;

    this.mass = 5;
    this.typeofball = 'mainball';
    
    this.ballRegion = null;
    this.ballMovingDown = false;
    this.ballMovingRight = false;

	this.collidedwithleftEdge = null;
	this.collidedwithrightEdge = null;
	
    //Move the main ball
	this.draw = function() {

		this.collidedwithleftEdge = false;
		this.collidedwithrightEdge = false;
		
		this.clipImg();

	    this.x += this.speedX;
	    this.y += this.speedY;
	    
	    this.boundaryXCollision();
	    this.boundaryYCollision();

		this.context.drawImage(this.image, this.x, this.y);

	};

	this.boundaryYCollision = function() {


    	//this.gravity(); 
    	// Y Collision
	    if (this.y >= this.bottomEdge - this.height - 16 - 50) {

	    	// if hits paddle
	    	if ( (this.x + 25 > game.paddle.x && this.x < game.paddle.x + 64) ){
	    		//if paddle tilted trajectory changes
	    		if(paddleTiltedDegree != 0){
	    			console.log('called the ball hit trajectory function');
	    			console.log('sent this parameters: ' + paddleTiltedDegree); 
	    			console.log('paddle.x is:  ' + paddle.x);
	    			console.log('paddle.y is: ' + paddle.y); 
	    			console.log('paddle.x right is: ' + paddle.x + 64);
	    			console.log('paddle.y right is: ' + paddle.y + 16);
	    			console.log('mainball.speedX is: ' + this.speedX);
	    			console.log('mainball.speedY is: ' + this.speedY);
	    			ballHitPaddleTrajectory(paddleTiltedDegree,
	    									paddle.x,
	    									paddle.y,
	    									paddle.x + 64,
	    									paddle.y + 16,
	    									this.speedX,
	    									this.speedY);
	    		}else{
	    			//paddle not tilted thus a normal reflection
	    			this.speedY = -this.speed; // reverse speed
	    		}
	    	}
	    	else {
	    		this.speedY = -this.speed;
	    		//restartGame();
	    	}
	    		 
	    		// temporary hold
	    		//restartGame();
	    } else if (this.y <= this.topEdge) { // if hit the top
	    	this.speedY = this.speed;
	    	
	    }
    }
	

}
Mainball.prototype = new Ball();

//added by vic
function ballHitPaddleTrajectory(paddleTiltedDegree, 
								 paddleLeftMostPointXCoordinate, 
								 paddleLeftMostPointYCoordinate, 
								 paddleRightMostPointXCoordinate, 
								 paddleRightMostPointYCoordinate, 
								 xVelocityOfBall, 
								 yVelocityOfBall) {
	console.log('inside ball hit trajectory function');
	//Required input: degree of tilt of paddle, x and y coordinates of 2 points on the paddle, x and y velocity of ball
	
	var tangentXVector, tangentYVector, unitTangentXVector, unitTangentYVector, unitNormalXVector, unitNormalYVector;
	var normalScalarVelocityOfBall, tangentScalarVelocityOfBall;
	var normalXVectorVelocityOfBall, normalYVectorVelocityOfBall, tangentXVectorVelocityOfBall, tangentYVectorVelocityOfBall;
	//var newXVelocityOfBall, newYVelocityOfBall;
	
	/*//Special case: paddleTiltedDegree = 0
	if(paddleTiltedDegree == 0){
		newXVelocityOfBall = xVelocityOfBall;
		newYVelocityOfBall = -yVelocityOfBall;
	}*/

	//Find unit normal and unit tangent vectors
	tangentXVector = paddleRightMostPointXCoordinate - paddleLeftMostPointXCoordinate;
	tangentYVector = paddleRightMostPointYCoordinate - paddleLeftMostPointYCoordinate;
	unitTangentXVector = tangentXVector / Math.sqrt(tangentXVector * tangentXVector + tangentYVector * tangentYVector);
	unitTangentYVector = tangentYVector / Math.sqrt(tangentXVector * tangentXVector + tangentYVector * tangentYVector);
	unitNormalXVector = unitTangentYVector;
	unitNormalYVector = -unitTangentXVector;
	
	//Resolve velocity of ball into normal and tangential components
	normalScalarVelocityOfBall = unitNormalXVector * xVelocityOfBall + unitNormalYVector * yVelocityOfBall;
	tangentScalarVelocityOfBall = unitTangentXVector * xVelocityOfBall + unitTangentYVector * yVelocityOfBall;
	
	//Convert scalar normal and tangential velocities into vectors
	normalXVectorVelocityOfBall = normalScalarVelocityOfBall * unitNormalXVector;
	normalYVectorVelocityOfBall = normalScalarVelocityOfBall * unitNormalYVector;
	tangentXVectorVelocityOfBall = tangentScalarVelocityOfBall * unitTangentXVector;
	tangentYVectorVelocityOfBall = tangentScalarVelocityOfBall * unitTangentYVector;
	
	//Reverse ball's normal velocity
	normalXVectorVelocityOfBall = -normalXVectorVelocityOfBall;
	normalYVectorVelocityOfBall = -normalYVectorVelocityOfBall;
	
	//Find final velocity vectors
	this.speedX = normalXVectorVelocityOfBall + tangentXVectorVelocityOfBall;
	this.speedY = normalYVectorVelocityOfBall + tangentYVectorVelocityOfBall;
	console.log();
	
}


function Enemyball() {
	
    this.leftEdge = 0;
    this.rightEdge = this.canvasWidth;
    this.topEdge = 0;
    this.bottomEdge = this.canvasHeight;
	//this.image = imageRepository.enemyball;

    this.mass = 3;
    this.speedX = Math.random();
    this.typeofball = null;

    //********** added by beeb ***********
    this.ballRegion = null;
    //********** added by beeb ***********
	//Move the main ball
	this.draw = function() {
		
		this.clipImg();

	    this.x += this.speedX;
	    this.y += this.speedY;

	    this.boundaryXCollision();
	    this.boundaryYCollision();

	    //this.friction();

		this.context.drawImage(this.image, this.x, this.y);

/*
		this.context.fillStyle="#FF0000";
		this.context.fillRect(this.x+this.width/2,this.y+this.height/2,2,2); */

	};

	this.boundaryYCollision = function() {

    	// Y Collision
	    if (this.y >= this.bottomEdge - this.height - 16 - 50) {

	    	// if hits paddle
	    	if (this.x + 25 > game.paddle.x && this.x < game.paddle.x + 64)
	    		this.speedY = -this.speed; // reverse speed
	    		//game.pool.DeleteObj(this);//this causes the obj to freeze upon collision with the paddle

	    	else if (this.y > this.bottomEdge) {
	    		// temporary - make it bounce for easier debug
	    		// this.speedY = -this.speed;
	    		// actual CODE to delete object
	    		enemyballPoolonScreen--;

	    		if(this.typeofball == 'blinkingBall') {
	    			blinkingballPool--;
	    		}
	    		 game.pool.DeleteObj(this);
	    		//update enemyball 
	    		
	    		//console.log('enemyball on screen is ' +enemyballPoolonScreen);
	    		
	    	}
	    		 
	    		// temporary hold
	    		//restartGame();
	    }else if (this.y <= this.topEdge) { // if hit the top
	    	this.speedY = this.speed;
	    	
	    }
    }


}
Enemyball.prototype = new Ball();

Array.prototype.clear = function() {
    this.splice(0, this.length);
};


/*

// save the context's co-ordinate system before 
// we screw with it
context.save(); 
 
// move the origin to 50, 35   
context.translate(50, 35); 
 
// now move across and down half the 
// width and height of the image (which is 128 x 128)
context.translate(64, 64); 
 
// rotate around this point
context.rotate(0.5); 
 
// then draw the image back and up
context.drawImage(logoImage, -64, -64); 
 
// and restore the co-ordinate system to its default
// top left origin with no rotation
context.restore();

*/


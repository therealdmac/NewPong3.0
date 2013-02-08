//Tracks the total number of balls generated at any time
var counter = 0;

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
		this.num.push(counter);
		return newObj;
	}
	this.DeleteObjByIndex = function(i){
		this.allObj.splice(i,1);
		this.num.splice(i,1);
		//objCount--;
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



/**
 * Create the Paddle object that the player controls. The paddle is
 * drawn on the "paddle" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Paddle() {

	this.speed = 10;

	/******************** added by beeb **************/
	this.paddleIsInTheRightRegionOfCanvas = false;
	this.paddleIsInTheLeftRegionOfCanvas = false;
	this.paddleRegion = null;
	/******************** added by beeb **************/

	this.draw = function() {
		this.context.drawImage(this.image, this.x, this.y);
	};

	this.move = function() {	

	//added by beeb 
	this.paddleTiltedDegree = 0;
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right) {
			// The paddle moved, so erase it's current image so it can be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);

			// detect keypress
			if (KEY_STATUS.left) {
				this.x -= this.speed;
				// Keep player within the screen
				if (this.x <= 0) 
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed;
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			/********* added by beeb ***********/
			}else if(KEY_STATUS.up){
				if(paddleTiltedDegree != 45){
					paddleTiltedDegree += 15;
					tiltPaddle("up");
				}
			}else if(KEY_STATUS.down){
				if(paddleTiltedDegree != 0){
					paddleTiltedDegree -= 15;
					this.paddle.y
					tiltPaddle("down");
				}
			}
			/********* added by beeb ***********/
			// Finish by redrawing the paddle
			this.draw();
		}
	};
}
Paddle.prototype = new Drawable();
/********** added by beeb *************/
Paddle.prototype.tiltPaddle = function(keyCode){
	if(keyCode == "up"){
		rotatePaddle();
	}else if(keyCode == "down"){
		rotatePaddle();
	}
}
function sin(x) {
    return Math.sin(x / 180 * Math.PI);
}

function cos(x) {
    return Math.cos(x / 180 * Math.PI);
}
function rotatePaddle(){
	this.x += (cos (15) * this.x) + (sin (15) * this.y);
	this.y += (sin (15) * this.x) + (cos (15) * this.y);
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
			this.createdEnemyBall.init(enemyStartX, enemyStartY, imageRepository.enemyballBig);

			enemyballPoolonScreen++;

			//console.log('x coordinate of enemyBigBall is ' +this.createdEnemyBall.x)

		}
		// console.log('no. of enemyball on screen = ' +enemyballPoolonScreen);
	}

	//************ added by beeb ****************
	/*
	 * Objective of doing this: create the blinking ball,
	 * assign a speed to it, should be created only once now,
	 * call the manipulator to "attract" the mainball to this blinking ball 
	 * and increase the mainballs mass
	 */

	this.shootBlinkingBall = function() {
		var blinkingBallStartX = game.shooter.x,
			blinkingBallStartY = game.shooter.y;
		//Should only create one blinking ball for now..
		if(blinkingBall < 2){
			//blinlking ball is '3'rd in terms of creating the ball.
			this.createdBlinkingBall = game.pool.CreateObj(3);
			this.createdBlinkingBall.init(blinkingBallStartX, 
										  blinkingBallStartY, 
										  imageRepository.enemyballBig.width, 
										  imageRepository.enemyballBig.height);

			//console.log('inside shooter function x is ' +this.createdBlinkingBall.x);
		}
		console.log('no of blinking ball on screen: ' + blinkingBall);
	}
	//************ added by beeb ****************
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
	this.speed = 4;
	this.speedX = this.speed;
	this.speedY = this.speed;

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

	    //this.gravity();

	    

		this.context.drawImage(this.image, this.x, this.y);
		/*
		this.context.fillStyle="#FF0000";
		this.context.fillRect(this.x+this.width/2,this.y+this.height/2,2,2);
		*/

		//console.log('collide with right: ' +this.collidedwithrightEdge);
		//console.log('collide with left: ' +this.collidedwithleftEdge);
	};

	this.boundaryYCollision = function() {


    	//this.gravity(); 
    	// Y Collision
	    if (this.y >= this.bottomEdge - this.height - 16) {

	    	// if hits paddle
	    	if (this.x + 25 > game.paddle.x && this.x < game.paddle.x + 64)
	    		this.speedY = -this.speed; // reverse speed
	    	else {
	    		this.speedY = -this.speed;
	    	}
	    		 
	    		// temporary hold
	    		//restartGame();
	    } else if (this.y <= this.topEdge) { // if hit the top
	    	this.speedY = this.speed;
	    	
	    }
    }
	

}
Mainball.prototype = new Ball();


function Enemyball() {
	
    this.leftEdge = 0;
    this.rightEdge = this.canvasWidth;
    this.topEdge = 0;
    this.bottomEdge = this.canvasHeight;
	this.image = imageRepository.enemyball;

    this.mass = 3;
    this.speedX = Math.random();
    this.typeofball = 'enemyball';

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


    	//this.gravity(); 
    	// Y Collision
	    if (this.y >= this.bottomEdge - this.height - 16) {

	    	// if hits paddle
	    	if (this.x + 25 > game.paddle.x && this.x < game.paddle.x + 64)
	    		this.speedY = -this.speed; // reverse speed
	    	else {
	    		 this.speedY = -this.speed;
	    		// alert('object is about to be deleted');
	    		//destroyBall();
	    		// game.pool.DeleteObj(this);
	    		// alert('delete object done');
	    	}
	    		 
	    		// temporary hold
	    		//restartGame();
	    } else if (this.y <= this.topEdge) { // if hit the top
	    	this.speedY = this.speed;
	    	
	    }
    }


}
Enemyball.prototype = new Ball();

/********** added by beeb *****************/
function BlinkingBall(){
	this.leftEdge = 0;
	this.rightEdge = this.canvasWidth;
	this.topEdge = 0;
	this.bottomEdge = this.canvasHeight;

	this.mass = 5;
	this.speedX = Math.random();
	this.typeofball = 'blinkingball';

	this.draw = function(){
		
		this.clipImg();

		this.x += this.speedX;
		this.y += this.speedY;

		this.boundaryXCollision();
		this.boundaryYCollision();

		//this linr below has been commented out because,
		// there is no image of the blinking ball available
		//so for now use the blinking ball thingy
		this.context.drawImage(imageRepository.enemyballBig, this.x, this.y);
	}
}
BlinkingBall.prototype = new Ball(); //inherit ball properties
 /********** added by beeb *****************/

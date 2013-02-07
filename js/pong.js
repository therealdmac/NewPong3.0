 /**
 * Initialize the Game and start it
 */
var game = new Game();

var d = new Date();
var time1 = 0;
var time2 = 0;
var gameTime = 0;

 /********** added by beeb **********/
 var start;
 var end;

// Keep track of enemy ball
var enemyballPoolonScreen = 0;


//************ added by beeb ****************
var blinkingBall = 0;
//************ added by beeb ****************
// Keep track of manipulation times
var manipulated = 0;

function init() {
	if(game.init()) {
		game.start();
	}
		
} 

function restartGame() {
	if (game.mainball.y > game.mainball.bottomEdge)
		document.location.reload();
}

/*
function startWorker() {
	console.log('entered startworkers');

	if(typeof(Worker)!=="undefined")
	  {
	    if(typeof(w)=="undefined")
	  {
	    w = new Worker("js/webworkers.js");

	  }

	  // when web workers return a message
	  w.onmessage = function (event) {
	    document.getElementById("result3").innerHTML=event.data;
	    };
	  }
	else
	  {
	  document.getElementById("result3").innerHTML="Sorry, your browser does not support Web Workers...";
	  }
}

function stopWorker() { 
  w.terminate();
}
*/
/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a 
 * singleton.
 */
var imageRepository = new function() {

	// Define images
	this.errorimg = new Image();
	this.background = new Image();
	this.paddle = new Image();
	this.mainball = new Image();
	this.enemyball = new Image();
	this.enemyballBig = new Image();
	this.shooter = new Image();
	this.arrow = new Image();

	/******* added by beeb *********/
	this.blinkingBall = new Image();
	/******* added by beeb *********/

	// Ensure all images have loaded before starting the game
	var numImages = 8;
	var numLoaded = 0;

	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.errorimg.onload = function() {
		imageLoaded();
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.paddle.onload = function() {
		imageLoaded();
	}
	this.mainball.onload = function() {
		imageLoaded();
	}
	this.enemyball.onload = function() {
		imageLoaded();
	}
	this.enemyballBig.onload = function() {
		imageLoaded();
	}
	this.shooter.onload = function() {
		imageLoaded();
	}
	this.arrow.onload = function() {
		imageLoaded();
	}
	/******** added by beeb **************/
	this.blinkingBall.onload = function(){
		imageLoaded();
	}
	/******** added by beeb **************/

	// Set images src
	this.errorimg.src = "imgs/error.png";
	this.background.src = "imgs/bg.png";
	this.paddle.src = "imgs/paddle.png";
	this.mainball.src = "imgs/main_ball.png";
	this.enemyball.src = "imgs/enemy_ball.png";
	this.enemyballBig.src = "imgs/enemy_ball_big.png";
	this.shooter.src = "imgs/shooter.png";
	this.arrow.src = "imgs/arrow.png";
	/************* added by beeb *************************/
	//for now use the  big ball as blinking ball..
	this.blinkingBall.src = "imgs/enemy_ball_big.png";
	/************* added by beeb *************************/
}


 /**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on browsers that do not support the canvas.
	 */
	this.init = function() {
	
	

		// Get the canvas elements
		this.bgCanvas = document.getElementById('background');
		this.paddleCanvas = document.getElementById('paddle');
		this.mainCanvas = document.getElementById('main');

		// Test to see if canvas is supported. Only need to
		// check one canvas
		if (this.bgCanvas.getContext) {

			this.bgContext = this.bgCanvas.getContext('2d');
			this.paddleContext = this.paddleCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

			// Initialize objects to contain their context and canvas information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Ball.prototype.context = this.mainContext;
			Ball.prototype.canvasWidth = this.mainCanvas.width;
			Ball.prototype.canvasHeight = this.mainCanvas.height;

			Paddle.prototype.context = this.paddleContext;
			Paddle.prototype.canvasWidth = this.paddleCanvas.width;
			Paddle.prototype.canvasHeight = this.paddleCanvas.height;

			Shooter.prototype.context = this.paddleContext;
			Shooter.prototype.canvasWidth = this.paddleCanvas.width;
			Shooter.prototype.canvasHeight = this.paddleCanvas.height;
	
			// Initialize the Object Pool		
			this.pool = new ObjectPool(10);	

			// Initialize the objects
			this.mainball = this.pool.CreateObj(0);
			this.enemyball = this.pool.CreateObj(1);
			this.shooter = new Shooter();
			this.paddle = new Paddle();
			/************** added by beeb ******************/
			// this.blinkingBall = this.pool.CreateObj(3);
			/************** added by beeb ******************/
			
			this.background = new Background();
			this.colHandler = new CollisionHandler();	

			

			// *************************
			// Initialize the objects' starting location
			// *************************

			// Background Draw
			this.background.init(0,0, imageRepository.background); 
			
			// Initialize the Shooter
			var shooterStartX = this.paddleCanvas.width/2 - imageRepository.shooter.width;
			var shooterStartY = 0;
			this.shooter.init(shooterStartX, shooterStartY, imageRepository.shooter);

			// Set the paddle to start near the bottom middle of the canvas
			var paddleStartX = this.paddleCanvas.width/2 - imageRepository.paddle.width;
			var paddleStartY = this.paddleCanvas.height - imageRepository.paddle.height;
			this.paddle.init(paddleStartX, paddleStartY, imageRepository.paddle);

			// Mainball starting location
			var mainballStartX = this.mainCanvas.width/2 - imageRepository.mainball.width;
			var mainballStartY = this.mainCanvas.height/10;

			this.mainball.init(mainballStartX, mainballStartY, imageRepository.mainball);
			
			

			// EnemyBall starting location

			this.enemyball.init(100, 100, imageRepository.enemyball);

			// this.blinkingBall.init(60, 20, imageRepository.blinkingBall);
			

			return true;
		} else {
			return false;
		}
	};

	// Start the animation loop
	this.start = function() {

		alert('Start Game?');
		// physicsEngine();
	

		//draw everything first round
		//game.background.draw();
		game.paddle.draw();
		game.shooter.draw();
		game.pool.animate();
		this.pool.draw();

		// Test Frame Per Second
		checkFPS();

		// start the debugging tool
		debugTool();

		// start the animation loop
		renderThread();

		correctionThread();

		physicsThread();

		cycleCheck();

		//clipImgOne();
		//clipImgTwo();



	};

}


/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
var renderingFaster = 0;

var renderingTime = 0;

function renderingTimeFunc() {
	renderingTime++;
	// console.log('renderingTimeFunc is running');
	// setTimeout("renderingTimeFunc", 1);
}

var physicsTime = 0;

function physicsTimeFunc() {
	physicsTime++;
	// console.log('physicsTime is running');
	// setTimeout("physicsTimeFunc", 1);
}



 /********** added by beeb **********/
function renderThread() {
	
	requestAnimFrame( renderThread );
	
	// Rendering
	debugContext.clearRect(0,0,debugCanvas.width, debugCanvas.height);
	//var colHandler = new CollisionHandler();

	// Rendering
	game.paddle.move();
	game.paddle.draw();
	game.shooter.draw();
	
	game.pool.animate();


	// Start counting game timer
	gameTimer();
	renderingTimeFunc(); // plus count

	// console.log('rendering count is ' +renderingTime);

	//correction();

	//setTimeout("renderThread()", 2); //1000 / X = Yfps
	
}

function correctionThread() {
	requestAnimFrame( correctionThread );
	correction();
	//setTimeout('correctionThread()', 1)
}


function physicsThread() {
	requestAnimFrame( physicsThread );
	physicsTimeFunc();
	game.colHandler.subDivide(game.pool.allObj);
	physicsEngine();
	//setTimeout("physicsThread()", 2);

}

function cycleCheck() {
	requestAnimFrame( cycleCheck );
	if (renderingTime > physicsTime) {
		renderingFaster++;
		renderingTime = 0;
		physicsTime = 0;
	}

	//setTimeout("cycleCheck()", 10);
}

/*
function clipImgOne(obj1, moveX, moveY) {
	requestAnimFrame( clipImgOne );
	obj1.clipImg();
	obj1.x = obj1.x + moveX/2;
	obj1.y = obj1.y - moveY/2;
}

function clipImgTwo(obj2, moveX, moveY) {
	requestAnimFrame( clipImgTwo );
	obj2.clipImg();
	obj2.x = obj2.x - moveX/2;
	obj2.y = obj2.y + moveY/2;

}
*/
/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){

	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();



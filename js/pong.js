 /**
 * Initialize the Game and start it
 */
var game = new Game();

var d = new Date();
var time1 = 0;
var time2 = 0;
var gameTime = 0;

// Keep track of enemy ball
var enemyballPoolonScreen = 0;

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



/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a 
 * singleton.
 */
var imageRepository = new function() {

	// Define images
	this.background = new Image();
	this.paddle = new Image();
	this.mainball = new Image();
	this.enemyball = new Image();
	this.enemyballBig = new Image();
	this.shooter = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 6;
	var numLoaded = 0;

	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
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

	// Set images src
	this.background.src = "imgs/bg.png";
	this.paddle.src = "imgs/paddle.png";
	this.mainball.src = "imgs/main_ball.png";
	this.enemyball.src = "imgs/enemy_ball.png";
	this.enemyballBig.src = "imgs/enemy_ball_big.png";
	this.shooter.src = "imgs/shooter.png";
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
			this.enemyballBig = this.pool.CreateObj(2);
			this.shooter = new Shooter();
			this.paddle = new Paddle();
			
			this.background = new Background();
			
			this.colHandler = new CollisionHandler();			

			// *************************
			// Initialize the objects' starting location
			// *************************

			// Background Draw
			this.background.init(0,0); 

			// Initialize the Shooter
			var shooterStartX = this.paddleCanvas.width/2 - imageRepository.shooter.width;
			var shooterStartY = 0;
			this.shooter.init(shooterStartX, shooterStartY, imageRepository.shooter.width,
			               imageRepository.shooter.height);

			// Set the paddle to start near the bottom middle of the canvas
			var paddleStartX = this.paddleCanvas.width/2 - imageRepository.paddle.width;
			var paddleStartY = this.paddleCanvas.height - imageRepository.paddle.height;
			this.paddle.init(paddleStartX, paddleStartY, imageRepository.paddle.width,
			               imageRepository.paddle.height);

			// Mainball starting location
			var mainballStartX = this.mainCanvas.width/2 - imageRepository.mainball.width;
			var mainballStartY = this.mainCanvas.height/10;

			this.mainball.init(mainballStartX, mainballStartY, imageRepository.mainball.width, imageRepository.mainball.height);

			// EnemyBall starting location
			this.enemyball.init(100, 10, imageRepository.enemyball.width, imageRepository.enemyball.height);
			

			return true;
		} else {
			return false;
		}
	};

	// Start the animation loop
	this.start = function() {

		//alert('Start Game?');
	

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
		animate();

		animate2();

		// setInterval(animate(), 30);
		// setInterval(animate2(), 30);

		


	};

}


/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
	//requestAnimFrame( animate );

	//console.log('animated1 is called');
	
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
	 //setInterval(animate(), 30);

	setTimeout("animate()", 10);
	
}

function delay() {
	setTimeout(delay(), 1);
}

function animate2() {
	//requestAnimFrame( animate );
	//console.log('animate2 called');

	// Collision Handler (Game Logic)
	// 
	game.colHandler.subDivide(game.pool.allObj);

	setTimeout("animate2()", 10);

	//delay();

	


}

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



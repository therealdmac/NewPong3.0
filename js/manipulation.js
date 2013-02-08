/*************** added by beeb ********************/
var ballMovingDown = false;
var ballMovingRight = false;
var paddleIsInTheRightRegionOfCanvas = false;
var paddleIsInTheLeftRegionOfCanvas = false;
var paddleRegion;//can use game.paddle.x
var currentTime;
var gameTimeElapsed;
var isTimeForManipulation;

var blinkingEffect = 0;;

function setGameBallYDirection(){
	//If the ball is moving down, it is deemed to have positive direction
	if(game.mainball.speedY > 0){
		game.mainball.ballMovingDown  = true;
	}else{
		game.mainball.ballMovingDown = false;
	}
	//console.log('is ball in y direction:' + game.mainball.ballMovingDown);
}
function setGameBallXDirection(){
	//If the ball is moving to the right, it is deemed to have positive direction
	if(game.mainball.speedX > 0){
		game.mainball.ballMovingRight = true;
	}else{
		game.mainball.ballMovingRight = false;
	}
	//console.log('is ball moving right:' + game.mainball.ballMovingRight);
}
function setPaddleCurrentRegion(){
	//console.log('The current paddle location is: ' + game.paddle.x);
	if(game.paddle.x > (game.paddle.canvasWidth / 2)){
		game.paddle.paddleIsInTheRightRegionOfCanvas = true;
		game.paddle.paddleIsInTheLeftRegionOfCanvas = false;
		game.paddle.paddleRegion = "right";
	}else if((game.paddle.x + game.paddle.width ) < (game.paddle.canvasWidth / 2)){
		game.paddle.paddleIsInTheLeftRegionOfCanvas = true;
		game.paddle.paddleIsInTheRightRegionOfCanvas = false;
		game.paddle.paddleRegion = "left";
	}
	//console.log('paddle is in:' + game.paddle.paddleRegion + ' region');
}
function setGameBallRegion(){
	//Get the region the game ball is in
	if(game.mainball.x < (game.mainball.canvasWidth/2)){
		game.mainball.ballRegion = "left";

	}else{
		game.mainball.ballRegion  = "right";
	}
	//console.log('ball is in :' + game.mainball.ballMovingDown + ' region');
}

function isTimeForManipulation(){

	// console.log('is blinking ball valid? ' +game.blinkingBall.x);

	//console.log('entered isTimeForManipulation');

	document.getElementById("executed-status-box").style.background = 'red';
	
	
	
	

	//Set the gameBallParameters parameters
	
	setGameBallYDirection();
	// setGameBallXDirection();
	setGameBallRegion();
	setPaddleCurrentRegion();
	
	//Determine if the gameball has collided with the edges and also is moving down



	if(//game.mainball.ballMovingDown && 
	   (game.mainball.collidedwithrightEdge || game.mainball.collidedwithleftEdge) &&
	   game.mainball.ballMovingDown){	
		manipulateGameBall();
	}
}

function manipulateGameBall(){


	switch (game.paddle.paddleRegion){
		case 'left': 	
	
			if(/*game.mainball.ballRegion == "right"*/game.mainball.collidedwithrightEdge ){//&& game.mainball.collidedwithrightEdge){
				game.mainball.speedY += 8;

				manipulated++;

				document.getElementById("executed-status-text").innerHTML = manipulated;
				document.getElementById("executed-status-box").style.background = 'green';

				
				//console.log('manipulated! at left');

			}
			break;

		case 'right': 	
			//console.log('paddle is at the right');
			//console.log('Gameball region is at ' +game.mainball.ballRegion);
			if(/*game.mainball.ballRegion == "left"*/game.mainball.collidedwithleftEdge ){//&& game.mainball.collidedwithleftEdge){
				game.mainball.speedY += 8;
				manipulated++;
				document.getElementById("executed-status-text").innerHTML = manipulated;
				document.getElementById("executed-status-box").style.background = 'green';

			}
			break;

		default:  	
			break;
	}//switch case statement
}

function gameTimer(){
	//currentTime = ;

	//gameTimeElapsed = gameTime - currentTime;
	//If the time elapsed is more than 10 seconds, it is time for manipulation
	//if(gameTimeElapsed > 10)	
	//	isTimeForManipulation();
	//console.log('gameTimer ' +gameTime);
	if (gameTime > 300) {
		document.getElementById("mani-status-text").innerHTML = 'ON';
		document.getElementById("mani-status-box").style.background = 'green';

		// console.log('is blinking ball valid? ' +game.blinkingBall.x);

		// alert('freeze');
		//isTimeForManipulation();
	}
	gameTime++;

	//setTimeout("gameTimer()", 1000);
}

/*function hitTheWall(xVelocityOfBall, yVelocityOfBall, gameTime, xCoordinateOfPaddle, xCoordinateOfBall) {
	//Required input: x and y velocity of ball, how long the game has lasted, paddle x coordinate, ball x coordinate
	
	//Assume both walls moving downwards at same rate
	//Reverse x velocity direction
	xVelocityOfBall = -xVelocityOfBall;
	
	//Manipulation of y velocity (dont know when you wanna call this)
	if( gameTime > 200 ) {	//game has lasted long enough for us to add manipulation
		if( xCoordinateOfBall < 5 || xCoordinateOfPaddle > canvasWidth/2 ) {	//ball hits left wall and paddle is on other half of screen
			yVelocityOfBall += 8;
		}
		else if( xCoordinateOfBall > canvasWidth-5 || xCoordinateOfPaddle < canvasWidth/2 ) {	//ball hits right wall and paddle is on other half of screen
			yVelocityOfBall += 8;
		}
	}
	//Increase y velocity "normally" if manipulation conditions not met (assuming y = 0 is top of canvas)
	else {
		yVelocityOfBall += 5;	//can change this value to fit our canvas size and general speed
	}
}*/
/******* added by beeb *****/
var regionMainBallIsIn;
/******* added by beeb *****/
function manipulateEnemyBalls(){
	//Concept: Get the enemy balls on the other region with respect to the main ball
	//and make them move towards the mainball slowly but at an increasing rate

	/*regionMainBallIsIn = game.mainball.ballRegion;
	switch(regionMainBallIsIn){
		case 'left'	
			//getEnemyBallsInRightRegion();//returns an array containing the ball id
			//manipulateThisEnemyBalls(thisArray);
			break;

		case 'right'
			//getEnemyBallsInLeftRegion();
			//manipulateThisEnemyBalls(thisArray);
			break;
	}//switch case*/
}
/*
function manipulateThisEnemyBalls(){
	
}
*/
function blinkingBallAttraction(mainBallXCoordinate, 
								mainBallYCoordinate, 
								blinkingBallXCoordinate, 
								blinkingBallYCoordinate, 
								xVelocityOfMainBall, 
								yVelocityOfMainBall){
	//console.log('pulling the mainBall...');
	//mainBall will experience a vector of magnitude 4 pointing towards center of blinkingBall
	//Called every frame
	//Required input: x and y coordinates of center of mainBall and blinkingBall, x and y velocity of mainBall
	
	var joiningXVector, joiningYVector, unitJoiningXVector, unitJoiningYVector;
	var attractionXVector, attractionYVector;
	var newXVelocityOfMainBall, newYVelocityOfMainBall;
	
	//Find unit vector that joins center of mainBall to center of blinkingBall
	joiningXVector = blinkingBallXCoordinate - mainBallXCoordinate;
	joiningYVector = blinkingBallYCoordinate - mainBallYCoordinate;
	unitJoiningXVector = joiningXVector / Math.sqrt(joiningXVector * joiningXVector + joiningYVector * joiningYVector);
	unitJoiningYVector = joiningYVector / Math.sqrt(joiningXVector * joiningXVector + joiningYVector * joiningYVector);
	
	//Multiply unit joining vector by magnitude of 4 (number can be changed)
	attractionXVector = unitJoiningXVector * 0.5;
	attractionYVector = unitJoiningYVector * 0.5;
	
	//Find mainBall's new velocity vectors
	game.mainball.speedX = xVelocityOfMainBall + attractionXVector;
	//console.log('mainball new x speed after pulled: ' + game.mainball.speedX);
	game.mainball.speedY = yVelocityOfMainBall + attractionYVector;
	//console.log('mainball new y speed after pulled: ' + game.mainball.speedY);
}
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
function setEnemyBallRegion(thisObj){
	if(game.thisObj.x < (game.thisObj.canvasWidth/2)){
		game.thisObj.ballRegion = "left";
	}else{
		game.thisObj.ballRegion = "right";
	}
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
	manipulateEnemyBalls();
}
function gameTimer(){
	//currentTime = ;

	//gameTimeElapsed = gameTime - currentTime;
	//If the time elapsed is more than 10 seconds, it is time for manipulation
	//if(gameTimeElapsed > 10)	
	//	isTimeForManipulation();
	//console.log('gameTimer ' +gameTime);
	if (gameTime > 1000 && enemyballPoolonScreen > 10) {
		document.getElementById("mani-status-text").innerHTML = 'ON';
		document.getElementById("mani-status-box").style.background = 'green';


		// console.log('is blinking ball valid? ' +game.blinkingBall.x);

		// alert('freeze');
		isTimeForManipulation();
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
var arrayToPopulate;
var arrayToManipulate;
/*
function manipulateEnemyBalls(){
	//Concept: Get the enemy balls on the other region with respect to the main ball
	//and make them move towards the mainball slowly but at an increasing rate
	console.log('gonna manipulate the enemy balls!');
	regionMainBallIsIn = game.mainball.ballRegion;
	console.log('region main ball is in: ' + regionMainBallIsIn);
	switch(regionMainBallIsIn){
		case 'left'	
			populateTheArray();
			getEnemyBallsInRightRegion();//returns an array containing the ball id
			manipulateThisEnemyBalls(thisArray);
			break;

		case 'right'
			populateTheArray();
			getEnemyBallsInLeftRegion();
			manipulateThisEnemyBalls(thisArray);
			break;
	}//switch case
}
var ballType;
var thisBallObject;
var lenghtOfArray = game.pool.allObj.length;
console.log('lengthOfArray before populating is: ' + lengthOfArray);//for testing
function populateTheArray(){
	for(var iter = 0;
		iter < lengthOfArray;
		iter++){
		ballType = game.pool.allObj[iter].typeof;
		if(ballType === 'enemyball' || ballType === 'enemyballBig'){
			//thisBallObject = game.pool.allObj[iter];
			arrayToPopulate.push(game.pool.allObj[iter]);
			setEnemyBallRegion(game.pool.allObj[iter]);
		}
	}//for loop
}
function getEnemyBallsInRightRegion(){
	var i = 0;
	for( i in arrayToPopulate){
		if(arrayToPopulate[i].ballRegion == "right"){
			arrayToManipulate.push(arrayToPopulate[i]);
		}
	}
}
function getEnemyBallsInLeftRegion(){
	var i = 0;
	for( i in arrayToPopulate){
		if(arrayToPopulate[i].ballRegion == "left"){
			arrayToManipulate.push(arrayToPopulate[i]);
		}
	}
}
function manipulateThisEnemyBalls(){
	var i = 0;
	for(i in arrayToManipulate){
		arrayToManipulate[i].speedX += 5;//increase the speed
	}
}


/******* added by beeb *******/
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
	// console.log('blinkingball attraction being called');
	
	var joiningXVector, joiningYVector, unitJoiningXVector, unitJoiningYVector;
	var attractionXVector, attractionYVector;
	var newXVelocityOfMainBall, newYVelocityOfMainBall;
	
	//Find unit vector that joins center of mainBall to center of blinkingBall
	joiningXVector = blinkingBallXCoordinate - mainBallXCoordinate;
	joiningYVector = blinkingBallYCoordinate - mainBallYCoordinate;
	unitJoiningXVector = joiningXVector / Math.sqrt(joiningXVector * joiningXVector + joiningYVector * joiningYVector);
	unitJoiningYVector = joiningYVector / Math.sqrt(joiningXVector * joiningXVector + joiningYVector * joiningYVector);
	
	//Multiply unit joining vector by magnitude of 4 (number can be changed)
	attractionXVector = unitJoiningXVector * 0.1;
	attractionYVector = unitJoiningYVector * 0.1;
	
	//Find mainBall's new velocity vectors
	game.mainball.speedX = xVelocityOfMainBall + attractionXVector;
	//console.log('mainball new x speed after pulled: ' + game.mainball.speedX);
	game.mainball.speedY = yVelocityOfMainBall + attractionYVector;
	//console.log('mainball new y speed after pulled: ' + game.mainball.speedY);
}
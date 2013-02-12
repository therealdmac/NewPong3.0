/*************** added by beeb ********************/
var ballMovingDown = false;
var ballMovingRight = false;
var paddleIsInTheRightRegionOfCanvas = false;
var paddleIsInTheLeftRegionOfCanvas = false;
var paddleRegion;//can use game.paddle.x
var currentTime;
var gameTimeElapsed;
var isTimeForManipulation;
var blinkingEffect = 0;
var ballType;
var thisBallObject;
var regionMainBallIsIn;
var arrayToPopulate = new Array();
var arrayToManipulate = new Array();
var lengthOfPopulatedArray;
//var lengthOfManipulatedArray;

function setGameBallYDirection(){
	//If the ball is moving down, it is deemed to have positive direction
	if(game.mainball.speedY > 0){
		game.mainball.ballMovingDown  = true;
	}else{
		game.mainball.ballMovingDown = false;
	}
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
	if(game.paddle.x > (game.paddle.canvasWidth / 2)){
		game.paddle.paddleIsInTheRightRegionOfCanvas = true;
		game.paddle.paddleIsInTheLeftRegionOfCanvas = false;
		game.paddle.paddleRegion = "right";
	}else if((game.paddle.x + game.paddle.width ) < (game.paddle.canvasWidth / 2)){
		game.paddle.paddleIsInTheLeftRegionOfCanvas = true;
		game.paddle.paddleIsInTheRightRegionOfCanvas = false;
		game.paddle.paddleRegion = "left";
	}
}

function setGameBallRegion(){
	//Get the region the game ball is in
	if(game.mainball.x < (game.mainball.canvasWidth/2)){
		game.mainball.ballRegion = "left";

	}else{
		game.mainball.ballRegion  = "right";
	}
}

function setEnemyBallRegion(thisObj){
	if(thisObj.x < (thisObj.canvasWidth/2)){
		thisObj.ballRegion = "left";
	}else{
		thisObj.ballRegion = "right";
	}
}

function isTimeForManipulation(){
	//console.log('gonna manipulate');
	document.getElementById("executed-status-box").style.background = 'red';
	//Set the gameBallParameters parameters
	setGameBallYDirection();
	//setGameBallXDirection();
	setGameBallRegion();
	setPaddleCurrentRegion();
	//Determine if the gameball has collided with the edges and also is moving down
	if((game.mainball.collidedwithrightEdge || game.mainball.collidedwithleftEdge) &&
	    game.mainball.ballMovingDown){	
			manipulateGameBall();
	}else{
		manipulateEnemyBalls();
	}
}

function manipulateGameBall(){

	switch (game.paddle.paddleRegion){
		case 'left': 	
	
			if(game.mainball.collidedwithrightEdge){
				game.mainball.speedY += 8;
				manipulated++;
				document.getElementById("executed-status-text").innerHTML = manipulated;
				document.getElementById("executed-status-box").style.background = 'green';
				//console.log('manipulated! at left');
			}
			break;

		case 'right': 	
			//console.log('paddle is at the right');
			//console.log('Gameball region is at ' + game.mainball.ballRegion);
			if(game.mainball.collidedwithleftEdge){
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
	if (gameTime > 1000 && enemyballPoolonScreen > 5) {
		document.getElementById("mani-status-text").innerHTML = 'ON';
		document.getElementById("mani-status-box").style.background = 'green';
		isTimeForManipulation();
	}
	gameTime++;

	//setTimeout("gameTimer()", 1000);
}

function manipulateEnemyBalls(){
	//Concept: Get the enemy balls on the other region with respect to the main ball
	//and make them move towards the mainball slowly but at an increasing rate
	//console.log('gonna manipulate the enemy balls!');
	regionMainBallIsIn = game.mainball.ballRegion;
	//console.log('region main ball is in: ' + regionMainBallIsIn);
	switch(regionMainBallIsIn){
		case 'left':	
			populateTheArray();
			getEnemyBallsInRightRegion();//returns an array containing the ball id
			executeManipulationOfEnemyBalls("right");
			break;

		case 'right':
			populateTheArray();
			getEnemyBallsInLeftRegion();
			executeManipulationOfEnemyBalls("left");
			break;
	}//switch case
	clearManipulationArrays();
}

function clearManipulationArrays(){
	arrayToPopulate.splice(0, arrayToPopulate.length);
	arrayToManipulate.splice(0, arrayToManipulate.length);
}

function populateTheArray(){
	lengthOfPopulatedArray = game.pool.allObj.length;
	for(var iter = 0;
		iter < lengthOfPopulatedArray;
		iter++){
		ballType = game.pool.allObj[iter].typeofball;
		//console.log('ballType is: ' + ballType);
		if(ballType === 'enemyball' || ballType === 'enemyballBig'){
			//thisBallObject = game.pool.allObj[iter];
			arrayToPopulate.push(game.pool.allObj[iter]);
			setEnemyBallRegion(game.pool.allObj[iter]);
		}
	}//for loop
	//console.log('contentsOfArray after populating is: ' + arrayToPopulate.toString());//for testing
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
	for(i in arrayToPopulate){
		if(arrayToPopulate[i].ballRegion == "left"){
			arrayToManipulate.push(arrayToPopulate[i]);
		}
	}
}

function executeManipulationOfEnemyBalls(thisRegion){
	var i = 0;
	for(i in arrayToManipulate){
		//console.log('this enemy ball is manipulated ' + arrayToManipulate[i].property);
		switch(thisRegion){
			case 'right':
				arrayToManipulate[i].speedX -= 2;
				break;
			case 'left':
				arrayToManipulate[i].speedX += 2;
				break;
		}//switch case statement
	}//for loop
}

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
function hitTheWall(xVelocityOfBall, yVelocityOfBall, gameTime, xCoordinateOfPaddle, xCoordinateOfBall) {
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
}



//Global for now
var ballOneXCoordinate,
	ballOneYCoordinate,
	massOfBallOne,
	xVelocityOfBallOne,
	yVelocityOfBallOne,
	xVelocityOfBallTwo,
	yVelocityOfBallTwo,
	vectorOfBallOne,
	vectorOfBallOne,
	computedTrajectoryOfBallOne;
	
var ballTwoXCoordinate,
	ballTwoYCoordinate,
	massOfBallTwo,
	//velocityOfBallTwo,
	vectorOfBallTwo,
	computedTrajectoryofBallTwo;

var newXVelocityOfBallOne, 
	newYVelocityOfBallOne, 
	newXVelocityOfBallTwo, 
	newYVelocityOfBallTwo;

var normalXVector, 
	normalYVector, 
	unitNormalXVector, 
	unitNormalYVector, 
	unitTangentXVector, 
	unitTangentYVector;
	
var normalScalarVelocityOfBallOne, 
	tangentScalarVelocityOfBallOne, 
	normalScalarVelocityOfBallTwo, 
	tangentScalarVelocityOfBallTwo;
	
var newNormalScalarVelocityOfBallOne, 
	newNormalScalarVelocityOfBallTwo;

var normalXVectorVelocityOfBallOne, 
	normalYVectorVelocityOfBallOne, 
	tangentXVectorVelocityOfBallOne, 
	tangentYVectorVelocityOfBallOne;
	

var normalXVectorVelocityOfBallTwo, 
	normalYVectorVelocityOfBallTwo, 
	tangentXVectorVelocityOfBallTwo, 
	tangentYVectorVelocityOfBallTwo;



function computeNewTrajectory(){

		
	
	//Find unit normal and unit tangent vectors
	normalXVector = ballTwoXCoordinate - ballOneXCoordinate;
	normalYVector = ballTwoYCoordinate - ballOneYCoordinate;


	unitNormalXVector = normalXVector / Math.sqrt(normalXVector * normalXVector + normalYVector * normalYVector);



	unitNormalYVector = normalYVector / Math.sqrt(normalXVector * normalXVector + normalYVector * normalYVector);
	unitTangentXVector = -unitNormalYVector;
	unitTangentYVector = unitNormalXVector;


	
	//Resolve velocity of each ball into normal and tangential components
	normalScalarVelocityOfBallOne = unitNormalXVector * xVelocityOfBallOne + unitNormalYVector * yVelocityOfBallOne;	//scalar normal velocity of ballOne

	tangentScalarVelocityOfBallOne = unitTangentXVector * xVelocityOfBallOne + unitTangentYVector * yVelocityOfBallOne;


		//scalar tangent velocity of ballOne
	normalScalarVelocityOfBallTwo = unitNormalXVector * xVelocityOfBallTwo + unitNormalYVector * yVelocityOfBallTwo;



		//scalar normal velocity of ballTwo
	tangentScalarVelocityOfBallTwo = unitTangentXVector * xVelocityOfBallTwo + unitTangentYVector * yVelocityOfBallTwo;	//scalar tangent velocity of ballTwo
	
	//Find new normal velocities
	newNormalScalarVelocityOfBallOne = (normalScalarVelocityOfBallOne * (massOfBallOne - massOfBallTwo) + 2 * massOfBallTwo * normalScalarVelocityOfBallTwo) / 
									   (massOfBallOne + massOfBallTwo);

	
									   
	newNormalScalarVelocityOfBallTwo = (normalScalarVelocityOfBallTwo * (massOfBallTwo - massOfBallOne) + 2 * massOfBallOne * normalScalarVelocityOfBallOne) / 
									   (massOfBallOne + massOfBallTwo);
	
	//Convert scalar normal and tangential velocities into vectors
	//ballOne
	normalXVectorVelocityOfBallOne = newNormalScalarVelocityOfBallOne * unitNormalXVector;


	normalYVectorVelocityOfBallOne = newNormalScalarVelocityOfBallOne * unitNormalYVector;
	tangentXVectorVelocityOfBallOne = tangentScalarVelocityOfBallOne * unitTangentXVector;
	tangentYVectorVelocityOfBallOne = tangentScalarVelocityOfBallOne * unitTangentYVector;
	//ballTwo
	normalXVectorVelocityOfBallTwo = newNormalScalarVelocityOfBallTwo * unitNormalXVector;
	normalYVectorVelocityOfBallTwo = newNormalScalarVelocityOfBallTwo * unitNormalYVector;
	tangentXVectorVelocityOfBallTwo = tangentScalarVelocityOfBallTwo * unitTangentXVector;
	tangentYVectorVelocityOfBallTwo = tangentScalarVelocityOfBallTwo * unitTangentYVector;
	
}

function setObjectOneParameters(thisObject){
	ballOneXCoordinate = thisObject.x;//Xcoordinate
	ballOneYCoordinate = thisObject.y;//Ycoordinate
	massOfBallOne = thisObject.mass;//mass
	xVelocityOfBallOne = thisObject.speedX;//x velocity of object
	yVelocityOfBallOne = thisObject.speedY;//y velocity of object

/*
	console.log(ballOneXCoordinate);
	console.log(ballOneYCoordinate);
	console.log(massOfBallOne);
	console.log(xVelocityOfBallOne);
	console.log(yVelocityOfBallOne); */
	
}
function setObjectTwoParameters(thisObject){
	ballTwoXCoordinate = thisObject.x;//Xcoordinate
	ballTwoYCoordinate = thisObject.y;//Ycoordinate
	massOfBallTwo = thisObject.mass;//mass
	xVelocityOfBallTwo = thisObject.speedX;//x velocity of object
	yVelocityOfBallTwo = thisObject.speedY;//y velocity of object


}



//This is the function that will be called by the program, the rest of them are private functions
function physicsEngine(objectOne, objectTwo){

	setObjectOneParameters(objectOne);
	setObjectTwoParameters(objectTwo);


	
	/*First Implementation
	* we can do it this way meaning that we create a new object having 2 fields:
	* allOne's new trajectory and ballTwo's new trajectory
	* and return that object
	*/
	
	//var computeTrajectoryObject = new computeNewTrajectory();
	//return computedTrajectoryObject;
	
	/*Second Implementation
	* Or we can assume that the calling objet has both the fields:
	* ballOne's newtrajectory and ballTwo's new trajectory
	* and we update it accordingly after computing
	*/
	
	computeNewTrajectory();




	//Find final velocity vectors
	objectOne.speedX = normalXVectorVelocityOfBallOne + tangentXVectorVelocityOfBallOne;
	objectOne.speedY = normalYVectorVelocityOfBallOne + tangentYVectorVelocityOfBallOne;


	objectTwo.speedX = normalXVectorVelocityOfBallTwo + tangentXVectorVelocityOfBallTwo;
	objectTwo.speedY = normalYVectorVelocityOfBallTwo + tangentXVectorVelocityOfBallTwo;



	//this.ball trajectory variable 1 of calling object = computedTrajectpryOfBallOne;
	//this.ball trajectory variable 2 of calling object = computedTrajectoryOfBallTwo;
}


/* We need to find a way to initialise these global variables only once...
 * not everytime the physics engine is called - maybe that could also be a problem of 
 * the sticky ball thingy 
 */

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



function resolveBallCollisons(){

		
	
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

	/* To implement the interaction with the shooter object, 
	 * we need to check if the one of the object references is a shooter object
	 * and then call the appropriate functions
	 */
	 if(typeof(objectOne) === Shooter){

	 }else if(typeof(objectTwo) === Shooter){

	 }else{
	 	//The 2 references belong to normal ball objects
		setObjectOneParameters(objectOne);
		setObjectTwoParameters(objectTwo);
		resolveBallCollisons();
		//Find final velocity vectors
		objectOne.speedX = normalXVectorVelocityOfBallOne + tangentXVectorVelocityOfBallOne;
		objectOne.speedY = normalYVectorVelocityOfBallOne + tangentYVectorVelocityOfBallOne;
		objectTwo.speedX = normalXVectorVelocityOfBallTwo + tangentXVectorVelocityOfBallTwo;
		objectTwo.speedY = normalYVectorVelocityOfBallTwo + tangentXVectorVelocityOfBallTwo;
	}

}
function resolveBallCollisionWithShooter(){

}
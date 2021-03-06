console.log('debug was created');

// ***************************************** 
// calculate frames per second
// http://stackoverflow.com/questions/5078913/html5-canvas-performance-calculating-loops-frames-per-second
// *****************************************


var fps = 0, now, lastUpdate = (new Date)*1 - 1;

// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
var fpsFilter = 50;

function checkFPS(){

  var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
  fps += (thisFrameFPS - fps) / fpsFilter;
  lastUpdate = now;

  setTimeout( checkFPS, 1 );
}

var fpsOut = document.getElementById('fps');
setInterval(function(){
  fpsOut.innerHTML = fps.toFixed(1) + "fps";
}, 1000);


// ************************************ 
// debug Tool
// ************************************ 
// debug flag
var debugFlag = 0;

function debugTool() {


	// mainBall location
	//document.getElementById("mbX").innerHTML=(game.mainball.x).toFixed(1); 
	//document.getElementById("mbY").innerHTML=(game.mainball.y).toFixed(1); 
	document.getElementById("mbSx").innerHTML=(game.mainball.speedX).toFixed(1);
	document.getElementById("mbSy").innerHTML=(game.mainball.speedY).toFixed(1); 


	// shooter debug
	// document.getElementById("shooter-Sx").innerHTML=(game.shooter.speed).toFixed(1);

	document.getElementById("enemyballCount").innerHTML=(enemyballPoolonScreen); 

	// How fast to update debugTool
	setTimeout( debugTool, 100);
}

	function showDebug() {
		
		debugFlag = 1;

		// animate out the debug button
		document.getElementById("debug-btn").style.right = '-25px';
		document.getElementById("debug-btn").style.background = 'rgb(8, 92, 8)';

		// animate out the off button
		document.getElementById("debug-btn-off").style.right = '80px';

		// quadtree canvas
		document.getElementById("debugcanvas").style.opacity = 1;

		// debug data display
		document.getElementById("debug-console").style.right = '-20px';
		document.getElementById("debug-console").style.opacity = 0.6;


	}

	function hideDebug() {
		

		document.getElementById("debug-btn").style.right = '-40px';
		document.getElementById("debug-btn").style.background = 'black';

		document.getElementById("debug-btn-off").style.right = '-40px';

		document.getElementById("debugcanvas").style.opacity = 0;

		// debug data display
		document.getElementById("debug-console").style.right = '-500px';
		document.getElementById("debug-console").style.opacity = 0;

		debugFlag = 0;
	}

function shootBall() {
	game.shooter.shoot();
}

function destroyBall() {
	game.pool.DeleteObj(1);
}

function shootBigBall() {
	game.shooter.shootBig();
}

function destroyBigBall() {
	game.pool.animate();
	game.pool.DeleteObj(2);
}

/******** added by beeb ******************/
function shootBlinkingBall(){
	game.shooter.shootBlinkingBall();
	console.log('blinkingBall function called!');
}
/******** added by beeb ******************/


function startTimer() {
	time1++;
	//console.log('getMilliseconds returns ' +d.getMilliseconds());
	document.getElementById("result").innerHTML=time1; 
	setTimeout("startTimer()", 1);
	  
}

function startTimer2() {
	time2++;
	setTimeout("startTimer2()", 1000);
	document.getElementById("result2").innerHTML=time2;   
}
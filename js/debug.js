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
	document.getElementById("shooter-Sx").innerHTML=(game.shooter.speed).toFixed(1);

	// How fast to update debugTool
	setTimeout( debugTool, 100);
}

	function showDebug() {
		document.getElementById("debug").style.display = 'block';
		document.getElementById("debug-status").innerHTML = 'ON';
		debugFlag = 1;
	}

	function hideDebug() {
		document.getElementById("debug").style.display = 'none';
		document.getElementById("debug-status").innerHTML = 'OFF';
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
var time3 = 0;

function startTimer3() {
  time3++;
  postMessage(time3);
  setTimeout("startTimer3()", 1);
}

startTimer3();
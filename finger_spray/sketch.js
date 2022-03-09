const cnvW = 450;
const cnvH = 800;
let serial;
let portSelector;
let portConfirmBtn;
const inDataNum = 12;

let sprayRadius = 100;
let clrR, clrG, clrB;
let sprayPressed = false;
let clearCanvas = false;

let video;
let poseNet;

let myPose;
let rightHanded = true;
let myWrist;

let canvasLayer;
let cursorLayer;

let bgc = 360;

let handX = 0;
let handY = 0;
let tempHandX = 0;
let tempHandY = 0;
let previousHandX;
let previousHandY;

let getArduinoData = false;

let nextBtn;
let backBtn;
let endBtn;
let pulseData;
let heartBeat;
let heartWasLow = true;

let currentHandX = 0;
let currentHandY = 0;

//chart data---------
let paintingMode = false;

let paintingTime = 0;
let squeezingTime = 0;
let releasingTime;
let squeezingTimeChartData = [0.1, 0.1];

let allPx = cnvW * cnvH;
let paintedPx = 0;

let hueDataPro;

let hueSumPro = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
let hueSumFin = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];

let wcSumPro = [0.1, 0.1];
let wcSumFin = [0.1, 0.1];

let brSumPro = [0.1, 0.1, 0.1];
let brSumFin = [0.1, 0.1, 0.1];

let speedData = [];
let radiusData = [];
let heartBpm;
let bpmData = [];
let clrTimeline = [];

let lineLabels = [];

//===========================================
function setup() {
  angleMode(DEGREES);
  colorMode(HSB);
  let cnv = createCanvas(cnvW * 2, cnvH);
  cnv.style("z-index", "-1");

  nameInput = createInput("name");
  nameInput.position(cnvW + 10, 10);
  nameInput.changed(startInstruction);

  titleDiv = select("#title");
  captionDiv = select("#caption");

  setImgSize();
  setInsDom(cnvW, height);

  setReportDom(cnvW, height);

  canvasLayer = createGraphics(cnvW, cnvH);
  cursorLayer = createGraphics(cnvW, cnvH);
  // canvasLayer.position(0, 0);

  //serial communication -----------
  serial = new p5.SerialPort();
  serial.on("list", printList);
  serial.on("open", portOpen);
  serial.on("close", portClose);
  serial.on("data", serialEvent);
  serial.on("error", serialError);
  serial.list();
  // serial.open(portName);

  //select camera ----------
  let constraints = {
    video: {
      deviceId:
        "41f8e2bad8e32cc80470e883c3b10f065418718f9c0138a2d3e74a7e1867d6c6",
    },
    mandatory: {
      minWidth: 720,
      minHeight: 1280,
    },
  };

  //poseNet---------
  // video = createCapture(VIDEO); // laptop webcam
  video = createCapture(constraints);
  video.size(cnvW * 2, cnvW * 2 * 0.75);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoad);
  poseNet.on("pose", gotPoses);

  pixelDensity(1);
}
//=================================================
function draw() {
  background(bgc);
  // push();
  let clr = colorAdjust(clrR, clrG, clrB);

  let spotAmount = int(random(30, 70));
  let spotSize = random(1, 5);

  // heartBpm = calcBPM(); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  getHandPosition();

  //clear btn----------------
  if (clearCanvas) {
    canvasLayer.clear();
  }
  image(canvasLayer, cnvW * 0.5, cnvH * 0.5);

  //instruction-----------------------
  showInstructions();

  if (clickBtn(nextData, 1)) {
    nextStep();
  }
  if (clickBtn(backData, 2)) {
    previousStep();
  }
  //start painting--------------------
  if (paintingMode) {
    if (sprayPressed) {
      for (let i = 0; i < spotAmount; i++) {
        let direct = random(360);
        let r = random(sprayRadius);
        let xRange = cos(direct) * r;
        let yRange = sin(direct) * r;
        canvasLayer.noStroke();
        canvasLayer.fill(clr);
        canvasLayer.ellipse(handX + xRange, handY + yRange, spotSize);
      }

      hueCategorize(hueDataPro, hueSumPro);
      wcCategorize(hueDataPro, wcSumPro);
      let brDataPro = (clrR + clrG + clrB) / 3;
      brCategorize(brDataPro, brSumPro);
    }

    hueProChart.data.datasets[0].data = hueSumPro;
    wcProChart.data.datasets[0].data = wcSumPro;
    brProChart.data.datasets[0].data = brSumPro;
    hueProChart.update();
    wcProChart.update();
    brProChart.update();

    //show cursor........
    cursorLayer.clear();
    cursorLayer.noFill();
    cursorLayer.stroke(0);
    cursorLayer.line(
      handX - sprayRadius * 0.2,
      handY,
      handX + sprayRadius * 0.2,
      handY
    );
    cursorLayer.line(
      handX,
      handY - sprayRadius * 0.2,
      handX,
      handY + sprayRadius * 0.2
    );
    cursorLayer.circle(handX, handY, sprayRadius + 5);
    image(cursorLayer, cnvW * 0.5, cnvH * 0.5);

    //collect data for pie chart.......
    paintingTime++;
    if (sprayRadius < 280) {
      squeezingTime++;
    }
    releasingTime = paintingTime - squeezingTime;
    squeezingTimeChartData = [squeezingTime, releasingTime];
    squeezeTimeChart.data.datasets[0].data = squeezingTimeChartData;
    squeezeTimeChart.update();

    //collect data for linegraph.......

    if (paintingTime % 30 == 0) {
      lineLabels.push("");
      speedData.push(5*(dist(handX, handY, previousHandX, previousHandY)));
      radiusData.push(sprayRadius);
      if (sprayPressed) {
        clrTimeline.push(`rgba(${clrR}, ${clrG}, ${clrB}, 1)`);
      } else {
        clrTimeline.push(`rgba(${clrR}, ${clrG}, ${clrB}, 0.1)`);
      }
    }
    lineGraph.data.datasets[0].data = speedData;
    lineGraph.data.datasets[1].data = radiusData;
    lineGraph.data.datasets[2].data = radiusData;
    lineGraph.data.datasets[2].backgroundColor = clrTimeline;

    lineGraph.data.labels = lineLabels;

    lineGraph.update();
  }

  //end painting--------------------
  if (clickBtn(endBtn, 3)) {
    paintingMode = false;

    push();
    colorMode(RGB);
    canvasLayer.loadPixels();

    for (let x = 0; x < cnvW; x++) {
      for (let y = 0; y < cnvH; y++) {
        let index = (x + y * cnvW) * 4;
        let finR = canvasLayer.pixels[index + 0];
        let finG = canvasLayer.pixels[index + 1];
        let finB = canvasLayer.pixels[index + 2];
        let finA = canvasLayer.pixels[index + 3];
        let finClrRGB = color(finR, finG, finB, finA);
        if (finA != 0) {
          paintedPx++;
          let hueDataFin = hue(finClrRGB);
          hueCategorize(hueDataFin, hueSumFin);
          wcCategorize(hueDataFin, wcSumFin);
          let brDataFin = (finR + finG + finB) / 3;
          brCategorize(brDataFin, brSumFin);
        }
      }
    }
    let blankPx = allPx - paintedPx;
    blankAreaChart.data.datasets[0].data = [paintedPx, blankPx];
    hueFinChart.data.datasets[0].data = hueSumFin;
    wcFinChart.data.datasets[0].data = wcSumFin;
    brFinChart.data.datasets[0].data = brSumFin;
    blankAreaChart.update();
    hueFinChart.update();
    wcFinChart.update();
    brFinChart.update();
    pop();

    canvasLayer.save(nameInput.value() + "Canvas.png");
    reportDiv.position(0, 0);
    // reportDiv.save(nameInput.value() + "Report.png");
  }
  previousHandX = handX;
  previousHandY = handY;
}

//color adjustment =============================
function colorAdjust(r, g, b) {
  colorMode(RGB);
  // let inputClrRGB = color(r, g * 0.85, b);
  let inputClrRGB = color(r, g, b);

  let h = hue(inputClrRGB);
  let s = saturation(inputClrRGB);
  let br = brightness(inputClrRGB);
  colorMode(HSB);
  // let outputClrHSB = color(h, s * 1.8, br * 1.8);
  let outputClrHSB = color(h, s, br);

  hueDataPro = h;

  return outputClrHSB;
}

// serial function =============================
function portOpen() {
  console.log(`port opened.`);
  serial.write("x");
}

function portClose() {
  console.log(`port closed.`);
}

function serialEvent() {
  let inString = serial.readLine();
  if (inString.length > 0) {
    if (inString != "Hello") {
      // console.log(inString);
      let inData = split(inString, ",");
      if (inData.length > inDataNum - 1) {
        sprayRadius = map(inData[0], 1000, 0, 2, 300);

        clrR = Number(inData[1]);
        clrG = Number(inData[2]);
        clrB = Number(inData[3]);
        let sprayBtn = inData[4];
        if (sprayBtn == 1) {
          sprayPressed = true;
        } else {
          sprayPressed = false;
        }
        let clearBtn = inData[5];
        if (clearBtn == 1) {
          clearCanvas = true;
        } else {
          clearCanvas = false;
        }
        let handednessBtn = inData[6];
        if (handednessBtn == 0) {
          rightHanded = true;
        } else {
          rightHanded = false;
        }
        nextBtn = inData[7];
        backBtn = inData[8];
        endBtn = inData[9];
        pulseData = inData[10];
        heartBeat = inData[11];
      }
      serial.write("x");
    }
    getArduinoData = true;
  }
}

function serialError(err) {
  console.log(`something went wrong: ${err}`);
}

function printList(portList) {
  portSelector = createSelect();
  portConfirmBtn = createButton("open");
  portSelector.position(cnvW + 10, 40);
  portConfirmBtn.position(cnvW + 10, 70);

  for (let i = 0; i < portList.length; i++) {
    portSelector.option(portList[i]);
  }
  portConfirmBtn.mousePressed(portSelectEvent);
}

function portSelectEvent() {
  let item = portSelector.value();
  if (serial.serialport != null) {
    serial.close();
  }
  serial.open(item);
  portSelector.hide();
  portConfirmBtn.hide();
}

//ml5 functions ==============================
function modelLoad() {
  console.log(`poseNet is ready.`);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    myPose = poses[0].pose;
  }
}

function whichHand() {
  if (rightHanded == true) {
    return myPose.rightWrist;
  } else {
    return myPose.leftWrist;
  }
}

function getHandPosition() {
  if (myPose) {
    myWrist = whichHand();
    tempHandX = lerp(tempHandX, averagePose(myWrist.x), 0.1);
    handX = map(tempHandX, 0, width, -50, cnvW);
    tempHandY = lerp(tempHandY, averagePose(myWrist.y), 0.1);
    handY = map(tempHandY, 0, height, -50, cnvH + 50);
  }
}

// smoothing =================================
function averagePose(x) {
  const nums = 20;
  let tempWrist = [];
  if (tempWrist.length < nums) {
    for (let i = 0; i < nums; i++) {
      tempWrist.push(x);
    }
  } else {
    tempWrist.shift();
    tempWrist.push(x);
  }

  let sum = 0;
  for (let i = 0; i < tempWrist.length; i++) {
    sum += tempWrist[i];
  }
  return sum / nums;
}

//get raw data ==========

function calcBPM() {
  let heartBeatTime = [];
  if (heartBeat == 1) {
    if (heartWasLow) {
      if (heartBeatTime.length < 2) {
        for (let i = 0; i < nums; i++) {
          heartBeatTime.push(frameCount);
        }
      } else {
        heartBeatTime.shift();
        heartBeatTime.push(frameCount);
      }
      heartWasLow = false;
    }
  } else {
    heartWasLow = true;
  }

  let bpm = 3600 / (heartBeatTime[1] - heartBeatTime[0]);
  return bpm;
}

//charts =================================
function hueCategorize(inputHue, outputArray) {
  let h = (inputHue / 255) * 24;
  if (h > 23) {
    outputArray[0]++;
  } else if (h > 21) {
    outputArray[11]++;
  } else if (h > 19) {
    outputArray[10]++;
  } else if (h > 17) {
    outputArray[9]++;
  } else if (h > 15) {
    outputArray[8]++;
  } else if (h > 13) {
    outputArray[7]++;
  } else if (h > 11) {
    outputArray[6]++;
  } else if (h > 9) {
    outputArray[5]++;
  } else if (h > 7) {
    outputArray[4]++;
  } else if (h > 5) {
    outputArray[3]++;
  } else if (h > 3) {
    outputArray[2]++;
  } else if (h > 1) {
    outputArray[1]++;
  } else {
    outputArray[0]++;
  }
}

function wcCategorize(inputHue, outputArray) {
  let h = (inputHue / 255) * 24;
  if (h > 18) {
    outputArray[1]++;
  } else if (h > 6) {
    outputArray[0]++;
  } else {
    outputArray[1]++;
  }
}
function brCategorize(inputBr, outputArray) {
  if (inputBr > 170) {
    outputArray[2]++;
  } else if (inputBr > 85) {
    outputArray[1]++;
  } else {
    outputArray[0]++;
  }
}

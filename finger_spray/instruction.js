let coverImg;
let instImgs = [];
let steps = 0;
let stepImgs;
let displayedImg;
let instructionIsStart = false;
let canvasIsStart = false;

let instructionDiv;
let titleDiv;
let captionDiv;
let nameInput;
let title = [
  "Hello ",
  "Which Hand?",
  "Put on the Glove",
  "Click to Spray",
  "Change the Radius",
  "Pick the Color",
  "Ready?",
];
let caption = [
  "Welcome to Finger Spray. It's an art assessment tool. Please follow the instructions and press next to start.",
  "Select your dominant hand. Are you right handed or left handed?",
  "Put the 3-finger glove on your dominant hand. And wear the one finger glove on your ring finger or little finger.",
  "Connect your thumb and index finger to spray on the canvas.",
  "Grip your fist to change the radius of the spray. The tighter the fist grasped, the smaller the spray range.",
  "Pick the color you like on the palette with the color picker.",
  "Now, press the next button to start painting. Enjoy :)",
];


let btnIsOne =[false, false, false, false]; // 0: clear, 1: next, 2: back, 3: end
let nextData;
let backData;



function preload() {
  coverImg = loadImage("instruction/cover.png");
  for (let i = 0; i < 12; i++) {
    instImgs[i] = loadImage("instruction/instruction" + (i + 1) + ".png");
  }
  stepImgs = [
    [instImgs[0], instImgs[1]],
    [instImgs[2], instImgs[3]],
    [instImgs[6], instImgs[7]],
    [instImgs[8], instImgs[9]],
    [instImgs[10], instImgs[11]],
    [instImgs[4], instImgs[5]],
    [instImgs[0], instImgs[1]],
  ];
}


// self-defined functions ========================
function setImgSize() {
  imageMode(CENTER);
  coverImg.resize(cnvW * 0.5, cnvW * 0.9);
  for (let i = 0; i < 6; i++) {
    instImgs[i].resize(cnvW * 0.4, cnvW * 0.4);
  }
  // for (let i = 6; i < 8; i++) {
  //   instImgs[i].resize(cnvW * 0.75, cnvW * 0.5);
  // }
  for (let i = 6; i < 12; i++) {
    instImgs[i].resize(cnvW * 0.5, cnvW * 0.75);
  }
}

function setInsDom(w, h) {
  instructionDiv = select("#instructions");
  instructionDiv.size(w, h);
  instructionDiv.position(0, 0);
}

function startInstruction() {
  nameInput.hide();
  instructionIsStart = true;
}

function showInstructions() {
  nextData = nextBtn;
  backData = backBtn;
  let imgNum;
  if (frameCount % 20 < 10) {
    imgNum = 0;
  } else {
    imgNum = 1;
  }
  if (!canvasIsStart) {
    if (!instructionIsStart) {
      image(coverImg, cnvW / 2, height / 2);
    }
    if (instructionIsStart) {
      displayedImg = stepImgs[steps][imgNum];
      image(displayedImg, cnvW / 2, height / 2);
        
  captionDiv.html(caption[steps]);
      if (steps ==0){
        titleDiv.html(title[steps] + nameInput.value());
      } else{
        titleDiv.html(title[steps]);
      }
    }
  }
}

function nextStep() {
  steps++;
  if (steps > title.length - 1) {
    steps = title.length - 1;
    instructionDiv.hide();
    canvasIsStart = true;
    paintingMode = true;
    
    clearCanvas = true;
  }
}

function previousStep(){
  steps--;
  if (steps < 0) {
    steps = 0;
  }
}

function clickBtn(btnData, i){
  if (btnData == 1) {
    if (!btnIsOne[i]) {
      btnIsOne[i] = true;
      return true;
    } else {
      return false;
    }
  }else{
    btnIsOne[i] = false;
    return false;
  }
}


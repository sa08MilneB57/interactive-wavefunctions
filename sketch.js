'use strict'

let can;
let cam;
let space;
let wood;
let massLabel;
let massSlider;
let KLabel;
let KSlider;
let cInput;
let cButton;
let tempEl;
let timeAcc;
let detailIn;
let xSizeIn;
let t=0;

function preload() {
  space = loadImage('textures/space.jpg');
}

function cameraPos(){return createVector(cam.eyeX,cam.eyeY,cam.eyeZ);}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    //PASS
  } else if (keyCode === RIGHT_ARROW) {
    //PASS
  } else if (keyCode === ESCAPE){
    remove();
  }
}

function setup() {
    // put setup code here
    colorMode(HSL,2*Math.PI,100,100,100);
    can = createCanvas((8*windowWidth)/10, windowHeight-4, WEBGL);
    can.parent('containment');
    cam = camera();
    frameRate(10);
    let i;
    recalculate();
    timeAcc = document.getElementById("timeAcc");
    massLabel = document.getElementById("massLabel");
    massSlider = document.getElementById("massSlider");
    KLabel = document.getElementById("KLabel");
    KSlider = document.getElementById("KSlider");
    cInput = document.getElementById("cInput");
    cButton = document.getElementById("cButton");
    detailIn = document.getElementById("detailIn");
    xSizeIn = document.getElementById("xSizeIn");
}

function draw() {
    // put drawing code here
    if ( m!=Number(massSlider.value)||K!=Number(KSlider.value) ){
        m = Number(massSlider.value);
        K = Number(KSlider.value);
        massLabel.innerHTML = "Mass: " + m;
        KLabel.innerHTML = "Spring Constant: " + K;
        recalculate();
    }
    can.background(0);
    orbitControl();
    push();//Draws the skyboc
        noStroke();
        texture(space);
        sphere(width*2);
    pop();
    ambientLight(5);
    strokeWeight(3);
    shininess(10);
    pointLight(0, 0, 60, 0, height/2, -height/2);
    pointLight(0, 0, 60, 0, -height/2, height/2);
    axes();
    t+=Number(timeAcc.value)*deltaTime;
    drawPsi(t/1000);
}

function buttFunk(){
    detail = Number(detailIn.value);
    domainSize = Number(xSizeIn.value);
    xspace  = linspace(-domainSize,domainSize,detail);
    coef=new CompArr(cInput.value.split(","));
    recalculate();}
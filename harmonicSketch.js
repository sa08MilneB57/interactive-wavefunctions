'use strict'
let can,cam,space,massLabel,massSlider,KLabel,KSlider,cInput,cButton,fInput,RPNstack,setters,advVal,pdfSlider,
    tempEl,timeAcc,detailIn,xSizeIn,maxN,maxNLabel,maxNSlider,sliderURe,sliderUIm,sliderWRe,sliderWIm,Ulabel,Wlabel;
let t=0;
let funkMode = "manual";
let nSpace = linspaceC(0,16,17);
let u = new Complex(1);
let w = new Complex(1);
let detail = 301;
let domainSize = 5;
let coef = (CompArr.ones(16)).vecNorm();
let xspace  = linspace(-domainSize,domainSize,detail);
let yspace;
let pdf;
let yscaling;//this is a variable to bump up the size of the numbers so javascript doesn't disapear them all
let xscaling;
let m = 25;
let K = 2;
let w0 = Math.sqrt(K/m);
let a = m*w0;
let potential = xspace.map(x=>K*(x**2)/2);
let ax = xspace.map(x=>x*Math.sqrt(a));
let eigenStorage = [];

function advSetting(){
    let newVal = advVal.value; 
    switch (setters.value){
        case "maxReU":
            sliderURe.setAttribute("max",newVal);
            break;
        case "maxImU":
            sliderUIm.setAttribute("max",newVal);
            break;
        case "maxReW":
            sliderWRe.setAttribute("max",newVal);
            break;
        case "maxImW":
            sliderWIm.setAttribute("max",newVal);
            break;
        case "minReU":
            sliderURe.setAttribute("min",newVal);
            break;
        case "minImU":
            sliderUIm.setAttribute("min",newVal);
            break;
        case "minReW":
            sliderWRe.setAttribute("min",newVal);
            break;
        case "minImW":
            sliderWIm.setAttribute("min",newVal);
            break;
        case "massMax":
            massSlider.setAttribute("max",newVal);
            break;
        case "massMin":
            massSlider.setAttribute("min",newVal);
            break;
        case "springMax":
            KSlider.setAttribute("max",newVal);
            break;
        case "springMin":
            KSlider.setAttribute("min",newVal);
            break;
        case "maxNMax":
            maxNSlider.setAttribute("max",newVal);
            break;
    }
}

function eigenstate(n){
    if ((!Number.isInteger(n))||n<0){throw "n must be an integer>=0"}
    let An = yscaling*Math.sqrt(Math.sqrt(a/Math.PI))/Math.sqrt((2**n)*factorial(n));
    //The next two lines accomplish this=> An*H(n,ax)*Math.exp(-a*(x**2)/2)
    let nket = zip(xspace,ax).map((x)=>An*H(n,x[1])*Math.exp(-a*(x[0]**2)/2));
    return new CompArr(nket);}

function recalculate(){
    w0 = Math.sqrt(K/m);
    a = m*w0;
    potential = xspace.map(x=>K*(x**2)/2);
    ax = xspace.map(x=>x*Math.sqrt(a));
    xscaling=(width/2)/domainSize;
    yscaling=(height/2)
    eigenStorage.length=0;
    let n;
    if (funkMode=="function"){
        for (n of range(maxN+1)){
            eigenStorage.push(eigenstate(n));}
    } else {
        for (n of range(coef.length)){
            eigenStorage.push(eigenstate(n));}
    }
}

function superposition(time=0){
    //all the time-dependant stuff needs to be in here
    //in addition anything that can change from frame to frame
    let psi = CompArr.zeros(detail)
    if (funkMode=="function"){
        coef=evalC(RPNstack,"ntuw",nSpace,time,u,w);
        if (isComp(coef)){coef = CompArr.repeat(coef,nSpace.length)}
        coef=coef.vecNorm()
    }
    let i;
    for (i of range(coef.length)){
        if(ZEROc.equals(coef[i])){continue;}//skips zero coef. for more efficient rendering
        let phasor=coef[i].mult(expC([0,w0*(i+0.5)*time]));
        psi = psi.add(eigenStorage[i].mult(phasor));
    }
    return psi;
}
function integralCheck(){
    //this is a test: it outputs the probability that the particle is "somewhere" should be close to 1
    let dx = 2*domainSize/detail;
    let ys = yspace.divBy(yscaling).mag2();//returns the true pdf of the wavefunction as CompArr()
    return ys.sum().mult(2).sub( ys[0].add(ys[ys.length-1]) ).mult(dx/2);//Performs trapezoidal integration
}

function drawPsi(time=0){
    yspace = superposition(time);
    pdf = yspace.divBy(yscaling).mag2(false).map(y=>y*yscaling);
    let i;
    for (i of range(detail)){
        push();
        rotateX(Number(pdfSlider.value));
        translate(xscaling*xspace[i],-pdf[i],0);
        normalMaterial();
        specularMaterial("red");
        box(Math.log(200*pdf[i]+Math.E));
        pop();
        push();
        translate(xscaling*xspace[i],-yspace[i].re,yspace[i].im);
        normalMaterial();
        specularMaterial((2*Math.PI*i)/detail,100,60);
        sphere(Math.log(100*pdf[i]+Math.E));
        pop();
    }
}

function axes(){
    strokeWeight(3);
    push();stroke("red");beginShape();
    vertex(-width/2,0,0);
    vertex(width/2,0,0);
    endShape();
    let i;
    for (i of range(domainSize)){
    translate(width/(2*domainSize),0,0);
        push();
        rotateZ(-Math.PI/2);
        cone(10, 20, 4, 16);
        pop();
    }
    pop();

    push();stroke("blue");beginShape();
    vertex(0,height/2,0);
    vertex(0,-height/2,0);
    endShape();
    translate(0,-height/2,0);
    rotateX(Math.PI);
    cone(10, 20, 4, 16);
    pop();

    push();stroke("green");beginShape();
    vertex(0,0,-height/2);
    vertex(0,0,height/2);
    endShape();
    translate(0,0,height/2);
    rotateX(Math.PI/2);
    cone(10, 20, 4, 16);
    pop();
}

function resetTime(){t=0;}

function keyPressed() {
  if (keyCode === RETURN) {
    buttFunk();
  } else if (keyCode === ESCAPE){
    remove();
  }
}

function buttFunk(){//function for when apply button pushed
    detail = Number(detailIn.value);
    domainSize = Number(xSizeIn.value);
    xspace  = linspace(-domainSize,domainSize,detail);
    funkMode = document.querySelector('input[name="coeffMode"]:checked').value;
    if (funkMode=="manual"){
        coef=new CompArr(cInput.value.split(",")).vecNorm();
    } else if (funkMode=="function"){
        maxN = Number(maxNSlider.value);
        RPNstack = parseToRPN(fInput.value,"ntuw");
        nSpace = linspaceC(0,maxN,maxN+1);
    } else {throw "Massive radio button problem. Should be unreachable.";}
    recalculate();}


function preload() {
  space = loadImage('textures/space.jpg');
}

function setup() {
    // put setup code here
    colorMode(HSL,2*Math.PI,100,100,100);
    can = createCanvas(windowWidth, windowHeight-5, WEBGL);
    can.parent('containment');
    cam = createCamera();
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
    maxNLabel = document.getElementById("maxNLabel");
    maxNSlider = document.getElementById("maxNSlider");
    Ulabel = document.getElementById("Ulabel");
    Wlabel = document.getElementById("Wlabel");
    sliderURe = document.getElementById("sliderURe");
    sliderUIm = document.getElementById("sliderUIm");
    sliderWRe = document.getElementById("sliderWRe");
    sliderWIm = document.getElementById("sliderWIm");
    fInput = document.getElementById("fInput");
    setters = document.getElementById("setters");
    advVal = document.getElementById("setVal");
    pdfSlider = document.getElementById("pdfSlider");
}   

function draw() {
    // updates of m and K force a recalculate()
    if ( m!=Number(massSlider.value)||K!=Number(KSlider.value) ){
        m = Number(massSlider.value);
        K = Number(KSlider.value);
        massLabel.innerHTML = "Mass: " + m;
        KLabel.innerHTML ='Spring "K": ' + K;
        recalculate();}
    // updates of U and W will need something to happen
    if (u.re!=Number(sliderURe.value)||u.im!=Number(sliderUIm.value)
        ||w.re!=Number(sliderWRe.value)||w.im!=Number(sliderWIm.value)){
        u.re = Number(sliderURe.value);
        u.im = Number(sliderUIm.value);
        w.re = Number(sliderWRe.value);
        w.im = Number(sliderWIm.value);
        Ulabel.innerHTML = "<b>u</b> = " + u.toString();
        Wlabel.innerHTML = "<b>w</b> = " + w.toString();
    }
    //updates of other variables do not, but do update variables and html
    if (maxN!=Number(maxNSlider.value)){
        maxN=Number(maxNSlider.value);
        maxNLabel.innerHTML = "<b>*</b>Max value of n: " + maxN;
    }
    can.background(0);
    if(!document.getElementById("sidebar").matches(":hover")){
        orbitControl();
    }
    push();//Draws the skybox
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

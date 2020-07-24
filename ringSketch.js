'use strict'
let can,cam,per,space,massLabel,massSlider,RLabel,RSlider,cInput,cButton,fInput,RPNstack,setters,advVal,smartBox,smartMode,phi,pDomainSize,pspace,momPDF,tempEl,timeAcc,detailIn,startN,startNIn,startNSpan,minN,minNLabel,minNSlider,maxN,maxNLabel,maxNSlider,sliderURe,sliderUIm,sliderWRe,sliderWIm,Ulabel,Wlabel,showMomBox,scaleSlider,yScaleSlider;
let t=0;
let xScaler = 1;
let yScaler = 1;
let funkMode = "manual";
let showMomentum=false;
let nSpace = linspaceC(0,16,17);
let u = new Complex(1);
let w = new Complex(1);
let detail = 256;
let coef = (CompArr.ones(16)).vecNorm();
let xspace  = linspaceC(-Math.PI,Math.PI,detail);
let yspace;
let pdf;
let yscaling;//this is a variable to bump up the size of the numbers so javascript doesn't disapear them all
let xscaling;
let m = 5;
let R = 2;
let eigenStorage = [];

function cylToCart(r,theta,h){return createVector(r*Math.sin(theta),-h,r*Math.cos(theta));}
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
        case "radiusMax":
            RSlider.setAttribute("max",newVal);
            break;
        case "radiusMin":
            RSlider.setAttribute("min",newVal);
            break;
        case "minNMin":
            minNSlider.setAttribute("min",newVal);
            break;
        case "minNMax":
            minNSlider.setAttribute("max",newVal);
            break;
        case "maxNMin":
            maxNSlider.setAttribute("min",newVal);
            break;
        case "maxNMax":
            maxNSlider.setAttribute("max",newVal);
            break;
    }
}

function eigenstate(n){
    //just the shape of the eigenstates, nothing time-dependant
    if ( !Number.isInteger(n) ){throw "n must be an integer";}
    return xspace.mult(Ic.mult(n)).exp().divBy(Math.sqrt(Math.PI*2)).mult(yscaling);}

function recalculate(){
    xScaler = Number(scaleSlider.value);
    xscaling= xScaler*width/(4*Math.PI);
    yScaler = Number(yScaleSlider.value);
    if (R>(2*Math.PI)){
        yscaling=yScaler*(4*Math.PI*xscaling/3);
    } else {
        yscaling=yScaler*(R*xscaling*2)/3;
    }
    eigenStorage.length=0;
    let n;
    if (funkMode=="function"){
        for (n of nSpace){
            eigenStorage.push(eigenstate(n.re));}
    } else {
        for (n of nSpace){
            eigenStorage.push(eigenstate(n.re));}
    }
}

function superposition(time=0){
    //all the time dependant stuff needs to be in here
    //in addition anything that can change from frame to frame
    let psi = CompArr.zeros(detail);
    if (funkMode=="function"){
        coef=evalC(RPNstack,"ntuw",nSpace,time,u,w);
        if (isComp(coef)){coef = CompArr.repeat(coef,nSpace.length)}
        coef=coef.vecNorm();
    }
    let i;
    for (i of range(coef.length)){
        if(ZEROc.equals(coef[i])){continue;}//skips zero coef. for more efficient rendering
        let E = (nSpace[i].re**2)/(2*m*(R**2));
        let phasor=coef[i].mult(expC([0,E*time]));
        psi = psi.add(eigenStorage[i].mult(phasor));
    }
    return psi;
}

function integralCheck(){
    //this is a test: it outputs the probability that the particle is "somewhere" should be close to 1
    let dx = 2*Math.PI/detail;
    let ys = yspace.divBy(yscaling).mag2();//returns the true pdf of the wavefunction as CompArr()
    return ys.sum().mult(2).sub( ys[0].add(ys[ys.length-1]) ).mult(dx/2);//Performs trapezoidal integration
}
function integralCheck(momentum=false){
    //this is a test: it outputs the probability that the particle is "somewhere" should be close to 1
    let ys,dx;
    if (momentum){
        dx = 2*pDomainSize/detail;
        ys = phi.divBy(yscaling).mag2();
    } else {
        dx = 2*Math.PI/detail;
        ys = yspace.divBy(yscaling).mag2();//returns the true pdf of the wavefunction as CompArr()
    }
    return ys.sum().mult(2).sub( ys[0].add(ys[ys.length-1]) ).mult(dx/2);//Performs trapezoidal integration
}

function drawPsi(time=0){
    yspace = superposition(time);
    pdf = yspace.divBy(yscaling).mag2(false).map(y=>y*yscaling);
    let i;
    for (i of range(detail)){
        push();
        translate(cylToCart(R*xscaling,xspace[i].re,pdf[i]));
        normalMaterial();
        specularMaterial("red");
        box(Math.log(200*pdf[i]+Math.E));
        pop();
        push();
        translate(cylToCart(R*xscaling+yspace[i].im,xspace[i].re,yspace[i].re));
        normalMaterial();
        specularMaterial((2*Math.PI*i)/detail,100,60);
        sphere(Math.log(100*pdf[i]+Math.E));
        pop();
    }
    if (showMomentum){drawPhi();}
}

function drawPhi(){
    //always called after drawPsi
    let L = Math.PI*2
    phi = laceySwitch(FFT(yspace,true).mult((L)/(Math.sqrt(2*Math.PI)*detail)));
    pDomainSize = detail*Math.PI/(L);
    let xscaledown = m;
    pspace = linspaceC(-pDomainSize/xscaledown,pDomainSize/xscaledown,detail);
    momPDF = phi.divBy(yscaling).mag2(false).map(y=>y*yscaling);
    let i;
    for (i of range(detail)){
        if (momPDF[i]<0.001){continue;}
        push();
        translate(cylToCart(R*xscaling,pspace[i].re,momPDF[i]));
        normalMaterial();
        specularMaterial("orange");
        let scale=Math.log(200*momPDF[i]+Math.E);
        rotateZ(Math.PI/2);
        rotateX(pspace[i].re);
        box(scale,scale,scale*5);
        pop();
        push();
        translate(cylToCart(R*xscaling+phi[i].im,pspace[i].re,phi[i].re));
        normalMaterial();
        specularMaterial("navy");
        rotateZ(Math.PI/2);
        rotateX(pspace[i].re);
        ellipsoid(scale*2,scale,scale);
        pop();
    }
}

function axes(){
    let v;
    strokeWeight(3);
    push();
        stroke("red");
        rotateX(Math.PI/2);
        torus(R*xscaling,1,24,3);
    pop();
    push();
        noStroke();
        ambientMaterial("red");
        for (let i of range(floor(R*2*Math.PI)) ){
            push();
            translate(cylToCart(R*xscaling,-i/R,0));
            rotateZ(Math.PI/2);
            rotateX(-i/R);
            cone(15, 20, 12, 16);
            pop();            
        }
    pop();
    push();
        stroke("blue");
        beginShape();
            v=cylToCart(R*xscaling,0,yscaling);
            vertex(v.x,v.y,v.z);
            v=cylToCart(R*xscaling,0,-yscaling);
            vertex(v.x,v.y,v.z);
        endShape();
        translate(0,-yscaling,R*xscaling);
        rotateX(Math.PI);
        noStroke();
        ambientMaterial("blue");
        cone(15, 20, 12, 16);
    pop();

    push();
        stroke("green");
        beginShape();
            v=cylToCart(R*xscaling-yscaling,0,0);
            vertex(v.x,v.y,v.z);
            v=cylToCart(R*xscaling+yscaling,0,0);
            vertex(v.x,v.y,v.z);
        endShape();
        translate(0,0,R*xscaling+yscaling);
        rotateX(Math.PI/2);
        noStroke();
        ambientMaterial("green");
        cone(15, 20, 12, 16);
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
    xspace  = linspaceC(-Math.PI,Math.PI,detail);
    funkMode = document.querySelector('input[name="coeffMode"]:checked').value;
    if (funkMode=="manual"){
        coef=new CompArr(cInput.value.split(",")).vecNorm();
        let len=coef.length;
        if (smartMode){
            if (len==1){
                nSpace=[ZEROc];
            } else if (len%2 == 0){//if there is an even number of coefficients, skip 0
                nSpace = linspaceC(-len/2,len/2,len+1);
                nSpace.splice(len/2,1);
            } else {
                nSpace = linspaceC(-(len-1)/2,(len-1)/2,len);
            }
        } else {
            if (len==1){nSpace=[startN]}
            else {nSpace = linspaceC(startN,startN+len-1,len);}
        }
    } else if (funkMode=="function"){
        maxN = Number(maxNSlider.value);
        RPNstack = parseToRPN(fInput.value,"ntuw");
        nSpace = linspaceC(minN,maxN,(maxN-minN)+1);
    } else {throw "Massive radio button problem. Should be unreachable.";}
    recalculate();}


function preload() {space = loadImage('textures/space.jpg');}

function setup() {
    // put setup code here
    colorMode(HSL,2*Math.PI,100,100,100);
    can = createCanvas(windowWidth, windowHeight-5, WEBGL);
    can.parent('containment');
    cam = createCamera();
    frameRate(10);
    let i;
    timeAcc = document.getElementById("timeAcc");
    massLabel = document.getElementById("massLabel");
    massSlider = document.getElementById("massSlider");
    RLabel = document.getElementById("RLabel");
    RSlider = document.getElementById("RSlider");
    cInput = document.getElementById("cInput");
    cButton = document.getElementById("cButton");
    detailIn = document.getElementById("detailIn");
    startNIn = document.getElementById("startN");
    startNSpan = document.getElementById("autoOff");
    smartBox = document.getElementById("autoInput");
    minNLabel = document.getElementById("minNLabel");
    minNSlider = document.getElementById("minNSlider");
    maxNLabel = document.getElementById("maxNLabel");
    maxNSlider = document.getElementById("maxNSlider");
    scaleSlider = document.getElementById("scaleSlider");
    yScaleSlider = document.getElementById("yScaleSlider");
    Ulabel = document.getElementById("Ulabel");
    Wlabel = document.getElementById("Wlabel");
    sliderURe = document.getElementById("sliderURe");
    sliderUIm = document.getElementById("sliderUIm");
    sliderWRe = document.getElementById("sliderWRe");
    sliderWIm = document.getElementById("sliderWIm");
    fInput = document.getElementById("fInput");
    setters = document.getElementById("setters");
    advVal = document.getElementById("setVal");
    showMomBox = document.getElementById("showMOM");
    recalculate();
}   

function draw() {
    // updates of m and R force a recalculate()
    if ( m!=Number(massSlider.value)||R!=Number(RSlider.value)||xScaler!=Number(scaleSlider.value)||yScaler!=Number(yScaleSlider.value) ){
        m = Number(massSlider.value);
        R = Number(RSlider.value);
        massLabel.innerHTML = "Mass: " + m;
        RLabel.innerHTML ='Radius: ' + R;
        recalculate();}
    let eyeZ = ((height/2.0) / Math.tan(Math.PI*60.0/360.0));
    let skyboxScale = 5*R;
    if (skyboxScale<20){skyboxScale=20}
    perspective(Math.PI/3,width/height,eyeZ/10,skyboxScale*eyeZ);
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
    if (smartMode!=smartBox.checked){
        smartMode=smartBox.checked;
        if (smartMode){
            startNSpan.classList.add("w3-disabled");
        } else {
            startNSpan.classList.remove("w3-disabled");
        }
    }
    if (showMomentum!=showMomBox.checked){
        showMomentum=showMomBox.checked;
    }
    if (startN!=Number(startNIn.value)){
        startN=Number(startNIn.value);
    }
    if (minN!=Number(minNSlider.value)){
        minN=Number(minNSlider.value);
        minNLabel.innerHTML = "<b>*</b>Min value of n: " + minN;
    }
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
        sphere(width*skyboxScale/5);
    pop();
    ambientLight(5);
    strokeWeight(3);
    shininess(10);
    pointLight(0, 0, 60, 0, height,  height);
    pointLight(0, 0, 60, 0, height, -height);
    pointLight(0, 0, 60, 0, -height, height);
    pointLight(0, 0, 60, 0, -height,-height);
    t+=Number(timeAcc.value)*deltaTime;
    drawPsi(t/1000);
    axes();
}

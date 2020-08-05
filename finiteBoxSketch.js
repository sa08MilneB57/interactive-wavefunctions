'use strict'
let can,cam,space,massLabel,massSlider,LLabel,LSlider,VLabel,VSlider,scaleSlider,yScaleSlider,cInput,cButton,fInput,RPNstack,setters,advVal,tempEl,timeAcc,detailIn,N,sliderURe,sliderUIm,sliderWRe,sliderWIm,Ulabel,Wlabel,NLabel,NLabel2,phi,pDomainSize,pspace,momPDF,showMomBox;
let openHelpPanels=0;
let t=0;//current simulation time in milliseconds (including time acceleration) (when draw Psi is called I set time to 1000th of this)
let funkMode = "function";//typed in or calculated coefficients
let barrWidth = 0.1;
let nSpace = linspaceC(0,2,3);//the ns
let showMomentum=false;
let u = new Complex(1);//user defined custom variables
let w = new Complex(1);
let detail = 256;//number of position points to plot
let m = 3;//mass of particle
let L = 6;//length of box
let V0= 3;//potential depth
let coef = (CompArr.ones(3)).vecNorm();
let x1,x2,x3;
let xspace  = linspaceC(-L,L,detail);
let yspace;
let yScaler=1;
let E;
let pdf;
let Vs;
let yscaling;//this is a variable to bump up the size of the numbers so javascript doesn't disapear them all
let xscaling;
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
        case "lengthMax":
            LSlider.setAttribute("max",newVal);
            break;
        case "lengthMin":
            LSlider.setAttribute("min",newVal);
            break;
        case "VMax":
            VSlider.setAttribute("max",newVal);
            break;
        case "VMin":
            VSlider.setAttribute("min",newVal);
            break;
    }
}

function VU(u0,accuracy=10000){
    //computes valid airs of V and U for given u0
    if (!(u0>0)){throw "Negative u0";}
    let N = Math.ceil(2*u0/Math.PI);
    if (N>64){N=64;}//caps N at 64
    let vs = new CompArr();
    let us = new CompArr();
    let dx=u0/(accuracy-1);
    let vspace = linspaceC(dx,u0+dx,accuracy);
    let Ue = vspace.mult(vspace.tan());
    let Uo = vspace.divBy(vspace.tan()).neg();
    let uspace;
    for (let n of range(N)){
        let i = Math.round( (n*Math.PI)/(dx*2) );
        if (n%2==0){uspace = Ue;}//sets uspace based on odd vs even
        else {uspace = Uo;}
        if(uspace[i]>u0){throw "We missed it Capn";}//detects obviously huge values of u to prevent rounding issues in the tan function with PI
        while (u0**2>uspace[i].re**2+vspace[i].re**2) {i+=1;}//scans along the points (v,u) until the magnitude of the vector is u0
        i-=1;
        vs.push(vspace[i]);
        us.push(uspace[i]);
    }
    return vs;
}

function eigenstate(n,v){
    //just the shape of the eigenstates, nothing time-dependant
    if ( !Number.isInteger(n) || n<0){throw "n must be an integer greater than or equal to 0";}
    let k = 2*v/L;
    let psi1,psi2,psi3;
    if ( n%2 == 0 ){
            //even
            let a = k*Math.tan(v);
            let G = yscaling*Math.exp(a*L/2)/Math.sqrt((1/a) + ((L+((Math.sin(k*L))/(L)) ) / ( 1+Math.cos(k*L))) );
            let B = (G*Math.exp(-a*L/2))/(Math.cos(k*L/2));
            psi1 = x1.mult(a).exp().mult(G);
            psi2 = x2.mult(k).cos().mult(B);
            psi3 = x3.mult(-a).exp().mult(G);
            return psi1.concat(psi2,psi3);
    } else {
            //odd
            let a = -k/Math.tan(v);
            let G = yscaling*Math.exp(a*L/2)/Math.sqrt( (1/a) + ((L-Math.sin(2*v))/(2*Math.sin(v)*Math.sin(v))))  ;
            let A = (-G*Math.exp(-a*L/2))/(Math.sin(k*L/2));
            psi1 = x1.mult(a).exp().mult(G);
            psi2 = x2.mult(k).sin().mult(A);
            psi3 = x3.mult(-a).exp().mult(-G);
            return  psi1.concat(psi2,psi3);
    }
}


function superposition(time=0){
    //all the time-dependant stuff needs to be in here
    //in addition anything that can change from frame to frame
    let psi = CompArr.zeros(detail);
    if (funkMode=="function"){//this block creates a list of coefficients from the user defined function of n,u,w,t 
        coef=evalC(RPNstack,"ntuw",nSpace,time,u,w);
        if (isComp(coef)){coef = CompArr.repeat(coef,nSpace.length);}
        coef=coef.vecNorm();
    }
    let i;
    for (i of range(coef.length)){
        if(ZEROc.equals(coef[i])){continue;}//skips zero coef. for more efficient rendering
        let phasor=coef[i].mult(expC([0,E[i].re*time]));
        psi = psi.add(eigenStorage[i].mult(phasor));
    }
    return psi;
    
}

function recalculate(){
    xspace  = linspaceC(-L,L,detail);
    yScaler = Number(yScaleSlider.value);
    yscaling= yScaler*height/6;
    let quarter=Math.floor(detail/4);
    x1 = xspace.slice(0,quarter);
    x2 = xspace.slice(quarter,detail-quarter);
    x3 = xspace.slice(detail-quarter,detail);
    eigenStorage.length=0;
    let U0=Math.sqrt(m*V0/2)*L;
    Vs = VU(U0);
    E = Vs.square().mult(2/(L*L*m));
    N = Vs.length;
    if (N==1){nSpace=new CompArr(new Complex(0));}
    else {nSpace = linspaceC(0,N-1,N);}
    NLabel.innerHTML = "<b>*</b>Manually Input Coefficients: (Up to " + N + ")";
    NLabel2.innerHTML = "n&lt;"+N;
    funkMode = document.querySelector('input[name="coeffMode"]:checked').value;
    if (funkMode=="manual"){
        coef=new CompArr(cInput.value.split(","));
        if (coef.length < nSpace.length){
            coef.concat(CompArr.zeros(nSpace.length-coef.length));//adds zeros if there aren't enough user-supplied
        } else if (coef.length>nSpace.length){
            coef.length=nSpace.length;//cuts off extra coeficients supplied by user
        }
        coef = coef.vecNorm();
    } else if (funkMode=="function"){
        RPNstack = parseToRPN(fInput.value,"ntuw");
    } else {throw "Massive radio button problem. Should be unreachable.";}

    let n;
    for (n of nSpace){
        eigenStorage.push(eigenstate(n.re,Vs[n.re].re));
    }
}

function integralCheck(momentum=false){
    //this is a test: it outputs the probability that the particle is "somewhere" should be close to 1
    let ys,dx;
    if (momentum){
        dx = 2*pDomainSize/detail;
        ys = phi.divBy(yscaling).mag2();
    } else {
        dx = 2*L/detail;
        ys = yspace.divBy(yscaling).mag2();//returns the true pdf of the wavefunction as CompArr()
    }
    return ys.sum().mult(2).sub( ys[0].add(ys[ys.length-1]) ).mult(dx/2);//Performs trapezoidal integration
}

function drawPsi(time=0){
    yspace = superposition(time);
    pdf = yspace.divBy(yscaling).mag2().mult(yscaling);
    let i;
    for (i of range(detail)){
        push();
        translate(xscaling*xspace[i].re,-pdf[i].re,0);
        normalMaterial();
        specularMaterial("red");
        box(Math.log(200*pdf[i].re+Math.E));
        pop();
        push();
        translate(xscaling*xspace[i].re,-yspace[i].re,yspace[i].im);
        normalMaterial();
        specularMaterial((2*Math.PI*i)/detail,100,60);
        sphere(Math.log(100*pdf[i].re+Math.E));
        pop();
    }
    if (showMomentum){drawPhi();}
}

function drawPhi(){
    //always called after drawPsi
    phi = laceySwitch(FFT(yspace,true).mult((2*L)/(Math.sqrt(2*Math.PI)*detail)));
    pDomainSize = detail*Math.PI/(2*L);
    let xscaledown = m;
    pspace = linspaceC(-pDomainSize/xscaledown,pDomainSize/xscaledown,detail);
    momPDF = phi.divBy(yscaling).mag2(false).map(y=>y*yscaling);
    let i;
    for (i of range(detail)){
        if (pspace[i].mag(false)>m*L*4 || momPDF[i]<0.001){continue;}
        push();
        translate(xscaling*pspace[i].re,-momPDF[i],0);
        normalMaterial();
        specularMaterial("orange");
        let scale=Math.log(200*momPDF[i]+Math.E);
        box(scale*2,scale,scale*5);
        pop();
        push();
        translate(xscaling*pspace[i].re,-phi[i].re,phi[i].im);
        normalMaterial();
        specularMaterial("navy");
        ellipsoid(scale*2,scale,scale);
        pop();
    }
}

function axes(){
    strokeWeight(3);

    push();
    //position axis
        stroke("red");beginShape();
        vertex(-xscaling*L,0,0);
        vertex(xscaling*L,0,0);
        endShape();
        let i;
        for (i of range(floor(L))){
            translate(xscaling,0,0);
            push();
            rotateZ(-Math.PI/2);
            cone(10, 20, 4, 16);
            pop();
        }
    pop();

    push();
        stroke("blue");beginShape();
        vertex(0,yscaling,0);
        vertex(0,-yscaling,0);
        endShape();
        translate(0,-yscaling,0);
        rotateX(Math.PI);
        cone(10, 20, 4, 16);
    pop();

    push();
        stroke("green");beginShape();
        vertex(0,0,-yscaling);
        vertex(0,0,yscaling);
        endShape();
        translate(0,0,yscaling);
        rotateX(Math.PI/2);
        cone(10, 20, 4, 16);
    pop();
    noStroke();
    let potScale = yscaling*V0;
    if (cam.eyeX<0){//this switches the rendering order of the lids depending on where the camera is to make sure both are always rendered properly
        push();
        //positive cap
            translate(xscaling*(L+barrWidth)/2,0,0);
            fill(0,100,50,50);
            box(xscaling*barrWidth,potScale,potScale);
        pop();
        
        push();
        //negativ cap
            translate(-xscaling*(L+barrWidth)/2,0,0);
            fill(0,100,50,50);
            box(xscaling*barrWidth,potScale,potScale);

        pop();
    } else {
        push();
        //negativ cap
            translate(-xscaling*(L+barrWidth)/2,0,0);
            fill(0,100,50,50);
            box(xscaling*barrWidth,potScale,potScale);

        pop();
        push();
        //positive cap
            translate(xscaling*(L+barrWidth)/2,0,0);
            fill(0,100,50,50);
            box(xscaling*barrWidth,potScale,potScale);

        pop();
    }
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
    NLabel = document.getElementById("upToN");
    NLabel2 = document.getElementById("lastN");
    timeAcc = document.getElementById("timeAcc");
    massLabel = document.getElementById("massLabel");
    massSlider = document.getElementById("massSlider");
    LLabel = document.getElementById("LLabel");
    LSlider = document.getElementById("LSlider");
    VLabel = document.getElementById("VLabel");
    VSlider = document.getElementById("VSlider");
    cInput = document.getElementById("cInput");
    cButton = document.getElementById("cButton");
    detailIn = document.getElementById("detailIn");
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
    xscaling = scaleSlider.value*width/8;
    // updates of m and L force a recalculate()
    if ( m!=Number(massSlider.value)||L!=Number(LSlider.value)||V0!=Number(VSlider.value)||yScaler!=Number(yScaleSlider.value) ){
        m = Number(massSlider.value);
        L = Number(LSlider.value);
        V0= Number(VSlider.value);
        massLabel.innerHTML = "Mass: " + m;
        LLabel.innerHTML ='Length "L": ' + L;
        VLabel.innerHTML ='Potential "V&#8320;": ' + V0;
        recalculate();}
    let eyeZ = ((height/2.0) / Math.tan(Math.PI*60.0/360.0));
    let skyboxScale = 5*L/3;
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
    can.background(0);
    if(!(document.getElementById("sidebar").matches(":hover")||openHelpPanels>0)){
        orbitControl();
    }
    if (showMomentum!=showMomBox.checked){
        showMomentum=showMomBox.checked;
    }
    push();//Draws the skybox
        noStroke();
        texture(space);
        sphere(width*skyboxScale/5);
    pop();
    ambientLight(5);
    strokeWeight(3);
    shininess(10);
    pointLight(0, 0, 60, 0, height/2, -height/2);
    pointLight(0, 0, 60, 0, -height/2, height/2);
    t+=Number(timeAcc.value)*deltaTime;
    drawPsi(t/1000);
    axes();
}

'use strict'
let can,cam,space,massLabel,massSlider,LLabel,LSlider,scaleSlider,yScaleSlider,cInput,cButton,fInput,RPNstack,setters,advVal,phi,pDomainSize,pspace,momPDF,tempEl,timeAcc,detailIn,maxN,maxNLabel,maxNSlider,sliderURe,sliderUIm,sliderWRe,sliderWIm,Ulabel,Wlabel,standingBox,showMomBox;
let openHelpPanels=0;
let t=0;//current simulation time in milliseconds (including time acceleration) (when draw Psi is called I set time to 1000th of this)
let funkMode = "manual";//typed in or calculated coefficients
let yScaler = 1;
let nSpace = linspaceC(1,16,16);//the ns
let showMomentum=false;
let u = new Complex(1);//user defined custom variables
let w = new Complex(1);
let detail = 256;//number of position points to plot
let m = 25;//mass of particle
let L = 4;//length of box
let coef = (CompArr.ones(16)).vecNorm();
let xspace  = linspaceC(-L/2,L/2,detail);
let yspace, yInc, yRef;
let pdf;
let yscaling;//this is a variable to bump up the size of the numbers so javascript doesn't disapear them all
let xscaling;
let eigenStorage = [];
let showStanding = false;

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
        case "maxNMax":
            maxNSlider.setAttribute("max",newVal);
            break;
    }
}

function eigenstate(n,standing=false){
    //standing=false means it won't return the split up version with two simultaneous momenta
    //standing=true will only return the two opposite momenta, positive first
    //just the shape of the eigenstates, nothing time-dependant
    if ( !Number.isInteger(n) || n<1){throw "n must be a positive integer";}
    let k = n*Math.PI/L;
    if(standing){
        let A = yscaling*Math.sqrt(0.5/L);//scaling for incident and reflected
        let iA= Ic.mult(A);
        let incident,reflected;
        if ( n%2 == 0 ){
            //even
            incident  = xspace.mult(Ic.mult(k)).exp().mult(iA.neg());
            reflected = xspace.mult(Ic.mult(-k)).exp().mult(iA);
        } else {
            //odd
            incident  = xspace.mult(Ic.mult(k)).exp().mult(A);
            reflected = xspace.mult(Ic.mult(-k)).exp().mult(A);
        }
        return [incident.add(reflected),incident,reflected];
    } else {
        if ( n%2 == 0 ){
            //even
            return xspace.mult(k).sin().mult(Math.sqrt(2/L)*yscaling);
        } else {
            //odd
            return  xspace.mult(k).cos().mult(Math.sqrt(2/L)*yscaling);
        }
    }
}

function superposition(time=0,standing=false){
    //standing=false means it won't return the split up version with two simultaneous momenta
    //all the time-dependant stuff needs to be in here
    //in addition anything that can change from frame to frame
    let psi = CompArr.zeros(detail);
    if (standing){
        var inc = CompArr.zeros(detail);
        var ref = CompArr.zeros(detail);
    }
    if (funkMode=="function"){//this block creates a list of coefficients from the user defined function of n,u,w,t 
        coef=evalC(RPNstack,"ntuw",nSpace,time,u,w);
        if (isComp(coef)){coef = CompArr.repeat(coef,nSpace.length)}
        coef=coef.vecNorm()
    }
    let i;
    for (i of range(coef.length)){
        if(ZEROc.equals(coef[i])){continue;}//skips zero coef. for more efficient rendering
        let E = (nSpace[i].re*nSpace[i].re*Math.PI*Math.PI)/(2*m*L*L);//(n^2*pi^2)/(2mL^2)
        let phasor=coef[i].mult(expC([0,E*time]));
        if (standing){
            psi = psi.add(eigenStorage[i][0].mult(phasor));
            inc = inc.add(eigenStorage[i][1].mult(phasor));
            ref = ref.add(eigenStorage[i][2].mult(phasor));
        } else {
            psi = psi.add(eigenStorage[i].mult(phasor));
        }
    }
    if (standing){
        return [psi,inc,ref];
    } else {
        return psi;
    }
}

function recalculate(){
    xspace  = linspaceC(-L/2,L/2,detail);
    yScaler = Number(yScaleSlider.value);
    yscaling= yScaler*(Math.sqrt(L)*height/4);
    eigenStorage.length=0;
    let n;
    if (funkMode=="function"){
        for (n of nSpace){
            eigenStorage.push(eigenstate(n.re,showStanding));}
    } else {
        for (n of nSpace){
            eigenStorage.push(eigenstate(n.re,showStanding));}
    }
}

function integralCheck(momentum=false){
    //this is a test: it outputs the probability that the particle is "somewhere" should be close to 1
    let ys,dx;
    if (momentum){
        dx = 2*pDomainSize/detail;
        ys = phi.divBy(yscaling).mag2();
    } else {
        dx = L/detail;
        ys = yspace.divBy(yscaling).mag2();//returns the true pdf of the wavefunction as CompArr()
    }
    return ys.sum().mult(2).sub( ys[0].add(ys[ys.length-1]) ).mult(dx/2);//Performs trapezoidal integration
}

function drawPsi(time=0){
    if (showStanding){
        let psistore = superposition(time,showStanding);
        yspace = psistore[0];
        yInc = psistore[1];
        yRef = psistore[2];
    } else {
        yspace = superposition(time,showStanding);
    }
    pdf = yspace.divBy(yscaling).mag2().mult(yscaling);
    let i;
    for (i of range(detail)){
        push();
        translate(xscaling*xspace[i].re,-pdf[i].re,0);
        normalMaterial();
        if(showStanding){specularMaterial(0,100,50,50);}
        else{specularMaterial(0,100,50);}
        box(Math.log(200*pdf[i].re+Math.E));
        pop();
        push();
        translate(xscaling*xspace[i].re,-yspace[i].re,yspace[i].im);
        normalMaterial();
        if(showStanding){specularMaterial((2*Math.PI*i)/detail,100,60,50);}
        else{specularMaterial((2*Math.PI*i)/detail,100,60);}
        sphere(Math.log(100*pdf[i].re+Math.E));
        pop();
        if (showStanding){
            let scale = Math.log(30*pdf[i].re+Math.E);
            push();
            noStroke();
            translate(xscaling*xspace[i].re,-yInc[i].re,yInc[i].im);
            specularMaterial(0,100,60);
            rotateZ(Math.PI/2);
            cone(scale,2*scale,4);
            pop();
            push();
            noStroke();
            translate(xscaling*xspace[i].re,-yRef[i].re,yRef[i].im);
            specularMaterial(Math.PI,100,60);
            rotateZ(-Math.PI/2);
            cone(scale,2*scale,4);
            pop();
        }
    }
    if (showMomentum){drawPhi(time);}
}

function drawPhi(){
    //always called after drawPsi
    phi = laceySwitch(FFT(yspace,true).mult((L)/(Math.sqrt(2*Math.PI)*detail)));
    pDomainSize = detail*Math.PI/(L);
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
        box(scale,scale,scale*5);
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
        vertex(-xscaling*L/2,0,0);
        vertex(xscaling*L/2,0,0);
        endShape();
        let i;
        for (i of range(floor(L/2))){
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
    if (cam.eyeX<0){//this switches the rendering order of the lids depending on where the camera is to make sure both are always rendered properly
        push();
        //positive cap
            translate(xscaling*L/2,0,0);
            rotateY(-Math.PI/2);
            fill(0,100,50,50);
            plane(yscaling*2,yscaling*2,4,4);
        pop();
        
        push();
        //negativ cap
            translate(-xscaling*L/2,0,0);
            rotateY(-Math.PI/2);
            fill(0,100,50,50);
            plane(yscaling*2,yscaling*2,4,4);
        pop();
    } else {
        push();
        //negativ cap
            translate(-xscaling*L/2,0,0);
            rotateY(-Math.PI/2);
            fill(0,100,50,50);
            plane(yscaling*2,yscaling*2,4,4);
        pop();
        push();
        //positive cap
            translate(xscaling*L/2,0,0);
            rotateY(-Math.PI/2);
            fill(0,100,50,50);
            plane(yscaling*2,yscaling*2,4,4);
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
    funkMode = document.querySelector('input[name="coeffMode"]:checked').value;
    if (funkMode=="manual"){
        coef=new CompArr(cInput.value.split(",")).vecNorm();
        if (coef.length==1){
            nSpace = new CompArr(ONEc);
        } else {
            nSpace = linspaceC(1,coef.length,coef.length);
        }
    } else if (funkMode=="function"){
        maxN = Number(maxNSlider.value);
        RPNstack = parseToRPN(fInput.value,"ntuw");
        if (maxN==1){
            nSpace = new CompArr(ONEc);
        } else {
            nSpace = linspaceC(1,maxN,maxN);
        }
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
    timeAcc = document.getElementById("timeAcc");
    massLabel = document.getElementById("massLabel");
    massSlider = document.getElementById("massSlider");
    LLabel = document.getElementById("LLabel");
    LSlider = document.getElementById("LSlider");
    cInput = document.getElementById("cInput");
    cButton = document.getElementById("cButton");
    detailIn = document.getElementById("detailIn");
    scaleSlider = document.getElementById("scaleSlider");
    yScaleSlider = document.getElementById("yScaleSlider");
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
    standingBox = document.getElementById("standingBox");
    showMomBox = document.getElementById("showMOM");
    recalculate();
}   

function draw() {
    xscaling = scaleSlider.value*width/5;
    // updates of m and L force a recalculate()
    if ( m!=Number(massSlider.value)||L!=Number(LSlider.value)||standingBox.checked!=showStanding||yScaler != Number(yScaleSlider.value) ){
        m = Number(massSlider.value);
        L = Number(LSlider.value);
        showStanding = standingBox.checked;
        massLabel.innerHTML = "Mass: " + m;
        LLabel.innerHTML ='Length "L": ' + L;
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
    if (maxN!=Number(maxNSlider.value)){
        maxN=Number(maxNSlider.value);
        maxNLabel.innerHTML = "<b>*</b>Max value of n: " + maxN;
    }
    if (showMomentum!=showMomBox.checked){
        showMomentum=showMomBox.checked;
    }
    can.background(0);
    if(!(document.getElementById("sidebar").matches(":hover")||openHelpPanels>0)){
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
    pointLight(0, 0, 60, 0, height/2, -height/2);
    pointLight(0, 0, 60, 0, -height/2, height/2);
    t+=Number(timeAcc.value)*deltaTime;
    drawPsi(t/1000);
    axes();
}
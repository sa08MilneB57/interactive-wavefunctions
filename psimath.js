//THIS FILE MUST BE LOADED AFTER mathplus.js AND p5.js and BEFORE sketch.js

'use strict'
let detail = 301;
let reDomain = 3;
let coef = (CompArr.ones(32)).vecNorm();
let xspace  = linspace(-reDomain,reDomain,detail);
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
    xscaling=(width/2)/reDomain;
    yscaling=(height/2)
    eigenStorage.length=0;
    coef = coef.vecNorm();
    let n; for (n of range(coef.length)){
        eigenStorage.push(eigenstate(n));}}

function superposition(time=0){
    let psi = CompArr.zeros(detail)
    let n;
    for (n of range(coef.length)){
        if(ZEROc.equals(coef[n])){continue;}
        let phasor=coef[n].mult(expC([0,w0*(n+0.5)*time]));
        psi = psi.add(eigenStorage[n].mult(phasor));
    }
    yspace = psi;
    pdf = yspace.divBy(yscaling).mag2(false).map(x=>x*yscaling);
}

function drawPsi(time=0){
    superposition(time);
    let i;
    for (i of range(detail)){
        push();
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
    translate(width/6,0,0);
        push();
        rotateZ(-Math.PI/2);
        cone(10, 20, 4, 16);
        pop();
    translate(width/6,0,0);
        push();
        rotateZ(-Math.PI/2);
        cone(10, 20, 4, 16);
        pop();
    translate(width/6,0,0);
        push();
        rotateZ(-Math.PI/2);
        cone(10, 20, 4, 16);
        pop();
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

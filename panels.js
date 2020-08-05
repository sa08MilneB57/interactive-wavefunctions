'use strict'
//help.js
//has all the shared help and sidebar stuff in it
let helpClass = "help-panel w3-panel w3-card-4 w3-blue w3-display-middle w3-display-container";

function baropen() {
      document.getElementById("sidebar").style.display = "block";
      document.getElementById("sideclose").style.display = "block";
    }

function barclose() {
  document.getElementById("sidebar").style.display = "none";
  document.getElementById("sideclose").style.display = "none";
}
function helpopen(name,page="") {
    let panel = document.getElementById("helpPanel"+name);
    openHelpPanels++;
    if (panel == null){
        switch (name){
            case "momentum":
                panel = document.createElement("div");
                panel.setAttribute("id","helpPanelmomentum");
                panel.setAttribute("style","display:none");
                panel.setAttribute("class",helpClass);
                panel.innerHTML =  '<h3>Help- "Wavefunctions of Momentum"</h3>\n'
                                   + '<p class="w3-container w3-card-4 w3-khaki"><b>Warning:</b> Can be slow for large or strange numbers of points. For top efficiency, set no. of points to a power of 2 like 256 or 512</p>\n'
                                   + '<p>By default this simulation displays the wavefuntion of position. That\'s the one represented by the rainbow spheres. You may have heard of the uncertainty principle, which states that you can\'t know precisely where a particle is and how fast its going.</p>\n'
                                   + '<p>The position wavefunction tells you how likely a particle is to be found in a particular place. The momentum wavefunction tells you how likely it is to be found with a specific amount of momentum. Which is basically how hard it is capable of hitting something.</p>\n'
                                   + '<p>Because these simulations are taking place over very small distances, we know the position more precisely, and the values of momentum the wavefunction corresponds to spread out and can get very large. I have scaled it down by the mass so that the wavefunction displayed shows how likely it is to have a particular velocity, rather than momentum.</p>\n'
                                   + '<p>i.e. 1 unit on the x-axis means 1 unit of distance per second</p>\n'
                                   + '<p>The momentum wavefunction is represented by the dark blue ovaloids and the probability density of momentum is represented by the orange bars. You will notice that the level of detail doesn\'t depend on the detail of the position wavefunction and that changing the length of the x-axis makes the momentum function more detailed. The reasons are well beyond the scope of this project but for more information about why, look up "The Fourier Transform" its some very lovely maths.</p>\n'
                                   + '<input id="helpClose" type="button" class="w3-btn w3-card-4 w3-ripple w3-display-topright w3-purple w3-hover-deep-purple" value="X" onClick="helpclose(\'momentum\')"/>\n';
                document.body.appendChild(panel);
                break;
            case "Wavefunctions":
                panel = document.createElement("div");
                panel.setAttribute("id","helpPanelWavefunctions");
                panel.setAttribute("style","display:none");
                panel.setAttribute("class",helpClass);
                panel.innerHTML =   '<h3>Help- "Wavefunctions"</h3>\n'
                                    + '<p>The question "What exactly is a wavefunction?" will probably earn the person who definitively answers it a Nobel Prize. Some phycisists believe its an accounting trick and has "no physical meaning" until we measure it. "Many Worlds" followers think its the result of parallel universes mixing together. "Pilot Wave" or Bohmian mechanics followers think its a real physical thing that merely "guides" particles. Everybody agrees that the wavefunction is useful and carries information about the probability that a particle will have certain properties, in our case, a position.</p>\n'
                                    + '<p>The wavefunction itself is plotted by the rainbow coloured spheres. When we say it represents probability we mean that if you square the distance of that sphere from the zero line you get something called a probability density function. This is represented by the red cubes. The probability of finding a particle in any part of the x-axis is equal to the area underneath the curve in that area. The area under the whole curve is 1, which means there is a 100% chance the particle is "somewhere". The area vs height distinction is an important one, the probability of finding a particle is partly dependent on the sensitivity of your detector. So a detector that works over a wider span of the x-axis will have a high chance of finding the particle.</p>\n'
                                    + '<input id="helpClose" type="button" class="w3-btn w3-card-4 w3-ripple w3-display-topright w3-purple w3-hover-deep-purple" value="X" onClick="helpclose(\'Wavefunctions\')"/>';
                document.body.appendChild(panel);
                break;
            case "QuantumNumbers":
                panel = document.createElement("div");
                  panel.setAttribute("id","helpPanelQuantumNumbers");
                  panel.setAttribute("style","display:none");
                  panel.setAttribute("class",helpClass);
                  panel.innerHTML =   '<h3>Help- "Quantum Numbers"</h3>\n'
                                      + '<p>For all but one (Finite Well) of the systems simulated on this site, there are an infinite number of states the particle could have, but even if there wasn\'t, it would be useful to number them anyway. These numbers are called quantum numbers and an electron in a regular atom has four of them that index the possible energies and angular momentums and spins...</p>\n'
                                      + '<p>Nothing on this site is so complicated as an atom and all the simulations have only one quantum number "n" which indexes the allowed energy levels. So a bigger n means that state has more energy. The energy affects how the state evolves over time.</p>\n'
                                      + '<img src="./equations/phi.gif"/>\n'
                                      + '<p>What this equation says is that higher energy states will rotate faster than lower energy ones. This difference in rotation speed is what makes it possible for stationary states to add together to make something that moves. For the simulations here, that h-bar under the E is just 1 and is omitted from most of the equations on this site.</p>\n'
                                      + '<p>Quantum objects can exist in more than one state simultaneously and that\'s what the equation to the in the orange box describes. The symbol on the left of the equals sign stands for the position wavefunction and its called "Psi". The big "E" symbol on the right hand side is called "Sigma" and it means "sum". The "<b>|n></b>" symbol stands for the energy state "n", and Cn stands for "Coefficient of n". Coefficients are just a number that you mutiply each state by. You can choose them below.</p>\n'
                                      + '<p>What this equation describes is called "superposition" and its literally saying "sum the states together": <i>C<sub>1</sub></i><b>|1></b>+<i>C<sub>2</sub></i><b>|2></b>+<i>C<sub>3</sub></i><b>|3></b>+<i>C<sub>4</sub></i><b>|4></b></p>\n'
                                      + '<input id="helpClose" type="button" class="w3-btn w3-card-4 w3-ripple w3-display-topright w3-purple w3-hover-deep-purple" value="X" onClick="helpclose(\'QuantumNumbers\')"/>';
                  document.body.appendChild(panel);
                  break;
            case "Coefficients":
                panel = document.createElement("div");
                  panel.setAttribute("id","helpPanelCoefficients");
                  panel.setAttribute("style","display:none");
                  panel.setAttribute("class",helpClass);
                  panel.innerHTML =   '<h3>Help- "Coefficients and Normalisation"</h3>\n'
                                      + '<p>Normalisation is the art of making things equal to one. In quantum mechanics, the thing we often want to be equal to one is the probability of finding the particle <i>anywhere</i> and it is equal to the area under the PDF (Red Cubes).</p>\n'
                                      + '<p>The coefficients correspond to the chance of finding a particle with a particular energy. The chance when you measure the particle of having energy "E<sub>n</sub>" equals "|<i>C<sub>n</sub></i>|<sup>2</sup>" which just means the magnitude squared. Which for complex numbers is the distance from 0 squared. There also needs to be a 100% chance that the particle is found with some energy. This means choosing coeficients carefully, but you can just type in any numbers or equations you like.</p>\n'
                                      + '<p>The computer will automatically scale your choices so that they are the same size relative to each other but P=1. It does this by treating the coefficients as the coordinates of somewhere in N-dimensional space. Then it takes those co-ordinates and maps them onto a sphere around the origin of radius 1, like a star map, and uses those co-ordinates.</p>\n'
                                      + '<p>If you click <button onClick="updateProbability()" class="w3-button w3-ripple w3-purple w3-hover-deep-purple">this</button> button it should update the equation below to show you how close the simulation actually is.</p>\n'
                                      + '<p id="PEquation">P = 1</p>\n'
                                      + '<p>There are two ways you can choose your coefficients: you can type them in a list, or you can write a function of "n" that produces them. The radio button sets which "Mode" you\'re in when you hit "Apply" near the bottom.</p>\n'
                                      + '<input id="helpClose" type="button" class="w3-btn w3-card-4 w3-ripple w3-display-topright w3-purple w3-hover-deep-purple" value="X" onClick="helpclose(\'Coefficients\')"/>';
                  document.body.appendChild(panel);
                  break;
            case "Manual":
                panel = document.createElement("div");
                  panel.setAttribute("id","helpPanelManual");
                  panel.setAttribute("style","display:none");
                  panel.setAttribute("class",helpClass);
                  panel.innerHTML =   '<h3>Help- "Manual Mode"</h3>\n'
                                      + '<p>This mode allows you to type in a list of numbers that correspond to the probability of a particle having a certain energy level, the Coefficients of each state. If you type in, "3,2,1" for the particle in a box then the coefficients for the first three eigenstates will be C<sub>1</sub>=3,C<sub>2</sub>=2,C<sub>3</sub>=1. The computer then multiplies each of the energy states "|n>"" by these numbers in order and adds those together.</p>\n'
                                      + '<p>In order to "normalise" the function, we divide all of the coeficients by a number. If you treat the coeficients as coordinates then we want to force that point to be exactly one unit away from 0 so the easiest way to do that is to divide by your distance from 0, which for 2 co-ordinates is just pythagoras.</p>\n'
                                      + '<p>The following equation is for the current simulation.</p>\n'
                                      + '<img src="./equations/psiVerbose' + page + '.gif"/>\n'
                                      + '<p>You can also type complex numbers in here like "1+1i" or "-3i" which lets you pick the "phase" or "starting angle" of the energy states. To view a single state on its own, type in something like "0,0,1" or "0,1i" or "0,0,0,1+1i" and the particle will only have that energy state.</p>\n'
                                      + '<p>Click <a href="https://github.com/sa08MilneB57/interactive-wavefunctions" target="_blank">Here</a> for the readme files. README.md and suggestedcoeficients.md have information on the maths and suggests coefficients or functions to type in.</p>\n'
                                      + '<input id="helpClose" type="button" class="w3-btn w3-card-4 w3-ripple w3-display-topright w3-purple w3-hover-deep-purple" value="X" onClick="helpclose(\'Manual\')"/>';
                  document.body.appendChild(panel);
                  break;
            case "FunkMode":
                panel = document.createElement("div");
                  panel.setAttribute("id","helpPanelFunkMode");
                  panel.setAttribute("style","display:none");
                  panel.setAttribute("class",helpClass);
                  panel.innerHTML =   '<h3>Help- "Function Mode"</h3>\n'
                                      + '<p>This mode allows you to type in an equation and use that to define your coefficients. So if you typed in "u*n+1" then C<sub>3</sub> equals "3*u+1". You can use 4 variables n,t,u,w. n is the quantum number for which energy state it is. Be careful dividing by n because the Harmonic Well and Ring have energy states labelled 0. and you don\'t divide by 0. t is the current time.(If you slow down time, this number increases more slowly too.) u and w are variables that you can change with the bars above the input box and they update in real time. The first bar changes the real part, and the second bar changes the imaginary part.</p>\n'
                                      + '<p>Apart from that you can use complex numbers like 1+1i and these operators + - mean "plus" and "minus", * / mean "times" and "divide", ^ means to the power of, and brackets work normally.</p>\n'
                                      + '<p>Functions available include sin() cos() tan() exp() ln() log(x,base) re() im() mag() arg()</p>\n'
                                      + '<p>By default it should show "exp(-((n-u)^2)/(2*w^2))" which is called a gaussian distribution. It means that the real part of u sets the most likely energy and smoothly decreases for states further away. The "spread" is defined by the real part of w. If you lower w it means the average energy of u becomes more and more likely and when you increase w, further and further away energy states become possible.</p>\n'
                                      + '<p>Click <a href="https://github.com/sa08MilneB57/interactive-wavefunctions" target="_blank">Here</a> for the readme files. README.md and suggestedcoeficients.md have information on the maths and suggests functions or coefficients to type in.</p>\n'
                                      + '<input id="helpClose" type="button" class="w3-btn w3-card-4 w3-ripple w3-display-topright w3-purple w3-hover-deep-purple" value="X" onClick="helpclose(\'FunkMode\')"/>';
                  document.body.appendChild(panel);
                  break;
            case "Complex":
                panel = document.createElement("div");
                panel.setAttribute("id","helpPanelComplex");
                panel.setAttribute("style","display:none");
                panel.setAttribute("class",helpClass);
                panel.innerHTML =   '<h3>Help- "Imaginary and Complex Numbers"</h3>\n'
                                    + '<p>Imaginary numbers are a way of extending normal numbers to 2D. Since negative numbers don\'t normally have a square root, we call &#8730;-1 "i" and place it one unit above the real number-line. This means 1+i is a number 1 unit along the real axis and 1 unit along the "Imaginary" axis.</p>\n'
                                    + '<p>Wavefunctions are "complex valued" which means they have a normal number as input but the output is two dimensional. In that they have a "Real" part, which is just a number, and an "Imaginary" part, which are the real numbers multiplied by "i" . The input is plotted over the red axis, and the output is plotted as the real part on the blue(up/down) and the imaginary part on the green(sideways) axes.</p>\n'
                                    + '<p>This might seem very arbitrary but the Complex numbers have a great deal of very useful properties. For instance, multiplication by "i" is a 90 degree rotation. Its important to stress that Complex numbers are just like normal numbers in most ways and "imaginary" is a naming convention that stuck, and not a good name.</p>\n'
                                    + '<p><a href"https://github.com/sa08MilneB57/interactive-wavefunctions">Click Here</a>for the readme files. README.md and suggestedcoeficients.md have information on the maths and suggests functions or coefficients to type in.</p>\n'
                                    + '<input id="helpClose" type="button" class="w3-btn w3-card-4 w3-ripple w3-display-topright w3-purple w3-hover-deep-purple" value="X" onClick="helpclose(\'Complex\')"/>';
                document.body.appendChild(panel);
                break;
            default:
                throw "Panel Does Not Exist";
        }
    }
    panel.style.display = "block";

}

function helpclose(name) {
  openHelpPanels--;
  document.getElementById("helpPanel"+name).style.display = "none";
}

function updateProbability(){
  document.getElementById("PEquation").innerHTML = "P = " + integralCheck().re;
}
'use strict'
//=======Variable Checkers==============//
function isComp(arg){return arg instanceof Complex;}
function isCArr(arg){return arg instanceof CompArr && arg.every(isComp);}
function isArr(arg){return arg instanceof Array && !isCArr(arg);}
function isBoolean(arg) {return typeof arg === 'boolean';}
function isNumber(arg) {return typeof arg === 'number';}
function isString(arg) {return typeof arg === 'string';}
function isFunction(arg) {return typeof arg === 'function';}
function isCompLike(arg) {
    return (isNumber(arg)||isString(arg)
        ||( isArr(arg)&&arg.length==2&&arg.every(isNumber) ))}

//=========Miscellaneous Non-Math Functions========//
var debugModeActive =false;
function debug(a){
    if (typeof a === 'undefined'){debugModeActive=!debugModeActive;return debugModeActive;
    }else if (isBoolean(a)){debugModeActive=a;return debugModeActive;
    }else{throw "Looks like its time to debug the debugger. bugger."}
}
function debugCall(message,...objs){
    if (debugModeActive){
        console.log("Debug Message: "+message);
        let obj;
        for (obj of objs){console.log(obj);}
    }
}
function matchIndex(re,str){
  let matches = [];
  let match;
  while ((match = re.exec(str)) != null) {
    matches.push(match.index);
  }
  return matches;
}

function replaceAt(str,index,replacement) {
    //replaces the indexth element of string with replacement and returns new string
    return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
}


//=======Array Handling and Generation=====///
function* range(number) {
    //generator from 0 to n-1
    for (let i=0;i<number;i++) {
        yield i;} 
}
//functions like python's zip
const zip = (...rows) => [...rows[0]].map( (_,c) => rows.map(row => row[c]) ) ;

function linspace(low,high,len) {
    var arr = [];
    var step = (high - low) / (len - 1);
    for (var i = 0; i < len; i++) {
        arr.push(low + (step * i));
    }
    return arr;
}

//========Randomness Functions================//
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;}

function randFrom(list){return list[ randInt(0,list.length-1) ];}

function shuffleArr(list){
    let from=[...range(list.length)];
    let perm=[];
    let ans=[];
    while(from.length>0){perm.push(from.splice(randInt(0,from.length-1),1)[0]);}
    let x;
    for (x of range(perm.length)){ans.push(list[perm[x]]);}
    return ans;
}

//=======Non Complex Math Functions=========//
const FACTORIALS = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000, 620448401733239439360000, 15511210043330985984000000, 403291461126605635584000000, 10888869450418352160768000000, 304888344611713860501504000000, 8841761993739701954543616000000, 265252859812191058636308480000000, 8222838654177922817725562880000000, 263130836933693530167218012160000000, 8683317618811886495518194401280000000, 295232799039604140847618609643520000000, 10333147966386144929666651337523200000000, 371993326789901217467999448150835200000000, 13763753091226345046315979581580902400000000, 523022617466601111760007224100074291200000000, 20397882081197443358640281739902897356800000000, 815915283247897734345611269596115894272000000000, 33452526613163807108170062053440751665152000000000, 1405006117752879898543142606244511569936384000000000, 60415263063373835637355132068513997507264512000000000, 2658271574788448768043625811014615890319638528000000000, 119622220865480194561963161495657715064383733760000000000, 5502622159812088949850305428800254892961651752960000000000, 258623241511168180642964355153611979969197632389120000000000, 12413915592536072670862289047373375038521486354677760000000000, 608281864034267560872252163321295376887552831379210240000000000, 30414093201713378043612608166064768844377641568960512000000000000, 1551118753287382280224243016469303211063259720016986112000000000000, 80658175170943878571660636856403766975289505440883277824000000000000, 4274883284060025564298013753389399649690343788366813724672000000000000, 230843697339241380472092742683027581083278564571807941132288000000000000, 12696403353658275925965100847566516959580321051449436762275840000000000000, 710998587804863451854045647463724949736497978881168458687447040000000000000, 40526919504877216755680601905432322134980384796226602145184481280000000000000, 2350561331282878571829474910515074683828862318181142924420699914240000000000000, 138683118545689835737939019720389406345902876772687432540821294940160000000000000, 8320987112741390144276341183223364380754172606361245952449277696409600000000000000, 507580213877224798800856812176625227226004528988036003099405939480985600000000000000, 31469973260387937525653122354950764088012280797258232192163168247821107200000000000000, 1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000, 126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000, 8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000, 544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000, 36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000, 2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000, 171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000, 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000, 850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000, 61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000, 4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000, 330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000, 24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000, 1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000, 145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000, 11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000, 894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000, 71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000, 5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000, 475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000, 39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000, 3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000, 281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000, 24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000, 2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000, 185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000, 16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000, 1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000, 135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000, 12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000, 1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000, 108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000, 10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000, 991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000, 96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000, 9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000, 933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000, 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000];
function factorial(number) {
    if (number < 0){throw "factorial only accepts positive integers";
    }else if (number <= 100){//only has the first 100 stored for speed
        return FACTORIALS[number];
    } else {console.log("Warning, that's a big number to factorial."); return number*factorial(number-1);}
}

function H (n,x) {
    /*returns the value of the nth hermitian 
    polynomial at x, accepts numbers or arrays of numbers*/
    if (!Number.isInteger(n) || n<0) {throw "Hermit Error:n must be a counting number";}
    if (isArr(x)&&x.every(isNumber)){return x.map( (point)=>H(n,point) );}
    let y = 0;
    let mMax = Math.floor(n/2)+1;
    let m;
    for (m of range(mMax)) {y+=(((-1)**m)*((2*x)**(n-2*m)))/(factorial(m)*factorial(n-2*m));}
    y *= factorial(n);
    return y;
}



//==================Complex Numbers===========================

class Complex {
    //Definition of Complex numbers
    constructor(a , b=0) {
        if (isString(a) && b==0){
            let z = Complex.fromString(a);
            this.re = z.re;
            this.im = z.im;
        } else if (isArr(a)&&a.length==2&&b==0) {
            this.re = a[0];
            this.im = a[1];
        } else if (isNumber(a)&&isNumber(b)){
        this.re = a;
        this.im = b;
        } else {
            debugCall("new Complex Failure","Re:",a,"Im:",b);
            throw "Invalid Arguments when trying to call Complex";
        }
    }
    static polar(mag,arg){
    //allows definition of complex numbers by polar representation
        return new Complex(mag*Math.cos(arg),mag*Math.sin(arg));
    }
    //==============String Methods==========================//
    toString() {
        if (this.im >= 0){
            return `${this.re} + ${this.im}i`;
        } else {
            return `${this.re} - ${-this.im}i`;
        }
    }

    static whereIsI(string,operator){
        //convenience function for fromString()
            return string.indexOf("i")<string.indexOf(operator)
        }

    static fromString(str) {
        //takes string of the form standard mathematical form with up to two terms
        //(ignores whitespace and leading plusses) (terms cannot both be real or both imaginary)
        //and returns a new complex number
        str=str.replace(/\s/g,"");//removes whitespace
        if (str.charAt(0)=="+"){str=str.slice(1);}//removes leading plusses
        let posCount = (str.match(/\u002B/g)||[]).length;
        let negCount = (str.match(/\u002D/g)||[]).length;
        let iCount = (str.match(/i/g)||[]).length;

        if (iCount==1){
            if (posCount==1 && negCount==0){//one plus in the middle
                let iFront = Complex.whereIsI(str,"+");
                str = str.replace("i","");
                str=str.split("+");
                if (iFront){ 
                    var Im=Number(str.shift());
                } else {
                    var Im=Number(str.pop());}
                var Re=Number(str[0]);
            } else if (posCount==0 && negCount==1 && !(str.charAt(0)=="-") ){//one minus in the middle
                let iFront = Complex.whereIsI(str,"-");
                str = str.replace("i","");
                str=str.split("-");
                str[1]="-" + str[1];//replaces the minus sign on second element
                if (iFront){ 
                    var Im=Number(str.shift());
                } else {
                    var Im=Number(str.pop());}
                var Re=Number(str[0]);
            } else if ( (posCount==0 && negCount==1 && str.charAt(0)=="-")
                        ||(posCount==0 && negCount==0) )  {//one minus at the start or no operators
                str = str.replace("i","");
                var Im=Number(str);
                var Re=0;
            } else if (posCount==0 && negCount==2 && str.charAt(0)=="-"){//two minuses one at the start
                str=str.slice(1);//removes leading minus
                let iFront = Complex.whereIsI(str,"-");
                str = str.replace("i","");
                str=str.split("-");
                str[0]="-" + str[0];//replaces leading minus
                str[1]="-" + str[1];//replaces the minus sign on second element
                if (iFront){ 
                    var Im=Number(str.shift());
                } else {
                    var Im=Number(str.pop());}
                var Re=Number(str[0]);
            } else if (posCount==1 && negCount==1 && str.charAt(0)=="-"){//minus and plus, minus at start           
                let iFront = Complex.whereIsI(str,"+");
                str = str.replace("i","");
                str=str.split("+");
                if (iFront){ 
                    var Im=Number(str.shift());
                } else {
                    var Im=Number(str.pop());}
                var Re=Number(str[0]);
            } else {
                throw "Complex() String Parsing Error";//failed to parse
            }
        } else if (iCount==0){//if there isn't an "i" this just attempts to parse string as real number
            var Re = Number(str);
            var Im = 0;
        } else {//throws if not exactly 1 or 0 "i"s
            throw "For Parsing A String To Complex(), the string must contain 0, or 1 instances of 'i'";
        }
        return new Complex(Re,Im);
    }

    //======Attributes=========
    mag2(ascomp=true) {
        //returns the squared magnitude of this
        let ans=this.re**2 + this.im**2;
        if (ascomp){return new Complex(ans);
        }else{return ans;}
    }
    mag(ascomp=true) {
        //returns the magnitude of this
        let ans=this.mag2(false)**0.5;
        if (ascomp){return new Complex(ans);
        }else{return ans;}
    }
    arg(ascomp=true) {
        //returns the argument of this in radians
        return Math.atan2(this.im,this.re);
    }
    neg() {
        //returns the negative of this
        return new Complex(-this.re,-this.im);
    }   
    conj() {
        //returns the complex conjugate of this
        return new Complex(this.re,-this.im);
    }
    inverse() {
        //returns the inverse of this
        return new Complex((this.re/this.mag2(false)),((-this.im)/this.mag2(false)));
    }
    normalise() {
        //returns a complex number with equivalent argument but magnitude 1
        if (this.re==0 && this.im==0){return new Complex(0,0);}
        return this.divBy(this.mag()); 
    }
    //======ARITHMETIC=========
    equals(other,within=0) {
        if(isCArr(other)){return other.equals(this);}
        if (!isComp(other)){other = new Complex(other);} //casts other to Complex
        if (within==0) {
            return this.re==other.re && this.im==other.im;//checks for actual equality
        } else if (within<0){
            throw "Invalid Value for Within Argument, must be greater than 0";//within<0 makes no sense
        } else {
            return this.sub(other).mag2(false)<within;//checks if |z-w|^2 < within
        }
    }
    add(other) {
        if(isCArr(other)){return other.add(this);}
        if (!isComp(other)){other = new Complex(other);} //casts other to Complex
        return new Complex(this.re+other.re,this.im+other.im);
    }
    mult(other) {
        if(isCArr(other)){return other.mult(this);}
        if (!isComp(other)){other = new Complex(other);} //casts other to Complex
        return new Complex((this.re*other.re - this.im*other.im),(this.re*other.im + this.im*other.re));
    }
    sub(other) {
        //subtracts other from this
        if(isCArr(other)){return other.subFrom(this);}
        if (!isComp(other)){other = new Complex(other);} //casts other to Complex
        return this.add(other.neg());
    }
    subFrom(other) {
        //subtracts this from other
        if(isCArr(other)){return other.sub(this);}
        if (!isComp(other)){other = new Complex(other);} //casts other to Complex
        return this.neg().add(other);
    }
    div(numerator) {
        //Divides numerator by this
        if(isCArr(numerator)){return numerator.divBy(this);}
        if (!isComp(numerator)){numerator = new Complex(numerator);} //casts normal numbers to complex
        return this.inverse().mult(numerator);
    }
    divBy(denominator) {
        //Divides this by denominator
        if(isCArr(denominator)){return denominator.div(this);}
        if (!isComp(denominator)){denominator = new Complex(denominator);} //casts denominator to Complex
        return this.mult(denominator.inverse());
    }

    //===========Exponents and Powers==================
    square(){
        return new Complex(((this.re**2)-(this.im**2)),(2*this.re*this.im));
    }
    cube(){
        return new Complex( ((this.re**3)-(3*this.re*(this.im**2))) , ((3*(this.re**2)*this.im)-(this.im**3)) );
    }
    root(radicand,branch=0){
        if(!Number.isInteger(branch)){debugCall("Invalid Branch:",branch,"branch must be an integer.");throw "Non-Integer Branch Error";}
        if(isCompLike(radicand)){debugCall("Radicand isCompLike",radicand);radicand = new Complex(radicand)}
        if(isCArr(radicand)||isComp(radicand)){debugCall("Radicand has Complexity",radicand);return this.raiseTo(radicand.inverse(),branch);}
        debugCall("Something went wrong with the root");
        throw "Root Function Error";
    }
    sqrt(branch=0){
        if(!Number.isInteger(branch)){debugCall("Invalid Branch:",branch,"branch must be an integer.");throw "Non-Integer Branch Error";}
        if(this.im==0&&this.re<0){
            if (branch%2==0){return new Complex(0,Math.sqrt(this.im));}
            else {return new Complex(0,-Math.sqrt(this.im));}
        }
        return this.root(2,branch);
    }
    exp() {
        return Complex.polar(Math.exp(this.re),this.im);
    }
    ln(branch=0){
        if(!Number.isInteger(branch)){debugCall("Invalid Branch:",branch,"branch must be an integer.");throw "Non-Integer Branch Error";}
        return new Complex(Math.log(this.mag(false)),this.arg(false) + 2*Math.PI*branch);
    }
    log(base,branch=0){
        if(!Number.isInteger(branch)){debugCall("Invalid Branch:",branch,"branch must be an integer.");throw "Non-Integer Branch Error";}
        if(isCArr(base)){return CompArr.repeat(this,base.length).log(base,branch);}
        if (!isComp(base)){base = new Complex(base);} //casts base to Complex
        return (this.ln(branch)).divBy(base.ln(branch));
    }
    raiseTo(power,branch=0){
        if(!Number.isInteger(branch)){debugCall("Invalid Branch:",branch,"branch must be an integer.");throw "Non-Integer Branch Error";}
        if(isCArr(power)){return power.raiseBy(this);}
        if (!isComp(power)){power = new Complex(power);} //casts power to Complex
        if ((this.re==0 && this.im==0)){//Special case for when the base is 0
            if (power.re>0){//0^z is only defined when Re(z)>0
                return new Complex(0);
            } else {return new Complex(NaN,NaN)}
        } else if(power.im==0&&power.re%2==0&&this.re<0&&this.im==0){//special case for raising a negative number to an even power
            return new Complex((-this.re)**power.re,0);
        }
        return (this.ln(branch).mult(power)).exp();
    }
    raiseBy(base,branch=0){
        if(!Number.isInteger(branch)){debugCall("Invalid Branch:",branch,"branch must be an integer.");throw "Non-Integer Branch Error";}
        if(isCArr(base)){return base.raiseTo(this);}
        if (!isComp(base)){base = new Complex(base);} //casts base to Complex
        return base.raiseTo(this,branch);
    }
    //===========Trigonometric Functions==================
    sin(){
        if (this.im==0){return new Complex(Math.sin(this.re));}
        let i = new Complex(0,1);
        return this.mult(i).exp().sub(this.mult(i.neg()).exp()).divBy(i.mult(2));
    }
    cos(){
        if (this.im==0){return new Complex(Math.cos(this.re));}
        let i = new Complex(0,1);
        return this.mult(i).exp().add(this.mult(i.neg()).exp()).divBy(2);
    }
    tan(){
        if (this.im==0){return new Complex(Math.tan(this.re));}
        return this.sin().divBy(this.cos());}

    sinh(){
        if (this.im==0){return new Complex(Math.sinh(this.re));}
        return this.exp().sub(this.neg().exp()).divBy(2);}
    cosh(){
        if (this.im==0){return new Complex(Math.cosh(this.re));}
        return this.exp().add(this.neg().exp()).divBy(2);}
    tanh(){
        if (this.im==0){return new Complex(Math.tanh(this.re));}
        return this.sinh().divBy(this.cosh());}
    asin(branch=0){
        let i = new Complex(0,1);
        return this.square().neg().add(1).sqrt(branch).add(this.mult(i)).ln(branch).mult(i.neg());}
    acos(branch=0){
        return this.asin(branch).neg().add(Math.PI/2);}
    atan(branch=0){
        let i = new Complex(0,1);
        return i.divBy(2).mult(i.add(this).divBy(i.sub(this)).ln(branch));}
    asinh(branch=0){
        return this.square().add(1).sqrt(branch).add(this).ln(branch);}
    acosh(branch=0){
        return this.add(this.sub(1).sqrt(branch).mult(this.add(1).sqrt(branch))).ln(branch);}
    atanh(branch=0){
        return this.add(1).ln(branch).sub(this.subFrom(1).ln(branch)).mult(1/2);
    }
}


//====================================Complex Arrays=============================================



class CompArr extends Array {
    //Definition of a complex array, works like one dimensional numpy arrays without the lovely syntax
    constructor (...items) {
        if ( items.length==1 && (items[0] instanceof Array) ){//if an array or CompArr is passed, pull out its items
            items = items[0];
        }
        let i;
        let len = items.length;
        for (i=0; i<len ; i++){//loop through items
            if (!isComp(items[i])){//check if current item is a complex number
                items[i] = new Complex(items[i]);//if not, casts to complex
            }
        }
        super(...items);
    }
    static zeros(length){
        let Z = new CompArr();
        let i;
        for (i of range(length)){Z.push(0);}
        return Z;}

    static ones(length){
        let Z = new CompArr();
        let i;
        for (i of range(length)){Z.push(1);}
        return Z;}

    static repeat(value,length){
        if (isCompLike(value)){value=new Complex(value);}
        let Z = new CompArr();
        let i;
        for (i of range(length)){Z.push(value);}
        return Z;}

    //=========Array Method Overwriting==========//
    //Mostly to ensure that nothing but Complex objects get in the CompArr
    push(...items) {
        if ( items.length==1 && (items[0] instanceof Array) ){//if an array or CompArr is passed, pull out its items
            items = items[0];
        }
        let i;
        let len = items.length;
        for (i=0; i<len ; i++){//loop through items
            if (!isComp(items[i])){//check if current item is a complex number
                items[i] = new Complex(items[i]);//if not, casts to complex
            }
        }
        return super.push(...items);
    }
    unshift(...items) {
        if ( items.length==1 && (items[0] instanceof Array) ){//if an array or CompArr is passed, pull out its items
            items = items[0];
        }
        let i;
        let len = items.length;
        for (i=0; i<len ; i++){//loop through items
            if (!isComp(items[i])){//check if current item is a complex number
                items[i] = new Complex(items[i]);//if not, casts to complex
            }
        }
        return super.unshift(...items);
    }
    concat(...arrays) {
        let i;
        let len = arrays.length;
        for (i=0; i<len ; i++){//loop through items
            if (!isCArr(arrays[i])){//check if current item is a complex number
                arrays[i] = new CompArr(arrays[i]);//if not, casts to complex array
            }
        }
        return super.concat(...arrays);
    }
    fill(value,start,end){
        if (!isComp(value)){
            value = new Complex(value);
        }
        return super.fill(value,start,end);
    }
    //===========ARRAY ATTRIBUTES====================================//
    get re(){this.map( (z)=>z.re );}
    get im(){this.map( (z)=>z.im );}
    mag2(ascomp=true){
        if(ascomp){return new CompArr(this.map( (z)=>z.mag2(ascomp) ));}
        else{return this.map( (z)=>z.mag2(ascomp) );}
        }
    mag(ascomp=true){
        if(ascomp){return new CompArr(this.map( (z)=>z.mag(ascomp) ));}
        else{return this.map( (z)=>z.mag(ascomp) );}
        }
    arg(ascomp=true){
        if(ascomp){return new CompArr(this.map( (z)=>z.arg(ascomp) ));}
        else{return this.map( (z)=>z.arg(ascomp) );}
        }
    neg(){
        return new CompArr(this.map( (z)=>z.neg() ));}
    conj(){
        return new CompArr(this.map( (z)=>z.conj() ));}
    inverse(){
        return new CompArr(this.map( (z)=>z.inverse() ));}
    normalise(){
        return new CompArr(this.map( (z)=>z.normalise() ));}

    //===========ARRAY ARITHMETIC STUFF==============================//
    equals(other,within=0){
        if (isCompLike(other)) {other=new Complex(other);}//casts strings and numbers to complex
        if (isComp(other)){
            return this.every((z) => z.equals(other,within));//checks every element is equal to the complex number "other"
        } else if (!isCArr(other)){
            other = new CompArr(other);}//if not a complex array, casts to Complex Array

        if(!(this.length==other.length)){//if the lengths are not equal then the CompArrs are not equal
            return false;
        } else {
            //checks every pair of elements for equality within tolerance
            return zip(this,other).every(pair => pair[0].equals(pair[1],within) );
        }
    }
    add(other){
        if (isCompLike(other)){other=new Complex(other);}
        if (isComp(other)){other=CompArr.repeat(other,this.length)}
        return zipmapC(addC,this,other);}
    sub(other){//subtracts other from this
        if (isCompLike(other)){other=new Complex(other);}   
        if (isComp(other)){other=CompArr.repeat(other,this.length)}
        return zipmapC(subC,this,other);}
    subFrom(other){//subtracts this from other
        if (isCompLike(other)){other=new Complex(other);}
        if (isComp(other)){other=CompArr.repeat(other,this.length)}     
        return zipmapC(subC,other,this);}
    mult(other){
        if (isCompLike(other)){other=new Complex(other);}
        if (isComp(other)){other=CompArr.repeat(other,this.length)}
        return zipmapC(multC,this,other);}
    div(num){//divides numerator by this
        if (isCompLike(num)){num=new Complex(num);}
        if (isComp(num)){num=CompArr.repeat(num,this.length)}
        return zipmapC(divC,num,this);}
    divBy(den){//divides this by denominator
        if (isCompLike(den)){den=new Complex(den);}
        if (isComp(den)){den=CompArr.repeat(den,this.length)}
        return zipmapC(divC,this,den);}

    //===========ARRAY POWERS AND EXPONENTIAL STUFF==================//
    exp(){return this.map( (z)=>z.exp() );}
    ln(branch=0){return this.map( (z)=>z.ln(branch) );}
    square(){return this.map( (z)=>z.square() );}
    cube(){return this.map( (z)=>z.cube() );}
    sqrt(branch=0){return this.map( (z)=>z.sqrt(branch) );}
    log(bases,branch=0){
        if (isCompLike(bases)){bases=new Complex(bases);}
        if (isComp(bases)){bases=CompArr.repeat(bases,this.length)}
        return zipmapEndValC(logC,branch,this,bases);}
    root(radicands,branch=0){
        if (isCompLike(radicands)){radicands=new Complex(radicands);}
        if (isComp(radicands)){radicands=CompArr.repeat(radicands,this.length)}
        return zipmapEndValC(rootC,branch,this,radicands);}
    raiseTo(power,branch=0){
        if (isCompLike(power)){power=new Complex(power);}
        if (isComp(power)){power=CompArr.repeat(power,this.length)}
        return zipmapEndValC(powC,branch,this,power);}
    raiseBy(base,branch=0){
        if (isCompLike(base)){base=new Complex(base);}
        if (isComp(base)){base=CompArr.repeat(base,this.length)}
        return zipmapEndValC(powC,branch,base,this);}

    //===========TRIGONOMETRIC & HYPERBOLIC FUNCTIONS==========//
    sin(){return this.map( (z)=>z.sin() );}
    cos(){return this.map( (z)=>z.cos() );}
    tan(){return this.map( (z)=>z.tan() );}
    sinh(){return this.map( (z)=>z.sinh() );}
    cosh(){return this.map( (z)=>z.cosh() );}
    tanh(){return this.map( (z)=>z.tanh() );}
    asin(branch=0){return this.map( (z)=>z.asin(branch) );}
    acos(branch=0){return this.map( (z)=>z.acos(branch) );}
    atan(branch=0){return this.map( (z)=>z.atan(branch) );}
    asinh(branch=0){return this.map( (z)=>z.asinh(branch) );}
    acosh(branch=0){return this.map( (z)=>z.acosh(branch) );}
    atanh(branch=0){return this.map( (z)=>z.atanh(branch) );}

    //===========ARRAY-ONLY MATHS=============================//
    sum(){return this.reduce((x,y) => x.add(y));}
    product(){return this.reduce((x,y) => x.mult(y));}
    dft(){
        //returns the discrete fourier transform of the series
        let N = this.length;
        let Zhat = new CompArr();
        let k;
        let n;
        for (k=0; k<N ; k++){
            let Zk = new Complex(0);
            for (n=0; n<N; n++){
                let factor = Complex.polar(1,-2*Math.PI*k*n/N);
                Zk = Zk.add(this[n].mult(factor));}
            Zhat.push(Zk);}
        return Zhat;
    }


    //Extremes, Spans and Sizes
    maxRe (ascomp=true)  {
        ans = Math.max(...this.re);
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    lrgstRe (ascomp=true){
        ans = Math.max(...this.re.map( x=>Math.abs() ));
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    minRe (ascomp=true)  {
        ans = Math.min(...this.re);
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    smlstRe (ascomp=true){
        ans = Math.min(...this.re.map( x=>Math.abs() ));
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    spanRe (ascomp=true) {
        ans = this.maxRe-this.minRe;
        if (ascomp){return new Complex(ans);
        } else { return ans;}}

    maxIm (ascomp=true)  {
        ans = Math.max(...this.im);
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    lrgstIm (ascomp=true){
        ans = Math.max(...this.im.map( x=>Math.abs() ));
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    minIm (ascomp=true)  {
        ans = Math.min(...this.im);
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    smlstIm (ascomp=true){
        ans = Math.min(...this.im.map( x=>Math.abs() ));
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    spanIm (ascomp=true) {
        ans = this.maxIm-this.minIm;
        if (ascomp){return new Complex(ans);
        } else { return ans;}}

    maxMag (ascomp=true) {
        ans = Math.max(...this.mag());
        if (ascomp){return new Complex(ans);
        } else { return ans;}}
    minMag (ascomp=true) {
        ans = Math.min(...this.mag());
        if (ascomp){return new Complex(ans);
        } else { return ans;}}

    //=========VECTOR FUNCTIONS==========================//
    //the following functions treat "this" as a vector in C^(this.length),
    vecMag(){return this.mag2().sum().sqrt();}
    vecNorm() {
        //returns normalised vector
        return this.divBy(this.vecMag());}

}

///======================EXPRESSION PARSER==============================================================///
function parseToRPN(expression,allowedVars=""){
    //Converts mathematical expressions to RPN
    //Uses slightly tweaked shunting yard algorithm to convert to a queue in
    //allowedVars defines allowed characters to use on their own as variables.
    allowedVars=allowedVars.replace(/\s/g,"").toLowerCase();//removes whitespace and sets lowercase
    if (/(.).*\1/.test(allowedVars)){debugCall("repeated variable names");throw "repeated variable names";}
    if (/[pie]/.test(allowedVars)){debugCall("No pie allowed.");
        throw "The letters p, i, and e are not allowed as math variables.";}
    //removes whitespace and sets lowercase
    expression=expression.replace(/\s/g,"").toLowerCase();
    //REPLACE "--" with "+"
    expression = expression.replace(/--/g,"+");
    //REPLACE UNARY "-" with alternate  "_"
    expression = expression.replace(/([\(\^*\/+\-])-/g,"$1_");
    //REPLACE UNARY "+" with ""
    expression = expression.replace(/([\(\^*\/+\-])\+/g,"$1");
    debugCall("Predigested Expression:",expression);
    //This defines the valid functions
    //let validOperand = /^((([uvwte]|pi|\d+(\.\d+)?)i)|(i?([uvwte]|pi|\d+(\.\d+)?)))/;
    let validOperand = new RegExp("^(((["+ allowedVars +"e](?!xp)|pi|\\d+(\\.\\d+)?)i)|(i?(["+ allowedVars +"e](?!xp)|pi|\\d+(\\.\\d+)?)))");
    let validFunction = /^(sin|cos|tan|sinh|cosh|tanh|asin|acos|atan|asinh|acosh|atanh|sqrt|square|exp|ln|log|root|re|im|mag|arg|conj|norm)/;
    let validUnaryPre = /^_/;
    let validBinary = /^[+\-*\/\^]/;
    let maxIter = expression.length;
    let iters = 0;
    let outqueue = [];
    let opstack = [];
    let curtoken,poppables;
    while (expression.length>0){
        debugCall("SoL "+iters);
        if (validFunction.test(expression)){//if it starts with a number
            curtoken = validFunction.exec(expression)[0];
            opstack.push(curtoken);
            expression = expression.replace(validFunction,"");
        } else if (validOperand.test(expression)){//if it starts with a number
            curtoken = validOperand.exec(expression)[0];
            outqueue.push(curtoken);
            expression = expression.replace(validOperand,"");
        } else if (validUnaryPre.test(expression)){
            curtoken = validUnaryPre.exec(expression)[0];
            opstack.push(curtoken);
            expression = expression.replace(validUnaryPre,"");
        } else if (expression[0]==","){
            curtoken = ",";
            while (opstack[opstack.length - 1]!="("){//pops until it finds a left bracket
                outqueue.push(opstack.pop());
            }
            expression = expression.substring(1);
        } else if (validBinary.test(expression)){
            curtoken = validBinary.exec(expression)[0];
            switch(curtoken) {
                case "+":
                case "-"://left associative
                    poppables = /[+\-*\/\^_]/;
                    break;
                case "*":
                case "/"://left associative
                    poppables = /[*\/\^_]/;
                    break;
                case "^"://right associative
                    poppables = /_/;
                    break;
                default:
                    debugCall("Binary Operator Hiccup Error");
                    throw "This code should not be reachable.";
            }
            // \/ pops all the poppables \/
            while (poppables.test(opstack[opstack.length - 1])){outqueue.push(opstack.pop());}
            opstack.push(curtoken);
            expression = expression.replace(validBinary,"");
        } else if (expression[0]=="("){
            curtoken = "(";
            opstack.push(curtoken);
            expression = expression.substring(1);
        } else if (expression[0]==")"){
            curtoken = ")";
            while (opstack[opstack.length - 1]!="("){//pops until it finds a left bracket
                outqueue.push(opstack.pop());
            }
            opstack.pop();//discards left bracket
            if (validFunction.test(opstack[opstack.length - 1])){
                outqueue.push(opstack.pop());//pops if there is a function at the top of the opstack
            }
            expression = expression.substring(1);
        } else {debugCall("Invalid value encountered while parsing to RPN.");
            throw"Invalid expression error";}
        debugCall("EoL Expression:",expression);
        debugCall("EoL Opstack:",opstack);
        debugCall("EoL Outqueue:",outqueue);
        debugCall("EoL");
        iters++;
        if (iters>maxIter){debugCall("Infinite Loop Discovered");break;}
    }
    while (opstack.length>0){
        outqueue.push(opstack.pop())
    }
    return outqueue;
}

function evalC(expression,allowedVars="",...variables){
    allowedVars=allowedVars.replace(/\s/g,"");
    if (/(.).*\1/.test(allowedVars)){debugCall("repeated variable names");throw "repeated variable names";}
    //this dictionary maps strings from the RPN stack to actual functions and values
    //      the number refers to the number of inputs that function expects
    //      this approach makes it easy to add more functions to this list (add names to RPN RegEx as well)
    let dict={"_":[1,negC],"+":[2,addC],"-":[2,subC],
        "*":[2,multC],"/":[2,divC],"^":[2,powC],
        "sin":[1,sinC],"cos":[1,cosC],"tan":[1,tanC],
        "asin":[1,asinC],"acos":[1,acosC],"atan":[1,atanC],
        "sinh":[1,sinhC],"cosh":[1,coshC],"tanh":[1,tanhC],
        "asinh":[1,asinhC],"acosh":[1,acoshC],"atanh":[1,atanhC],
        "square":[1,squareC],"sqrt":[1,sqrtC],"exp":[1,expC],"ln":[1,lnC],
        "log":[2,logC],"root":[2,rootC],
        "re":[1,reC],"im":[1,imC],
        "mag":[1,magC],"arg":[1,argC],"conj":[1,conjC],"norm":[1,normaliseC],
        "pi":[0,PIc],"e":[0,Ec]};
    //this section is so you can translate to RPN once and then evaluate the expression times when variables change to minimise load
    let inQueue,tempvar1,tempvar2,curtoken;
    let outStack = [];
    if (isString(expression)){inQueue = parseToRPN(expression,allowedVars);}//if string passed it is assumed to be mathematical expression
    else if (isArr(expression)){inQueue = [...expression];}//if array passed, it is assumed to be predigested RPN
    else {debugCall("must be string or array for evalC");throw "invalid expression";}
    while (inQueue.length > 0){
        curtoken=inQueue.shift();
        debugCall("SoL Token:",curtoken);
        if (curtoken in dict){
            switch (dict[curtoken][0]){
                case 0://push e and pi straight to the outStack
                    outStack.push(dict[curtoken][1]);
                    break;
                case 1:
                    tempvar1=outStack.pop();
                    outStack.push(dict[curtoken][1](tempvar1));
                    break;
                case 2:
                    tempvar2=outStack.pop();
                    tempvar1=outStack.pop();
                    outStack.push(dict[curtoken][1](tempvar1,tempvar2));
                    break;
            }
        } else if (allowedVars.includes(curtoken)) {
            outStack.push(cast(variables[allowedVars.indexOf(curtoken)]));
        } else {outStack.push(new Complex(curtoken));}//if it wasn't in the dict or a variable, push to stack as complex   
        debugCall("EoL inQueue:",inQueue);
        debugCall("EoL outStack:",outStack);
        }
    if (outStack.length!=1){debugCall("outStack length issue");throw "parsing error";}
    return cast(outStack[0]);
}



//=======Useful Constants===============//
const Ic = new Complex(0,1);
const PIc = new Complex(Math.PI,0);
const Ec = new Complex(Math.E,0);
const ZEROc = new Complex(0,0);
const ONEc = new Complex(1,0);

//=====Convenience functions for alternate syntax functions========//
//This stuff is all just for refactoring

function cast(z){
    //casts strings,numbers, and length 2 arrays of numbers to Complex
    //casts arrays of any other length to CompArr
    if (isCompLike(z) ){
        z = new Complex(z);
    } else if (isArr(z)){
        z=new CompArr(z);
    } else if ( (!isComp(z))&&(!isCArr(z)) ){
        debugCall("Problem Casting z:",z);
        throw "Improper z for casting."
    }
    return z;
}

function zipmapC(func,...CArrs){
    debugCall("zipmap",func,CArrs);
    if ( (!CArrs.every(isCArr)) || (CArrs.some(CArr=>CArr.length!=CArrs[0].length)) ){
        throw "CompArrs must be of same length";}//fails if not all CompArrs of the same length
    let ans = zip(...CArrs);
    debugCall("zipped",ans);
    ans = new CompArr( ans.map( pair=>func(pair[0],pair[1]) ) );
    return ans;
}

function zipmapEndValC(func,val,...CArrs){
    debugCall("zipmapEndVal",func,val,CArrs);
    if ( (!CArrs.every(isCArr)) || (CArrs.some(CArr=>CArr.length!=CArrs[0].length)) ){
        throw "CompArrs must be of same length";}//fails if not all CompArrs of the same length
    let ans = zip(...CArrs);
    debugCall("zipped",ans);
    ans = new CompArr( ans.map( pair=>func(pair[0],pair[1],val) ) );
    return ans;
}

//=====Convenience Syntax for attributes =============//
function reC(z){
    z=cast(z);
    return z.re();
}
function imC(z){
    z=cast(z);
    return z.im();
}
function negC(z){
    z=cast(z);
    return z.neg();
}
function conjC(z){
    z=cast(z);
    return z.conj();
}
function inverseC(z){
    z=cast(z);
    return z.inverse();
}
function magC(z){
    z=cast(z);
    return z.mag();
}
function argC(z){
    z=cast(z);
    return z.arg();
}
function normaliseC(z){
    z=cast(z);
    return z.normalise();
}
function mag2C(z){
    z=cast(z);
    return z.mag2();
}
//=====Convenience Syntax for arithmetic functions=============//

function eqC(a,b,within=0){
    a=cast(a);
    b=cast(b);
    return a.equals(b,within);
}
function addC (a,b){
    a=cast(a);
    b=cast(b);
    return a.add(b);
}
function multC (a,b){
    a=cast(a);
    b=cast(b);
    return a.mult(b);
}
function subC (a,b){
    a=cast(a);
    b=cast(b);
    return a.sub(b);
}
function divC (num,den){
    num=cast(num);
    den=cast(den);
    return num.divBy(den);
}

//======Exponential and Logarithmic Functions for Alternate Syntax===============//

function squareC(z){
    z=cast(z);
    return z.square();
}
function cubeC(z){
    z=cast(z);
    return z.cube();
}
function rootC(z,radicand=2,branch=0){
    z=cast(z);
    radicand=cast(radicand);
    return z.root(radicand,branch);
}   
function sqrtC(z,branch=0){
    z=cast(z);
    return z.sqrt(branch)
}
function expC(power) {
    power=cast(power);
    return power.exp();
}
function lnC(z, branch=0){
    z=cast(z);
    return z.ln(branch);
}
function logC(z, base, branch=0){
    z=cast(z);
    base=cast(base);
    return z.log(base,branch);
}
function powC(base,power,branch=0) {
    base=cast(base);
    power=cast(power);
    return base.raiseTo(power,branch);
}
//======Trigonometric and Hyperbolic Functions for Alternate Syntax===============//

function sinC(z){
    z=cast(z);
    return z.sin();
}
function cosC(z){
    z=cast(z);
    return z.cos();
}
function tanC(z){
    z=cast(z);
    return z.tan();
}
function sinhC(z){
    z=cast(z);
    return z.sinh();
}
function coshC(z){
    z=cast(z);
    return z.cosh();
}
function tanhC(z){
    z=cast(z);
    return z.tanh();
}
function asinC(z, branch=0){
    z=cast(z);
    return z.asin(branch);
}
function acosC(z, branch=0){
    z=cast(z);
    return z.acos(branch);
}
function atanC(z, branch=0){
    z=cast(z);
    return z.atan(branch);
}
function asinhC(z, branch=0){
    z=cast(z);
    return z.asinh(branch);
}
function acoshC(z, branch=0){
    z=cast(z);
    return z.acosh(branch);
}
function atanhC(z, branch=0){
    z=cast(z);
    return z.atanh(branch);
}


  ///===================================================================================///
 ///=======================Functions That Work In The Complex World====================///
///===================================================================================///

function linspaceC(low,high,len) {
    if (!isComp(low)){low = new Complex(low);} //casts z to Complex
    if (!isComp(high)){high = new Complex(high);} //casts z to Complex
    var arr = new CompArr();
    var step = (high.sub(low)).divBy(len-1);
    for (var i = 0; i < len; i++) {
        arr.push(low.add(step.mult(i)));
    }
    return arr;
}


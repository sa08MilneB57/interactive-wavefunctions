# Interactive Wavefunctions

This is a representation of various simple quantum systems that can be played with in real time. This simulation assumes ħ=1 and when defining the Cn using a formula note that each |n> evolves with time *anyway* so you do not need to include a time component in your formulae.

The coefficients are automatically normalised so it does not matter what function or list of coeficients you use it will shrink them as required to make sure there is a probability of 1 that the particle is "somewhere" and maintain the relative magnitudes and absolute arguments of your input.

The |n> is the position wavefunction in the energy eigenbasis so n often includes a 0. Please remember this when defining your Cn functions as the site will crash if you divide by 0.

## Maths parser
As javascript does not natively handle complex numbers, in order to mitigate security issues, I had to write my own maths parser for the "define coefficients by function" mode. This uses a modified Shunting-Yard algorithm to convert to a stack of Reverse Polish Notation then a maps various keywords on to functions that I defined for my Complex Numbers. All of the pure maths is in my mathsplus.js file. I am still working out some buggy areas around the negative real axis for anything who's definition has branches so if you get strange behaviours try using an alternaive representation.

"i" must be accompanied by a number("0.1i, i1, 2i, ipi, ei")

"pi" & "e" evaluate as you'd expect but exp(z) is more accurate than e^z

- a+b: add two numbers

- a-b: subtraction, unary negative has variable behaviour, the liberal use of brackets will keep you safe

- a*b: multiplication

- a/b: division (left-assosciative)

- a^b: exponenentiation (right-assosciative)


### Trigonometric Functions
sin(z) cos(z) tan(z)


### Hyperbolic Functions
sinh(z) cosh(z) tanh(z)


### Inverse Trig & Hyp Functions
These use the principle value.
asin(z) acos(z) atan(z)
asinh(z) acosh(z) atanh(z)

### Exponential Functions
#### If possible use these three functions rather than alternatives like the "^" operator
square(z) sqrt(z) exp(z) 

### Logarithmic Functions 
#### All generalised exponents are based on the ln(z) function as are log() and root()
ln(z) log(z,base) root(z)

### Complex Number Stuff
re(z) im(z)
mag(z) arg(z)
norm(z) -normalises a number z s.t. |z|=1, doesn't return the "norm" for that use mag(z)

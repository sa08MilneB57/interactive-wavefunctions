Some good things to type in for coefficients that I've found. Please leave comments with suggested additions!

## As lists
- Evens: 1,0,1,0,1,0,1,0,1,0,1...
- Odds: 0,1,0,1,0,1,0,1....
- Flat: 1,1,1,1,1,1,1,1...
- Linear Peak: 1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1
- Undulatory Double Bump: 1,-1i,1i,-1
- Two Energy Peaks: 1,2,4,8,4,2,1,1,2,4,8,4,2,1

## As functions

- Gauss Distribution: exp(-((n-u)^2)/(2\*w^2))
  - "Re(u)" is the location of the peak in energy, changing this has the effect of more wiggliness and greater travel for higher u
  - "Re(w)" is the spread of the energy distribution, changing this demonstrates the Heisenberg uncertainty principle rather well
  - The imaginary components of these numbers don't correspond to anything useful that I'm aware of.
- Odds and Evens: sin(n\*pi/2)^2 or cos(n\*pi/2)^2
  - These correspond to the same values as the Odds and Evens lists.
  - You can therefore multiply these by another function to apply that function to only odd or even values of n.
- Reciprocal: 1/(n\*u+1)
  - Corresponds to less chance of measuring higher energies while u>0

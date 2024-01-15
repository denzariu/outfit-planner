
export function simplifiedColor512 (color: string): string {
  let newColor: string = '';

  for (let i = 0; i < 3; i++) {
    const code = color[i*2+1] + color [i*2+2]
    
    // Even if it looks newbish, this is a fast way of 
    // simplifying the color, as a result of / 64 (32 uncommented) and rounding
    //                                      // round(code / 64)
    if (code < '10')      newColor += '00'     // 0     
    // else if (code < '30') newColor += '20'  // 1
    else if (code < '50') newColor += '40'     // 2
    // else if (code < '70') newColor += '60'  // 3
    else if (code < '90') newColor += '80'     // 4
    // else if (code < 'B0') newColor += 'A0'  // 5
    else if (code < 'D0') newColor += 'C0'     // 6
    // else if (code < 'F0') newColor += 'E0'  // 7
    else                  newColor += 'FF'     // 8

    // results a maximum of 125 (729 if uncommented) colors
  }

  return '#' + newColor
}

export function simplifiedColorID (color: string): number {

  let id: number[] = [];
  for (let i = 0; i < 3; i++) {
    const code = color[i*2+1] + color [i*2+2]
    
    if (code == '00')      id[i] = 0     
    // else if (code == '20') id[i] = 1
    else if (code == '40') id[i] = 1 //2
    // else if (code == '60') id[i] = 3
    else if (code == '80') id[i] = 2 //4
    // else if (code == 'A0') id[i] = 5
    else if (code == 'C0') id[i] = 3 //6
    // else if (code == 'E0') id[i] = 7
    else                   id[i] = 4 //8
  }
  return id[0] * 5 * 5 + id[1] * 5 + id[2] 
}
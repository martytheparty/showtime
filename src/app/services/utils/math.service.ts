import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }

  rgbToHex(r: number, g: number, b: number) {
    // Ensure the values are within the valid range 0-255
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    
    // Convert to hexadecimal and pad with leading zeros if necessary
    return (r << 16) + (g << 8) + b;
}
}

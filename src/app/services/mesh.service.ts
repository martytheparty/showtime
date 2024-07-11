import { Injectable } from '@angular/core';

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

@Injectable({
  providedIn: 'root'
})
export class MeshService {

  loader = new FontLoader();

  helvetikerRegularPromise: Promise<Font> = new Promise((resolve) => { 
    this.loader.load('assets/fonts/helvetiker_regular.typeface.json', 
      (font: Font) => { resolve(font); }
    )}); 
  
    helvetikerBoldPromise: Promise<Font> = new Promise((resolve) => { 
    this.loader.load('assets/fonts/helvetiker_bold.typeface.json', 
      (font: Font) => { resolve(font); }
    )}); 
  
    gentilisRegularPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/gentilis_regular.typeface.json', 
        (font: Font) => { resolve(font); }
      )}); 
  
    gentilisBoldPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/gentilis_bold.typeface.json', 
        (font: Font) => { resolve(font); }
      )});
      
    optimerRegularPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/optimer_regular.typeface.json', 
        (font: Font) => { resolve(font); }
      )}); 
  
    optimerBoldPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/optimer_bold.typeface.json', 
        (font: Font) => { resolve(font); }
      )});
  
    droidSansBoldPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/droid/droid_sans_bold.typeface.json', 
        (font: Font) => { resolve(font); }
      )});
  
    droidSansMonoPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/droid/droid_sans_mono_regular.typeface.json', 
        (font: Font) => { resolve(font); }
      )});
  
    droidSansPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/droid/droid_sans_regular.typeface.json', 
        (font: Font) => { resolve(font); }
      )});
  
    droidSerifBoldPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/droid/droid_serif_bold.typeface.json', 
        (font: Font) => { resolve(font); }
      )});
  
    droidSerifPromise: Promise<Font> = new Promise((resolve) => { 
      this.loader.load('assets/fonts/droid/droid_serif_regular.typeface.json', 
        (font: Font) => { resolve(font); }
      )});

  constructor() { }
}

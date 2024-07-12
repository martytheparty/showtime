import { Injectable } from '@angular/core';

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { FontInterface } from '../interfaces/mesh-interface';

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

  fontList: FontInterface[] = [];

  fontPromises: Promise<void>;

  constructor() { 

    this.fontList.push({name: 'Helvetiker', promise: this.helvetikerRegularPromise});
    this.fontList.push({name: 'Helvetiker Bold', promise: this.helvetikerBoldPromise});
    this.fontList.push({name: 'Gentilis', promise: this.gentilisRegularPromise});
    this.fontList.push({name: 'Gentilis Bold', promise: this.gentilisBoldPromise});
    this.fontList.push({name: 'Optimer', promise: this.optimerRegularPromise});
    this.fontList.push({name: 'Optimer Bold', promise: this.optimerBoldPromise});
    this.fontList.push({name: 'Droid Sans Bold', promise: this.droidSansBoldPromise});
    this.fontList.push({name: 'Droid Sans Mono', promise: this.droidSansMonoPromise});
    this.fontList.push({name: 'Droid Sans', promise: this.droidSansPromise});
    this.fontList.push({name: 'Droid Serif Bold', promise: this.droidSerifBoldPromise});
    this.fontList.push({name: 'Droid Serif', promise: this.droidSerifPromise});

    this.fontPromises = Promise.all(this.fontList.map((fontItem) => fontItem.promise)).then(
      () => {
        
        this.fontList.forEach(
          (fontItem: FontInterface) => fontItem.promise.then( (font) => {
            fontItem.font = font;
          } )
        );
      }
    );
  }
}

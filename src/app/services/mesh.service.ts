import { Injectable } from '@angular/core';

import * as THREE from 'three';

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { FontInterface, MeshInterface, SupportedMeshes } from '../interfaces/mesh-interface';
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, SphereGeometry } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

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

  meshItems: MeshInterface[] = [];
  meshes: SupportedMeshes[] = [];

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

  async addMesh(meshItem: MeshInterface): Promise<SupportedMeshes>
  {
    let geometry: BoxGeometry | SphereGeometry | TextGeometry = new THREE.BoxGeometry( 1, 1, 1 );

    if (meshItem.shape === 'SphereGeometry') {
      geometry = new THREE.SphereGeometry(.5,32,32);
    } else if (meshItem.shape === 'TextGeometry') {
      geometry = await this.getTextGeometry(meshItem);
    }

    let material: MeshNormalMaterial | MeshPhongMaterial | MeshBasicMaterial = new THREE.MeshNormalMaterial();
    
    if (meshItem.materialType === 'basic') {
      material = new THREE.MeshBasicMaterial();
    } else if (meshItem.materialType === 'phong') {
      material = new THREE.MeshPhongMaterial();
    }

    const mesh: SupportedMeshes = new THREE.Mesh( geometry, material );
    meshItem.id = mesh.id;
    this.meshes.push(mesh);
    this.meshItems.push( meshItem );
    this.meshItems = [... this.meshItems];
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  async getTextGeometry(meshItem: MeshInterface): Promise<TextGeometry>
  {
    await this.fontPromises;

    let font: Font = this.fontList[0].font as Font;

    this.fontList.forEach(
      (fontItem: FontInterface) => {
        if (fontItem.name === meshItem.font){
          font = fontItem.font as Font;
        }
      }
    );


    const tg: TextGeometry = new TextGeometry(meshItem.text, {
      font: font,
      size: meshItem.size * 1,
      height: meshItem.height * 1,
      curveSegments: meshItem.curveSegments * 1,
      bevelEnabled: meshItem.bevelEnabled,
      bevelThickness: meshItem.bevelThickness * 1,
      bevelSize: meshItem.bevelSize * 1,
      bevelOffset:  meshItem.bevelOffset * 1,
      bevelSegments:  meshItem.bevelSegments * 1,
      steps: meshItem.steps * 1
    });
    return tg;

  }
}


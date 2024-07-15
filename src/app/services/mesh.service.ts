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

  async updateMesh(meshItem: MeshInterface): Promise<void>
  {
    const updateMesh = this.meshes.find((mesh) => mesh.id === meshItem.id);

    if (updateMesh?.geometry.type !== meshItem.shape) {
      // the mesh needs to be converted
      if (updateMesh && meshItem.shape === 'SphereGeometry') {
        const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
        // the commented code was povided by chatGPT but does not seem to be necessary
        //updateMesh.geometry.dispose();
        updateMesh.geometry = geometry;
        // updateMesh.updateMatrix();
        // updateMesh.geometry.computeBoundingBox();
      } else if (updateMesh && meshItem.shape === 'BoxGeometry') {
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1, 1);
        // the commented code was povided by chatGPT but does not seem to be necessary
        //updateMesh.geometry.dispose();
        updateMesh.geometry = geometry;
        // updateMesh.updateMatrix();
        // updateMesh.geometry.computeBoundingBox();
      } else if (updateMesh && meshItem.shape === 'TextGeometry') {
        const geometry: TextGeometry  = await this.getTextGeometry(meshItem);
        updateMesh.geometry = geometry;
      }      
    }
    
    if (meshItem.shape === 'BoxGeometry' && updateMesh) {
      const geo: THREE.BoxGeometry = updateMesh.geometry as THREE.BoxGeometry;
      
      if (geo.parameters.width !== meshItem.width 
          || geo.parameters.height !== meshItem.height
          || geo.parameters.depth !== meshItem.depth)
      {
        const newGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(meshItem.width, meshItem.height, meshItem.depth, 1);
        updateMesh.geometry = newGeometry;
      }
    }

    if (meshItem.shape === 'SphereGeometry' && updateMesh) {
      const geo: THREE.SphereGeometry = updateMesh.geometry as THREE.SphereGeometry;
      
      if (geo.parameters.radius !== meshItem.radius)
      {
        const newGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(meshItem.radius, 32, 32);
        updateMesh.geometry = newGeometry;
      }
    }

    if (meshItem.shape === 'TextGeometry' && updateMesh) {
      const geo: TextGeometry = updateMesh.geometry as TextGeometry;
      
      if (
        geo.parameters.options.height !== meshItem.height
        || geo.parameters.options.curveSegments !== meshItem.curveSegments
        || geo.parameters.options.size !== meshItem.size
        || geo.parameters.options.bevelOffset !== meshItem.bevelOffset
        || geo.parameters.options.bevelSegments !== meshItem.bevelSegments
        || geo.parameters.options.bevelSize !== meshItem.bevelSize
        || geo.parameters.options.steps !== meshItem.steps
        || geo.parameters.options.bevelEnabled !== meshItem.bevelEnabled
        || meshItem.textOrig !== meshItem.text
      )
      {
        meshItem.textOrig = meshItem.text;
        const newGeometry: TextGeometry = await this.getTextGeometry(meshItem);
        updateMesh.geometry = newGeometry;
      }
    }

    if (updateMesh) {
      updateMesh.name = meshItem.name;
      updateMesh.position.setX(meshItem.xPos.startValue);
      updateMesh.position.setY(meshItem.yPos.startValue);
      updateMesh.position.setZ(meshItem.zPos.startValue);
      
      let xRotation = updateMesh.rotation.x;
      let yRotation = updateMesh.rotation.y;
      let zRotation = updateMesh.rotation.z;

      if (!isNaN(meshItem.xRotation.startValue*1))
      {
        xRotation = meshItem.xRotation.startValue * 1;
      }

      if (!isNaN(meshItem.yRotation.startValue*1))
      {
        yRotation = meshItem.yRotation.startValue * 1;
      }
      
      if (!isNaN(meshItem.zRotation.startValue*1))
      {
        zRotation = meshItem.zRotation.startValue * 1;
      }

      updateMesh.rotation.set(xRotation, yRotation, zRotation);
      
      updateMesh.castShadow = meshItem.castShadow;
      updateMesh.receiveShadow = meshItem.receiveShadow;
    }


    let updateMaterial = false;
    if (
      (updateMesh?.material.type === "MeshNormalMaterial"
      && meshItem.materialType !== 'normal')
      || (updateMesh?.material.type === "MeshBasicMaterial"
      && meshItem.materialType !== 'basic')
      || (updateMesh?.material.type === "MeshPhongMaterial"
      && meshItem.materialType !== 'phong')
      ) {
        updateMaterial = true;
    }

    if (updateMaterial) {
      if (meshItem.materialType === 'basic' && updateMesh) {
        const newMaterial = new THREE.MeshBasicMaterial();
        updateMesh.material = newMaterial;
      } else if (meshItem.materialType === 'normal' && updateMesh) {
        const newMaterial = new THREE.MeshNormalMaterial();
        updateMesh.material = newMaterial;
      } else if (meshItem.materialType === 'phong' && updateMesh) {
        const newMaterial = new THREE.MeshPhongMaterial();
        updateMesh.material = newMaterial;
      }
    }

    if (meshItem.materialType === 'basic' && updateMesh) {
      const material = updateMesh.material as MeshBasicMaterial;
      material.color.setRGB(meshItem.redColor/255,meshItem.greenColor/255,meshItem.blueColor/255);
    }

    if (meshItem.materialType === 'phong' && updateMesh) {
      const material = updateMesh.material as MeshPhongMaterial;
      material.color.setRGB(meshItem.redColor/255,meshItem.greenColor/255,meshItem.blueColor/255)
    }

    this.meshItems = [... this.meshItems];
  }

}


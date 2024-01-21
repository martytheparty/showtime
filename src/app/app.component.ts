import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import * as THREE from 'three';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: Window, useValue: window }
]
})
export class AppComponent implements AfterViewInit {
  title = 'showtime';
  constructor(private window: Window){}

  ngAfterViewInit(): void {
    const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 10;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 2, 2, 2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation

function animation( time: number ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}
  }
}

import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../../threejs.service';
import { CameraInterface } from '../../interfaces/camera-interface';

@Component({
  selector: 'app-camera-manager',
  standalone: true,
  imports: [],
  templateUrl: './camera-manager.component.html',
  styleUrl: './camera-manager.component.scss'
})
export class CameraManagerComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  cameraItem: CameraInterface | undefined;

  constructor() {
    this.threeJsService.addMesh(
      {
        id: -1,
        xPos: 0,
        yPos: 0,
        zPos: 0
      }
    );

    effect(
      () => {
        this.cameraItem = this.threeJsService.cameraItemValues();
      }
    ); 
  }



}

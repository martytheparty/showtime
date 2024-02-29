import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../../../threejs.service';
import { PerspectiveCameraInterface } from '../../../interfaces/camera-interfaces';

@Component({
  selector: 'app-perspective-data',
  standalone: true,
  imports: [],
  templateUrl: './perspective-data.component.html',
  styleUrl: './perspective-data.component.scss'
})
export class PerspectiveDataComponent {
  threeJsService: ThreejsService = inject(ThreejsService);
  cameraItem: PerspectiveCameraInterface | undefined;

  constructor() {
    effect(
      () => {
        this.cameraItem = this.threeJsService.cameraItemValues();        
      }
    ); 
  }
}

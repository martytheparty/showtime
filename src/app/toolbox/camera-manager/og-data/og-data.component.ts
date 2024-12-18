import { Component, effect, inject } from '@angular/core';
import { ThreejsService } from '../../../services/threejs.service';
import { CameraInterface } from '../../../interfaces/three/camera-interfaces';

@Component({
    selector: 'app-og-data',
    imports: [],
    templateUrl: './og-data.component.html',
    styleUrl: './og-data.component.scss'
})
export class OgDataComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  cameraItem: CameraInterface | undefined;

  constructor(){
    effect(() => {
      this.cameraItem = this.threeJsService.orthographicCameraItemValues();
    })
  }
}

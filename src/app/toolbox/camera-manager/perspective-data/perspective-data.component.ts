import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../../../services/threejs.service';
import { CameraInterface } from '../../../interfaces/three/camera-interfaces';

@Component({
    selector: 'app-perspective-data',
    imports: [],
    templateUrl: './perspective-data.component.html',
    styleUrl: './perspective-data.component.scss'
})
export class PerspectiveDataComponent {
  threeJsService: ThreejsService = inject(ThreejsService);
  cameraItem: CameraInterface | undefined;

  constructor() {
    effect(
      () => {
        if (
          this.threeJsService.cameraItemValues().length > 0 &&
          this.threeJsService.cameraItemValues()[0].type === 'PerspectiveCamera')
        {
            setTimeout( 
              () => {
                this.cameraItem = this.threeJsService.cameraItemValues()[0] as CameraInterface;
              }, 0
             );
        }
      }
    ); 
  }
}

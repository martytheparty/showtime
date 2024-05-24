import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../../../services/threejs.service';
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
        if (
          this.threeJsService.cameraItemValues().length > 0 &&
          this.threeJsService.cameraItemValues()[0].type === 'PerspectiveCamera')
        {
            this.cameraItem = this.threeJsService.cameraItemValues()[0] as PerspectiveCameraInterface;        
        }
      }
    ); 
  }
}

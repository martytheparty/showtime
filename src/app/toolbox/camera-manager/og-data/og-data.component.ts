import { Component, effect, inject } from '@angular/core';
import { ThreejsService } from '../../../threejs.service';
import { OrthographicCameraInterface } from '../../../interfaces/camera-interfaces';

@Component({
  selector: 'app-og-data',
  standalone: true,
  imports: [],
  templateUrl: './og-data.component.html',
  styleUrl: './og-data.component.scss'
})
export class OgDataComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  cameraItem: OrthographicCameraInterface | undefined;

  constructor(){
    effect(() => {
      this.cameraItem = this.threeJsService.orthographicCameraItemValues();
    })
  }
}

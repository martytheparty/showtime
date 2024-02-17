import { Component, inject } from '@angular/core';
import { ThreejsService } from '../../threejs.service';

@Component({
  selector: 'app-camera-manager',
  standalone: true,
  imports: [],
  templateUrl: './camera-manager.component.html',
  styleUrl: './camera-manager.component.scss'
})
export class CameraManagerComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  constructor() {
    this.threeJsService.addMesh(
      {
        id: -1,
        xPos: 0,
        yPos: 0,
        zPos: 0
      }
    );
  }

}

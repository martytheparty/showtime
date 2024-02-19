import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../../threejs.service';
import { CameraInterface } from '../../interfaces/camera-interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-camera-manager',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './camera-manager.component.html',
  styleUrl: './camera-manager.component.scss'
})
export class CameraManagerComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  editing = false;

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

  toggleEdit(): void
  {
    this.editing = !this.editing;
  }

}

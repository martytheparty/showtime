import { Component, inject } from '@angular/core';
import { ThreejsService } from '../../services/threejs.service';
import { CameraType } from '../../interfaces/three/camera-interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { OgDataComponent } from './og-data/og-data.component';
import { OgFormComponent } from './og-form/og-form.component';
import { PerspectiveDataComponent } from './perspective-data/perspective-data.component';
import { PerspectiveFormComponent } from './perspective-form/perspective-form.component';


@Component({
  selector: 'app-camera-manager',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    OgDataComponent,
    OgFormComponent,
    PerspectiveDataComponent,
    PerspectiveFormComponent
  ],
  templateUrl: './camera-manager.component.html',
  styleUrl: './camera-manager.component.scss'
})
export class CameraManagerComponent {
  threeJsService: ThreejsService = inject(ThreejsService);
  editing = false;
  cameraType: CameraType = 'PerspectiveCamera';

  toggleEdit(): void
  {
    this.editing = !this.editing;
  }

  updateCameraType(event: MatCheckboxChange): void
  {
    this.cameraType = event.checked ? 'OrthographicCamera' : 'PerspectiveCamera';
    this.threeJsService.updateCameraType(this.cameraType);
  }
}

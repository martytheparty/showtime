import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../../threejs.service';
import { CameraInterface } from '../../interfaces/camera-interface';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-camera-manager',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './camera-manager.component.html',
  styleUrl: './camera-manager.component.scss'
})
export class CameraManagerComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  editing = true;

  cameraItem: CameraInterface | undefined;

  form: FormGroup = new FormGroup({
    fov: new FormControl(0),
    aspect: new FormControl(0)
  });

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

        this.form.setValue({
          fov: this.cameraItem.fov,
          aspect: this.cameraItem.aspect
        });        
      }
    ); 
  }

  toggleEdit(): void
  {
    this.editing = !this.editing;
  }

}

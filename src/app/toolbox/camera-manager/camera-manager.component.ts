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
    aspect: new FormControl(0),
    near: new FormControl(0),
    far: new FormControl(0),
    xPos: new FormControl(0),
    yPos: new FormControl(0),
    zPos: new FormControl(0)
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

    this.form.valueChanges.subscribe(
      () => {
        if (this.cameraItem)
        {

          if (this.form.value.fov || this.form.value.fov === 0) {          
            this.cameraItem.fov = this.form.value.fov;
          }

          if (this.form.value.aspect || this.form.value.aspect === 0) {          
            this.cameraItem.aspect = this.form.value.aspect;
          }

          if (this.form.value.near || this.form.value.near === 0) {          
            this.cameraItem.near = this.form.value.near;
          }        

          if (this.form.value.far || this.form.value.far === 0) {          
            this.cameraItem.far = this.form.value.far;
          }        

          if (this.form.value.xPos || this.form.value.xPos === 0) {          
            this.cameraItem.xPos = this.form.value.xPos;
          }        

          if (this.form.value.yPos || this.form.value.yPos === 0) {          
            this.cameraItem.yPos = this.form.value.yPos;
          }        

          if (this.form.value.zPos || this.form.value.zPos === 0) {          
            this.cameraItem.zPos = this.form.value.zPos;
          }

          const cameraItemValues: CameraInterface = this.cameraItem as CameraInterface;
          this.threeJsService.updateCamera();
        }


      }
    );

    effect(
      () => {
        this.cameraItem = this.threeJsService.cameraItemValues();

        this.form.setValue({
          fov: this.cameraItem.fov,
          aspect: this.cameraItem.aspect,
          near: this.cameraItem.near,
          far: this.cameraItem.far,
          xPos: this.cameraItem.xPos,
          yPos: this.cameraItem.yPos,
          zPos: this.cameraItem.zPos
        });        
      }
    ); 
  }

  toggleEdit(): void
  {
    this.editing = !this.editing;
  }

}

import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ThreejsService } from '../../../threejs.service';
import { PerspectiveCameraInterface } from '../../../interfaces/camera-interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-perspective-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './perspective-form.component.html',
  styleUrl: './perspective-form.component.scss'
})
export class PerspectiveFormComponent implements OnDestroy {
  threeJsService: ThreejsService = inject(ThreejsService);

  cameraItem: PerspectiveCameraInterface | undefined;

  form: FormGroup = new FormGroup({
    fov: new FormControl(0),
    aspect: new FormControl(0),
    near: new FormControl(0),
    far: new FormControl(0),
    xPos: new FormControl(0),
    yPos: new FormControl(0),
    zPos: new FormControl(0)
  });

  subs: Subscription[] = [];

  constructor() {
    const sub = this.form.valueChanges.subscribe(
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

          this.threeJsService.updateCamera();
        }
      }
    );

    this.subs.push(sub);

    effect(
      () => {
        this.cameraItem = this.threeJsService.cameraItemValues();

        if (this.cameraItem)
        {
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
        
      }
    ); 
  }

  ngOnDestroy(): void {
    this.subs.forEach(
      sub => sub.unsubscribe()
    );
  }
}

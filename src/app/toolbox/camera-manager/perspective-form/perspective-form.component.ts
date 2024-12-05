import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ThreejsService } from '../../../services/threejs.service';
import {CameraInterface } from '../../../interfaces/three/camera-interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-perspective-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  templateUrl: './perspective-form.component.html',
  styleUrl: './perspective-form.component.scss'
})
export class PerspectiveFormComponent implements OnDestroy {
  threeJsService: ThreejsService = inject(ThreejsService);

  cameraItem: CameraInterface | undefined;

  form: FormGroup = new FormGroup({
    fov: new FormControl(0),
    aspect: new FormControl(0),
    near: new FormControl(0),
    far: new FormControl(0),
    xPos: new FormControl(0),
    yPos: new FormControl(0),
    zPos: new FormControl(0), 
    xLookat: new FormControl(0),
    yLookat: new FormControl(0),
    zLookat: new FormControl(0),
    animated: new FormControl(false)
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
            this.cameraItem.xPos.startValue = this.form.value.xPos;
          }        

          if (this.form.value.yPos || this.form.value.yPos === 0) {          
            this.cameraItem.yPos.startValue = this.form.value.yPos;
          }        

          if (this.form.value.zPos || this.form.value.zPos === 0) {          
            this.cameraItem.zPos.startValue = this.form.value.zPos;
          }

          if (this.form.value.xLookat || this.form.value.xLookat === 0) {          
            const xLookat = parseFloat(this.form.value.xLookat);
            if (!isNaN(xLookat))
            {
              this.cameraItem.xLookat.startValue = xLookat;
            }
          }

          if (this.form.value.yLookat || this.form.value.yLookat === 0) {          
            const yLookat = parseFloat(this.form.value.yLookat);
            if (!isNaN(yLookat))
            {
              this.cameraItem.yLookat.startValue = yLookat;
            }
          }

          if (this.form.value.zLookat || this.form.value.zLookat === 0) {          
            const zLookat = parseFloat(this.form.value.zLookat);
            if (!isNaN(zLookat))
            {
              this.cameraItem.zLookat.startValue = zLookat;
            }
          }

        this.cameraItem.animated = this.form.value.animated;

          this.threeJsService.updateCamera();
        }
      }
    );

    this.subs.push(sub);

    effect(
      () => {
        if (this.threeJsService.cameraItemValues()[0].type === 'PerspectiveCamera')
        {
          this.cameraItem = this.threeJsService.cameraItemValues()[0] as CameraInterface;
          if (this.cameraItem)
          {
            this.form.patchValue({
              fov: this.cameraItem.fov,
              aspect: this.cameraItem.aspect,
              near: this.cameraItem.near,
              far: this.cameraItem.far,
              xPos: this.cameraItem.xPos.startValue,
              yPos: this.cameraItem.yPos.startValue,
              zPos: this.cameraItem.zPos.startValue,
              xLookat: this.cameraItem.xLookat.startValue,
              yLookat: this.cameraItem.yLookat.startValue,
              zLookat: this.cameraItem.zLookat.startValue,
              animated: this.cameraItem.animated
            }, {emitEvent: false});
          }
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

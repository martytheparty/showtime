import { Component, OnDestroy, effect, inject } from '@angular/core';
import { ThreejsService } from '../../../threejs.service';
import { OrthographicCameraInterface } from '../../../interfaces/camera-interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-og-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './og-form.component.html',
  styleUrl: './og-form.component.scss'
})
export class OgFormComponent implements OnDestroy {
  threeJsService: ThreejsService = inject(ThreejsService);
  cameraItem: OrthographicCameraInterface | undefined;

  form: FormGroup = new FormGroup({
    bottom: new FormControl(0),
    top: new FormControl(0),
    left: new FormControl(0),
    right: new FormControl(0),
    near: new FormControl(0),
    xPos: new FormControl(0),
    yPos: new FormControl(0),
    zPos: new FormControl(0)
  });

  subs: Subscription[] = [];
  
  constructor(){
    effect(() => {
      this.cameraItem = this.threeJsService.orthographicCameraItemValues();

      this.form.setValue(
        {
          bottom: this.cameraItem.bottom,
          top: this.cameraItem.top,
          left: this.cameraItem.left,
          right: this.cameraItem.right,
          near: this.cameraItem.near,
          xPos: this.cameraItem.xPos,
          yPos: this.cameraItem.yPos,
          zPos: this.cameraItem.zPos
        });

      const sub = this.form.valueChanges.subscribe(
        () => {
          if (this.cameraItem)
          {
  
            if (this.form.value.left || this.form.value.left === 0) {
              const left = parseFloat(this.form.value.left);
              if (!isNaN(left))
              {
                this.cameraItem.left = left;
              }          
            }
  
            if (this.form.value.right || this.form.value.right === 0) {
              const right = parseFloat(this.form.value.right);
              if (!isNaN(right))
              {
                this.cameraItem.right = right;
              }
            }
  
            if (this.form.value.top || this.form.value.top === 0) {
              const top = parseFloat(this.form.value.top);
              if (!isNaN(top))
              {
                this.cameraItem.top = top;
              }
            }        

            if (this.form.value.bottom || this.form.value.bottom === 0) {
              const bottom = parseFloat(this.form.value.bottom);
              if (!isNaN(bottom))
              {
                this.cameraItem.bottom = bottom;
              }
            }
  
            if (this.form.value.far || this.form.value.far === 0) {
              const far = parseFloat(this.form.value.far);
              if (!isNaN(far))
              {
                this.cameraItem.far = far;
              }
            }        
  
            if (this.form.value.xPos || this.form.value.xPos === 0) {
              const xPos = parseFloat(this.form.value.xPos);
              if (!isNaN(xPos))
              {
                this.cameraItem.xPos = xPos;
              }
            }
  
            if (this.form.value.yPos || this.form.value.yPos === 0) {          
              const yPos = parseFloat(this.form.value.yPos);
              if (!isNaN(yPos))
              {
                this.cameraItem.yPos = yPos;
              }
            }        
  
            if (this.form.value.zPos || this.form.value.zPos === 0) {          
              const zPos = parseFloat(this.form.value.zPos);
              if (!isNaN(zPos))
              {
                this.cameraItem.zPos = zPos;
              }
            }
  
            this.threeJsService.updateCamera();
          }
  
        }
      );

      this.subs.push(sub);
    })
  }

  ngOnDestroy(): void {
    this.subs.forEach(
      (sub) => {
        sub.unsubscribe();
      }
    );
  }

}

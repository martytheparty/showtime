import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ThreejsService } from '../threejs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MeshInterface } from '../interfaces/mesh-interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MeshManagerComponent } from './mesh-manager/mesh-manager.component';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [MeshManagerComponent],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.scss'
})
export class ToolboxComponent{
  threejsService: ThreejsService = inject(ThreejsService);
  constructor(){
    effect(
      () => {
        if (this.threejsService.isInitiazed())
        {
          this.threejsService.setupCamera();
        }
      }
    ); 
  }
}

import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ThreejsService } from '../threejs.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MeshManagerComponent } from './mesh-manager/mesh-manager.component';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [MatIconModule, MatTabsModule, MeshManagerComponent],
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

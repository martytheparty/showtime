import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ThreejsService } from '../services/threejs.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MeshManagerComponent } from './mesh-manager/mesh-manager.component';
import { CameraManagerComponent } from './camera-manager/camera-manager.component';
import { AnimationManagerComponent } from './animation-manager/animation-manager.component';
import { LightManagerComponent } from './light-manager/light-manager.component';
import { SceneManagerComponent } from './scene-manager/scene-manager.component';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,
    MeshManagerComponent,
    CameraManagerComponent,
    AnimationManagerComponent,
    LightManagerComponent,
    SceneManagerComponent
  ],
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
          this.threejsService.setUpScene();
        }
      }
    ); 
  }
}

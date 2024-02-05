import { AfterViewInit, Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../threejs.service';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [],
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
          this.threejsService.addMesh();
        }
      }
    ); 
  }
}

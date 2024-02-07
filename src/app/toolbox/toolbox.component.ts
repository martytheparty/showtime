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
  xPosition = 0;

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

  addMesh(): void
  {

    this.threejsService.addMesh(this.xPosition);

    if (this.xPosition === 0){
      this.xPosition = 2;
    } else if (this.xPosition > 0) {
      this.xPosition = this.xPosition * -1;
    } else if (this.xPosition < 0) {
      this.xPosition = this.xPosition * -1 + 2;
    }
  }
}

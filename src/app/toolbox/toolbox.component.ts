import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../threejs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MeshInterface } from '../interfaces/mesh-interface';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.scss'
})
export class ToolboxComponent{
  threejsService: ThreejsService = inject(ThreejsService);
  xPosition = 0;

  meshList: MeshInterface[] = [];

  constructor(){
    effect(
      () => {
        if (this.threejsService.isInitiazed())
        {
          this.threejsService.setupCamera();
        }

        this.meshList = this.threejsService.melisList();
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

  deleteMesh(id: number): void
  {
    this.threejsService.deleteMesh(id);
  }
}

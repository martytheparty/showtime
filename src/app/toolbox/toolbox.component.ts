import { Component, inject, effect } from '@angular/core';
import { ThreejsService } from '../threejs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MeshInterface } from '../interfaces/mesh-interface';
import { FormControl, FormGroup } from '@angular/forms';

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

  editId = 0;

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

    const meshItem = this.threejsService.addMesh(this.xPosition);

    const form = new FormGroup(
      {
        id: new FormControl(meshItem.id),
        xPos: new FormControl(meshItem.xPos)
      }
    );

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

  setEditId(id: number): void
  {
    this.editId = id;
  }

  resetEditId(): void
  {
    this.editId = 0;
  }
}

import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ThreejsService } from '../threejs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MeshInterface } from '../interfaces/mesh-interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.scss'
})
export class ToolboxComponent implements OnDestroy{
  threejsService: ThreejsService = inject(ThreejsService);
  xPosition = 0;

  editId = 0;

  meshList: MeshInterface[] = [];

  subs: Subscription[] = [];

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

  ngOnDestroy(): void {
    this.subs.forEach(
      (sub) => sub?.unsubscribe()
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

    const sub: Subscription = form.valueChanges.subscribe(
      () => {
        if(form.value.xPos || form.value.xPos === 0)
        {
          // update...
        }
      }
    );

    this.subs.push(sub);
    meshItem.sub = sub;

    meshItem.form = form;

    if (this.xPosition === 0){
      this.xPosition = 2;
    } else if (this.xPosition > 0) {
      this.xPosition = this.xPosition * -1;
    } else if (this.xPosition < 0) {
      this.xPosition = this.xPosition * -1 + 2;
    }
  }

  deleteMesh(meshItem: MeshInterface): void
  {
    this.threejsService.deleteMesh(meshItem.id);
    meshItem.sub?.unsubscribe();
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

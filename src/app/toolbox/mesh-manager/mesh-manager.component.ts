import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThreejsService } from '../../threejs.service';
import { MeshInterface } from '../../interfaces/mesh-interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mesh-manager',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './mesh-manager.component.html',
  styleUrl: './mesh-manager.component.scss'
})
export class MeshManagerComponent implements OnDestroy{
  threejsService: ThreejsService = inject(ThreejsService);
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

    const meshItem: MeshInterface = {
      id: -1,
      xPos: 0,
      yPos: 0,
      zPos: 0
    } 
    this.threejsService.addMesh(meshItem);

    const form = new FormGroup(
      {
        id: new FormControl(meshItem.id),
        xPos: new FormControl(meshItem.xPos),
        yPos: new FormControl(meshItem.yPos),
        zPos: new FormControl(meshItem.zPos)
      }
    );

    const sub: Subscription = form.valueChanges.subscribe(
      () => {
        if(form.value.xPos || form.value.xPos === 0)
        {
          meshItem.xPos = form.value.xPos;
          this.threejsService.updateMesh(meshItem);
        }

        if(form.value.yPos || form.value.yPos === 0)
        {
          meshItem.yPos = form.value.yPos;
          this.threejsService.updateMesh(meshItem);
        }

        if(form.value.zPos || form.value.zPos === 0)
        {
          meshItem.zPos = form.value.zPos;
          this.threejsService.updateMesh(meshItem);
        }
      }
    );

    this.subs.push(sub);
    meshItem.sub = sub;

    meshItem.form = form;

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

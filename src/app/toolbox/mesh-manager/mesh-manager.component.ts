import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThreejsService } from '../../threejs.service';
import { MeshInterface } from '../../interfaces/mesh-interface';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-mesh-manager',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
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
        this.meshList = this.threejsService.meshList();
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
      zPos: 0,
      materialType: 'normal'
    } 
    this.threejsService.addMesh(meshItem);

    const form = this.setupForm(meshItem);
    this.setupSubs(meshItem, form);
  }

  setupSubs(meshItem: MeshInterface, form: FormGroup): void
  {
    const sub: Subscription = form.valueChanges.subscribe(
      () => {
        let updated = false;

        if(form.value.xPos || form.value.xPos === 0)
        {
          meshItem.xPos = form.value.xPos;
          updated = true;
        }

        if(form.value.yPos || form.value.yPos === 0)
        {
          meshItem.yPos = form.value.yPos;
          updated = true;
        }

        if(form.value.zPos || form.value.zPos === 0)
        {
          meshItem.zPos = form.value.zPos;
          updated = true;
        }

        if(form.value.materialType)
        {
          meshItem.materialType = form.value.materialType;
          updated = true;
        }

        if (updated)
        {
          this.threejsService.updateMesh(meshItem);
        }
      }
    );

    this.subs.push(sub);
    meshItem.sub = sub;

  }

  setupForm(meshItem: MeshInterface): FormGroup
  {
    const form = new FormGroup(
      {
        id: new FormControl(meshItem.id),
        xPos: new FormControl(meshItem.xPos),
        yPos: new FormControl(meshItem.yPos),
        zPos: new FormControl(meshItem.zPos),
        materialType: new FormControl(meshItem.materialType)
      }
    );

    meshItem.form = form;
    return form;
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

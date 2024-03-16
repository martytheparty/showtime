import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThreejsService } from '../../threejs.service';
import { MeshInterface } from '../../interfaces/mesh-interface';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ColorPickerComponent } from '../common-components/color-picker/color-picker.component';
import { MaterialsComponent } from './materials/materials.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-mesh-manager',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ColorPickerComponent,
    MaterialsComponent,
    MatTableModule,
    CommonModule,
    MatSliderModule
  ],
  templateUrl: './mesh-manager.component.html',
  styleUrl: './mesh-manager.component.scss'
})
export class MeshManagerComponent implements OnDestroy, OnInit{
  threejsService: ThreejsService = inject(ThreejsService);
  meshList: MeshInterface[] = [];
  subs: Subscription[] = [];
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'name', 'xPos', 'yPos', 'zPos', 'expand'];
  edit = true;
  expandedMeshId = 0;

  constructor(){
    effect(
      () => {
        this.meshList = this.threejsService.meshList();
      }
    ); 
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.forEach(
      (sub) => sub?.unsubscribe()
    );
  }

  addMesh(): MeshInterface
  {
    const meshItem: MeshInterface = {
      id: -1,
      name: '',
      xPos: 0,
      yPos: 0,
      zPos: 0,
      materialType: 'normal',
      redColor: 0,
      greenColor: 0,
      blueColor: 0
    } 
     
    this.threejsService.addMesh(meshItem);

    const form = this.setupForm(meshItem);
    this.setupSubs(meshItem, form);

    return meshItem;
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
        name: new FormControl(meshItem.name),
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

  redUpdate(value: number, meshItem: MeshInterface): void
  {
    meshItem.redColor = value;
    this.threejsService.updateMesh(meshItem);
  }

  greenUpdate(value: number, meshItem: MeshInterface): void
  {
    meshItem.greenColor = value;
    this.threejsService.updateMesh(meshItem);
  }

  blueUpdate(value: number, meshItem: MeshInterface): void
  {
    meshItem.blueColor = value;
    this.threejsService.updateMesh(meshItem);
  }

  launchMaterialDialog() {
    this.dialog.open(MaterialsComponent, {});
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }

}

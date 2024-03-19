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
import { TableFilterComponent } from '../common-components/table-filter/table-filter.component';

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
    MatSliderModule,
    TableFilterComponent
  ],
  templateUrl: './mesh-manager.component.html',
  styleUrl: './mesh-manager.component.scss'
})
export class MeshManagerComponent implements OnDestroy, OnInit{
  threejsService: ThreejsService = inject(ThreejsService);
  meshList: MeshInterface[] = [];
  filteredMeshList: MeshInterface[] = [];

  filterValue: string = '';

  subs: Subscription[] = [];
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'name', 'xPos', 'yPos', 'zPos', 'expand'];
  edit = true;
  expandedMeshId = 0;

  constructor(){
    effect(
      () => {
        this.meshList = this.threejsService.meshList();

        if(this.filterValue === '') {
          this.filteredMeshList = this.meshList;
        } else  {
          this.filteredMeshList = this.meshList.filter(
            (mesh: MeshInterface) => {
              return mesh.name?.toLocaleLowerCase().includes(this.filterValue.toLocaleLowerCase());
            }
          );
        }
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
      shape: 'BoxGeometry',
      xPos: 0,
      yPos: 0,
      zPos: 0,
      materialType: 'normal',
      redColor: 0,
      greenColor: 0,
      blueColor: 0,
      width: 1,
      height: 1,
      depth: 1,
      radius: 1
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
          meshItem.xPos = form.value.xPos;
          meshItem.yPos = form.value.yPos;
          meshItem.zPos = form.value.zPos;
          meshItem.materialType = form.value.materialType;
          meshItem.name = form.value.name;
          meshItem.shape = form.value.shape;
          meshItem.width = form.value.width;
          meshItem.height = form.value.height;
          meshItem.depth = form.value.depth;
          meshItem.radius = form.value.radius;
          this.threejsService.updateMesh(meshItem);
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
        shape: new FormControl(meshItem.shape),
        materialType: new FormControl(meshItem.materialType),
        width: new FormControl(meshItem.width),
        height: new FormControl(meshItem.height),
        depth: new FormControl(meshItem.depth),
        radius: new FormControl(meshItem.radius)
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

  updateFilter(event: string): void
  {
    this.filterValue = event;

    this.filteredMeshList = this.meshList.filter(
      (mesh: MeshInterface) => {
        return mesh.name?.toLocaleLowerCase().includes(this.filterValue.toLocaleLowerCase());
      }
    );
  }

}

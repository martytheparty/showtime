import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThreejsService } from '../../services/threejs.service';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontListComponent } from './font-list/font-list.component';

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
    MatCheckboxModule,
    ColorPickerComponent,
    MaterialsComponent,
    MatTableModule,
    CommonModule,
    MatSliderModule,
    TableFilterComponent,
    FontListComponent
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
  edit = false;
  expandedMeshId = 0;

  constructor(){
    effect(
      () => {
        this.meshList = this.threejsService.meshList();

        this.meshList.forEach(
          (meshItem) => this.updateForm(meshItem)
        );

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

  async addMesh(): Promise<MeshInterface>
  {
    const meshItem: MeshInterface = {
      id: -1,
      name: '',
      shape: 'BoxGeometry',
      xPos: { startValue: 0, endValue: 0, animated: true},
      yPos: { startValue: 0, endValue: 0, animated: true},
      zPos: { startValue: 0, endValue: 0, animated: true},
      materialType: 'basic',
      redColor: 255,
      greenColor: 255,
      blueColor: 255,
      width: 1,
      height: 1,
      size: 1,
      text: 'Hello World!',
      textOrig: 'Hello World!',
      bevelEnabled: true,
      curveSegments: 20,
      bevelSegments: 5,
      bevelOffset: 0,
      bevelThickness: 0.03,
      bevelSize: .02,
      steps: 1,
      depth: 1,
      radius: 1,
      castShadow: true,
      receiveShadow: true,
      animated: false,
      type: 'mesh',
      xRotation: { startValue: 0, endValue: 0, animated: true},
      yRotation: { startValue: 0, endValue: 0, animated: true},
      zRotation: { startValue: 0, endValue: 0, animated: true}
    } 
     
    await this.threejsService.addMesh(meshItem);

    const form = this.setupForm(meshItem);
    this.setupSubs(meshItem, form);

    return meshItem;
  }

  setupSubs(meshItem: MeshInterface, form: FormGroup): void
  {
    const sub: Subscription = form.valueChanges.subscribe(
      () => {
          meshItem.xPos.startValue = form.value.xPos;
          meshItem.yPos.startValue = form.value.yPos;
          meshItem.zPos.startValue = form.value.zPos;
          meshItem.materialType = form.value.materialType;
          meshItem.name = form.value.name;
          meshItem.shape = form.value.shape;
          meshItem.width = form.value.width;
          meshItem.height = form.value.height;
          meshItem.text = form.value.text;
          meshItem.bevelEnabled = form.value.bevelEnabled;
          meshItem.curveSegments = form.value.curveSegments;
          meshItem.bevelSegments = form.value.bevelSegments;
          meshItem.bevelOffset = form.value.bevelOffset;
          meshItem.bevelThickness = form.value.bevelThickness;
          meshItem.bevelSize = form.value.bevelSize;
          meshItem.steps = form.value.steps;
          meshItem.size = form.value.size;
          meshItem.depth = form.value.depth;
          meshItem.radius = form.value.radius;
          meshItem.castShadow = form.value.castShadow;
          meshItem.receiveShadow = form.value.receiveShadow;
          meshItem.animated = form.value.animated;
          meshItem.xRotation.startValue = form.value.xRotation;
          meshItem.yRotation.startValue = form.value.yRotation;
          meshItem.zRotation.startValue = form.value.zRotation;
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
        xPos: new FormControl(meshItem.xPos.startValue),
        yPos: new FormControl(meshItem.yPos.startValue),
        zPos: new FormControl(meshItem.zPos.startValue),
        shape: new FormControl(meshItem.shape),
        materialType: new FormControl(meshItem.materialType),
        width: new FormControl(meshItem.width),
        height: new FormControl(meshItem.height),
        text: new FormControl(meshItem.text),
        bevelEnabled: new FormControl(meshItem.bevelEnabled),
        curveSegments: new FormControl(meshItem.curveSegments),
        bevelSegments: new FormControl(meshItem.bevelSegments),
        bevelOffset: new FormControl(meshItem.bevelOffset),
        bevelThickness: new FormControl(meshItem.bevelThickness),
        bevelSize: new FormControl(meshItem.bevelSize),
        steps: new FormControl(meshItem.steps),
        size: new FormControl(meshItem.size),
        depth: new FormControl(meshItem.depth),
        radius: new FormControl(meshItem.radius),
        castShadow: new FormControl(meshItem.castShadow),
        receiveShadow: new FormControl(meshItem.receiveShadow),
        animated: new FormControl(meshItem.animated),
        xRotation: new FormControl(meshItem.xRotation.startValue),
        yRotation: new FormControl(meshItem.yRotation.startValue),
        zRotation: new FormControl(meshItem.zRotation.startValue)
      }
    );

    meshItem.form = form;
    return form;
  }

  updateForm(meshItem: MeshInterface): void
  { 
    if(meshItem.form) {
      meshItem.form.patchValue(
        {
          id: meshItem.id,
          name: meshItem.name,
          xPos: meshItem.xPos.startValue,
          yPos: meshItem.yPos.startValue,
          zPos: meshItem.zPos.startValue,
          shape: meshItem.shape,
          materialType: meshItem.materialType,
          width: meshItem.width,
          height: meshItem.height,
          text: meshItem.text,
          bevelEnabled: meshItem.bevelEnabled,
          curveSegments: meshItem.curveSegments,
          bevelSegments: meshItem.bevelSegments,
          bevelOffset: meshItem.bevelOffset,
          bevelThickness: meshItem.bevelThickness,
          bevelSize: meshItem.bevelSize,
          steps: meshItem.steps,
          size: meshItem.size,
          depth: meshItem.depth,
          radius: meshItem.radius,
          castShadow: meshItem.castShadow,
          receiveShadow: meshItem.receiveShadow,
          animated: meshItem.animated,
          xRotation: meshItem.xRotation.startValue,
          yRotation: meshItem.yRotation.startValue,
          zRotation: meshItem.zRotation.startValue
        }, { emitEvent: false}
      );
    } else {
      console.log('This mesh was added outside of this component... add the form in');
      // const form = this.setupForm(meshItem);
      // this.setupSubs(meshItem, form);
    }
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

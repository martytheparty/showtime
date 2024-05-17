import { Component, input, output, effect } from '@angular/core';
import { 
  AnimationInterfaceProperties,
  AnimationPair,
  AnimationPropertyDescriptor,
  MappedSupportedPropertyTypes,
  SuportedThreeObjTypes,
  ThreeObjProperties,
  ThreeObjSubProperties
} from '../../../../interfaces/animations-interfaces';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MeshInterface } from '../../../../interfaces/mesh-interface';
import { OrthographicCameraInterface, PerspectiveCameraInterface } from '../../../../interfaces/camera-interfaces';
import { LightInterface } from '../../../../interfaces/light-interface';

interface TableInterface {
  id: number
  name: string
  start: number
  end: number
  current: number
  type: SuportedThreeObjTypes
}

@Component({
  selector: 'app-animation-property',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './animation-property.component.html',
  styleUrl: './animation-property.component.scss'
})
export class AnimationPropertyComponent {

  displayName = input.required<string>();
  propertyName = input.required<AnimationInterfaceProperties>();
  animationPairs = input.required<AnimationPair[]>();
  threePropertyName = input.required<ThreeObjProperties>();
  threeSubPropertyName = input.required<ThreeObjSubProperties>();

  valueChange = output<AnimationPair>();

  displayedColumns: string[] = ['id', 'name', 'start', 'end', 'current'];
  tableData: TableInterface[] = [];
  filteredTableData: TableInterface[] = [];
  supportedPropsDictionary: MappedSupportedPropertyTypes = {
    xPos: ['light', 'mesh', 'PerspectiveCamera', 'OrthographicCamera'],
    yPos: ['light', 'mesh', 'PerspectiveCamera', 'OrthographicCamera'],
    zPos: ['light', 'mesh', 'PerspectiveCamera', 'OrthographicCamera'],
    xLookat: ['PerspectiveCamera', 'OrthographicCamera'],
    yLookat: ['PerspectiveCamera', 'OrthographicCamera'],
    zLookat: ['PerspectiveCamera', 'OrthographicCamera'],
    redColor: ['Scene']
  };
  previousData: AnimationPair[] = [];



  constructor() {
    effect( () => {
      
      if (!this.dataMatch(this.animationPairs())) {
        this.previousData = [...this.animationPairs()];
        this.tableData = this.animationPairs()
        .map( (pair: AnimationPair) => {
          let item = pair.item as any;

          // this code allows the transpiler to compile and 
          // strongly types item.
          if ('xLookat' in item)
          {
            item = item as PerspectiveCameraInterface | OrthographicCameraInterface;
          } else {
            item = item as MeshInterface | LightInterface;
          }

          let start = 0;
          let end = 0;

          let prop = item[this.propertyName()] as AnimationPropertyDescriptor;

          if (prop?.startValue && prop?.endValue) {
            // technically a property for a type for mesh
            // may exist on lights but the poperty on one
            // is animated and the property on the other
            // may not be animated
            start = prop.startValue;
            end = prop.endValue;
          }

          let threeObject = pair.threeObj as any;
          const id = pair.item.id;
          const name =  pair.item.name;
          const propertyName = this.threePropertyName();
          const subPropertyName = this.threeSubPropertyName();
          let current = 0;
          // threeObject[propertyName][subPropertyName] does not exist for lookAt default to 0
          // this will resolve itself on update.
          if(threeObject[propertyName][subPropertyName]) {
            current = threeObject[propertyName][subPropertyName];
          }
          const type = item.type;

          return {
            id,
            name,
            start,
            end,
            current,
            type
          };
        } ) as TableInterface[];
      }

      // filter by propertyName

      const filteredProperty = this.propertyName();
      this.filteredTableData = this.tableData.filter(
        (row: TableInterface) => {
          return this.supportedPropsDictionary[filteredProperty].includes(row.type);
        }
      );


    } );
  }

  dataMatch(newData: AnimationPair[]): boolean {
    const oldIds = this.previousData.map( (pair) => pair.item.id );
    const newIds = newData.map( (pair) => pair.item.id );

    return JSON.stringify(oldIds) === JSON.stringify(newIds);
  }

  getName(id: number): string {
    const pair: AnimationPair = this.getPair(id);
    if (pair){
      const item = pair.item;
      return item.name;
    } else {
      return '';
    }
  }

  getStart(id: number): number {
    const pair: AnimationPair = this.getPair(id);

    if (pair){
      let item = pair.item as any;

      // this code allows the transpiler to compile and 
      // strongly types item.
      if ('xLookat' in item)
      {
        item = item as PerspectiveCameraInterface | OrthographicCameraInterface;
      } else {
        item = item as MeshInterface | LightInterface;
      }

      const prop = item[this.propertyName()] as AnimationPropertyDescriptor;
      if (prop?.startValue)
      {
        return prop.startValue;
      }
    } 
    return 0;
    
  }

  getEnd(id: number): number {
    const pair: AnimationPair = this.getPair(id);

    if (pair){
      let item = pair.item as any;
      // this code allows the transpiler to compile and 
      // strongly types item.
      if ('xLookat' in item)
      {
        item = item as PerspectiveCameraInterface | OrthographicCameraInterface;
      } else {
        item = item as MeshInterface | LightInterface;
      }

      const prop = item[this.propertyName()] as AnimationPropertyDescriptor;      
      if (prop?.endValue) {
        return prop.endValue;
      }
    }

    return 0;
  }

  getCurrent(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    if (pair){
      const threeObj = pair.threeObj as any;
      let item = pair.item as any;

      // this code allows the transpiler to compile and 
      // strongly types item.
      if ('xLookat' in item)
      {
        item = item as PerspectiveCameraInterface | OrthographicCameraInterface;
      } else {
        item = item as MeshInterface | LightInterface;
      }

      let current = 0; 
      if (this.threePropertyName() === 'lookAt' && this.threeSubPropertyName() === 'x') {
        current = item.lastXLookat;
      } else if (this.threePropertyName() === 'lookAt' && this.threeSubPropertyName() === 'y') {
        current = item.lastYLookat;
      } else if (this.threePropertyName() === 'lookAt' && this.threeSubPropertyName() === 'z') {
        current = item.lastZLookat;
      } else if (this.threePropertyName() === 'background'&& this.threeSubPropertyName() === 'red') {
        current = threeObj[this.threePropertyName()].r;
      } else {
        current = threeObj[this.threePropertyName()][this.threeSubPropertyName()];
        console.log('current', current);
      }
      return current;
    } else {
      return 0;
    }
  }

  getPair(id: number): AnimationPair {
    const pairs: AnimationPair[] = this.animationPairs();
    const pair: AnimationPair = pairs.find((pair: AnimationPair) => pair.item.id === id) as AnimationPair;
    return pair;
  }

  update(id: number, event: KeyboardEvent, property: 'startValue' | 'endValue'): void
  {
    const target = event.target as HTMLInputElement;
    const pair: AnimationPair = this.getPair(id);
    let item = pair.item as any;

    // this code allows the transpiler to compile and 
    // strongly types item.
    if ('xLookat' in item)
    {
      item = item as PerspectiveCameraInterface | OrthographicCameraInterface;
    } else {
      item = item as MeshInterface | LightInterface;
    }

    let value = parseFloat(target.value);
    const prop = item[this.propertyName()] as AnimationPropertyDescriptor;

    if (!Number.isNaN(value)) {
      prop[property] = value;
      this.valueChange.emit(pair);
    }
  }

}

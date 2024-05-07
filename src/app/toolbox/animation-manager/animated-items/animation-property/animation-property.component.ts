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
    xLookat: ['PerspectiveCamera', 'OrthographicCamera']
  };
  previousData: AnimationPair[] = [];



  constructor() {
    effect( () => {

      // checking for the same length prevents a redraw when the user
      // modifies the input... without this the table redraws and the 
      // focus is lost when the user changes a value
      // there is an issue here... I need to check to see if the camera 
      // has changed because if the user changes the from perspective to
      // orthagraphic the id will change; but the length may stay the same
      // but the table needs to be refreshed to accomodate the new id
      
      if (!this.dataMatch(this.animationPairs())) {
        this.previousData = [...this.animationPairs()];
        this.tableData = this.animationPairs()
        .map( (pair: AnimationPair) => {
          const item = pair.item as any;

          let start = 0;
          let end = 0;
          const prop = item[this.propertyName()] as AnimationPropertyDescriptor;

          if (prop?.startValue && prop?.endValue) {
            // technically a property for a type for mesh
            // may exist on lights but the poperty on one
            // is animated and the property on the other
            // may not be animated
            start = prop.startValue;
            end = prop.endValue;
          }

          const threeObject = pair.threeObj as any;
          const id = pair.item.id;
          const name =  pair.item.name;
          const propertyName = this.threePropertyName();
          const subPropertyName = this.threeSubPropertyName();
          const current = threeObject[propertyName][subPropertyName]
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
      const item = pair.item as any;
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
      const item = pair.item as any;
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
      const item = pair.item as any;
      let current = 0; 
      if (this.threePropertyName() === 'lookAt' && this.threeSubPropertyName() === 'x') {
        current = item.lastXLookat;
      } else {
        current = threeObj[this.threePropertyName()][this.threeSubPropertyName()];
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
    const item = pair.item as any;
    let value = parseFloat(target.value);
    const prop = item[this.propertyName()] as AnimationPropertyDescriptor;

    if (!Number.isNaN(value)) {
      prop[property] = value;
      this.valueChange.emit(pair);
    }
  }

}

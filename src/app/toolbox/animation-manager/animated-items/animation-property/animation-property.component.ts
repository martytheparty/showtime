import { Component, input, output, effect } from '@angular/core';
import { 
  AnimationInterfaceProperties,
  AnimationPair,
  AnimationPropertyDescriptor,
  MappedSupportedPropertyTypes,
  SuportedPropertyTypes,
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
  type: SuportedPropertyTypes
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
    xPos: ['light', 'mesh'],
    yPos: ['mesh'],
    zPos: ['mesh']
  };



  constructor() {
    effect( () => {

      // checking for the same length prevents a redraw when the user
      // modifies the input... without this the table redraws and the 
      // focus is lost when the user changes a value
      if (this.animationPairs().length !== this.tableData.length) {
        this.tableData = this.animationPairs()
        .map( (pair: AnimationPair) => {
          const item = pair.item;

          let start = 0;
          let end = 0;
          const prop = item[this.propertyName()] as AnimationPropertyDescriptor;

          if (prop.startValue && prop.endValue) {
            // technically a property for a type for mesh
            // may exist on lights but the poperty on one
            // is animated and the property on the other
            // may not be animated
            start = prop.startValue;
            end = prop.endValue;
          }

          return {
            id: pair.item.id,
            name: pair.item.name,
            start,
            end,
            current: pair.threeObj[this.threePropertyName()][this.threeSubPropertyName()],
            type: item.type
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

  getName(id: number): string {
    const pair: AnimationPair = this.getPair(id);
    const item = pair.item;

    if (pair){
      return item.name;
    } else {
      return '';
    }
  }

  getStart(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    const item = pair.item;
    const prop = item[this.propertyName()] as AnimationPropertyDescriptor;

    if (pair && prop.startValue){
      return prop.startValue;
    } else {
      return 0;
    }
  }

  getEnd(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    const item: MeshInterface = pair.item as MeshInterface;
    const prop = item[this.propertyName()] as AnimationPropertyDescriptor;

    if (pair && prop.endValue){
      return prop.endValue;
    } else {
      return 0;
    }
  }

  getCurrent(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    if (pair){
      return pair.threeObj[this.threePropertyName()][this.threeSubPropertyName()];
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
    const item = pair.item;
    let value = parseFloat(target.value);
    const prop = item[this.propertyName()] as AnimationPropertyDescriptor;

    if (!Number.isNaN(value)) {
      prop[property] = value;
      this.valueChange.emit(pair);
    }
  }

}

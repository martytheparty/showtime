import { Component, input, output, effect } from '@angular/core';
import { 
  AnimationInterfaceProperties,
  AnimationPair,
  ThreeObjProperties,
  ThreeObjSubProperties
} from '../../../../interfaces/animations-interfaces';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

interface TableInterface {
  id: number
  name: string
  start: number
  end: number
  current: number
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


  constructor() {
    effect( () => {

      // checking for the same length prevents a redraw when the user
      // modifies the input... without this the table redraws and the 
      // focus is lost when the user changes a value
      if (this.animationPairs().length !== this.tableData.length) {
        this.tableData = this.animationPairs().map( (pair: AnimationPair) => {
          return {
            id: pair.item.id,
            name: pair.item.name,
            start: pair.item[this.propertyName()].startValue,
            end: pair.item[this.propertyName()].endValue,
            current: pair.threeObj[this.threePropertyName()][this.threeSubPropertyName()]
          };
        } );
      }

    } );
  }

  getName(id: number): string {
    const pair: AnimationPair = this.getPair(id);
    if (pair){
      return pair.item.name;
    } else {
      return '';
    }
  }

  getStart(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    if (pair){
      return pair.item[this.propertyName()].startValue;
    } else {
      return 0;
    }
  }

  getEnd(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    if (pair){
      return pair.item[this.propertyName()].endValue;
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
    const pair = this.getPair(id);
    let value = parseFloat(target.value);
    if (!Number.isNaN(value)) {
      pair.item[this.propertyName()][property] = value;
      this.valueChange.emit(pair);
    }
  }

}

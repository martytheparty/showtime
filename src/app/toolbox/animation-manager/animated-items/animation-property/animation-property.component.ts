import { Component, input, output } from '@angular/core';
import { 
  AnimationInterfaceProperties,
  AnimationPair,
  ThreeObjProperties,
  ThreeObjSubProperties
} from '../../../../interfaces/animations-interfaces';

@Component({
  selector: 'app-animation-property',
  standalone: true,
  imports: [],
  templateUrl: './animation-property.component.html',
  styleUrl: './animation-property.component.scss'
})
export class AnimationPropertyComponent {

  displayName = input.required<string>();
  propertyName = input.required<AnimationInterfaceProperties>();
  animationPairs = input.required<AnimationPair[]>();
  threePropertyName = input.required<ThreeObjProperties>();
  threeSubPropertyName = input.required<ThreeObjSubProperties>();

  startValueChange = output<AnimationPair>();
  endValueChange = output<AnimationPair>();
  valueChange = output<AnimationPair>();

  getStart(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    return pair.item[this.propertyName()].startValue;
  }

  getEnd(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    return pair.item[this.propertyName()].endValue
  }

  getCurrent(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    return pair.threeObj[this.threePropertyName()][this.threeSubPropertyName()];
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

import { Component, input } from '@angular/core';
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
// the 'x' or 'y' needs to be configuraable

    return pair.threeObj[this.threePropertyName()][this.threeSubPropertyName()];
  }

  getPair(id: number): AnimationPair {
    const pairs: AnimationPair[] = this.animationPairs();
    const pair: AnimationPair = pairs.find((pair: AnimationPair) => pair.item.id === id) as AnimationPair;

    return pair;
  }

  updateStart(id: number, event: KeyboardEvent): void
  {
    console.log(id);

    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

}

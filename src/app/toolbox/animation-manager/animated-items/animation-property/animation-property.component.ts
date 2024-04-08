import { Component, input } from '@angular/core';
import { AnimationInterface, AnimationPair } from '../../../../interfaces/animations-interfaces';

@Component({
  selector: 'app-animation-property',
  standalone: true,
  imports: [],
  templateUrl: './animation-property.component.html',
  styleUrl: './animation-property.component.scss'
})
export class AnimationPropertyComponent {

  displayName = input.required<string>();
  propertyName = input.required<string>();
  animationPairs = input.required<AnimationPair[]>();

  getStart(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    const property: 'xPos' | 'yPos' = this.getProperty();

    return pair.item[property].startValue;
  }

  getEnd(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    const property: 'xPos' | 'yPos' = this.getProperty();

    return pair.item[property].endValue
  }

  getCurrent(id: number): number {
    const pair: AnimationPair = this.getPair(id);
    const property: 'xPos' | 'yPos' = this.getProperty();
// the 'position' attribute needs to be configurable
// the 'x' or 'y' needs to be configuraable

    return pair.threeObj.position.x;
  }

  getPair(id: number): AnimationPair {
    const pairs: AnimationPair[] = this.animationPairs();
    const pair: AnimationPair = pairs.find((pair: AnimationPair) => pair.item.id === id) as AnimationPair;

    return pair;
  }

  getProperty(): 'xPos' | 'yPos' {
    return this.propertyName() as 'xPos' | 'yPos';
  }
}

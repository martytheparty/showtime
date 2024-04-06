import { Component, effect, inject } from '@angular/core';
import { ThreejsService } from '../../../threejs.service';
import { AnimationPair } from '../../../interfaces/animations-interfaces';
import { FormControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MeshInterface } from '../../../interfaces/mesh-interface';

@Component({
  selector: 'app-animated-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animated-items.component.html',
  styleUrl: './animated-items.component.scss'
})
export class AnimatedItemsComponent {
  threeJsService: ThreejsService = inject(ThreejsService);
  animationPairs: AnimationPair[] = [];
  animationFormsDictionary: { [key: number]: AnimationPair } = {};
  animationForms: FormGroup<AnimationPropertyGroup>[] = [];

  constructor(){
    effect(() => {
      this.animationPairs = this.threeJsService.animationPairValues();
      this.animationPairs.forEach( (pair: AnimationPair) => {
        if (!this.animationFormsDictionary[pair.item.id]) {
          const formGroup: FormGroup<AnimationPropertyGroup> = new FormGroup<AnimationPropertyGroup>({
            id: new FormControl(pair.item.id),
            startValue: new FormControl(pair.item.xPos.startValue),
            endValue: new FormControl(pair.item.xPos.endValue)
          });
          this.animationFormsDictionary[pair.item.id] = pair;
          this.animationForms.push(formGroup);
        } 
      } );

      const keys = Object.keys(this.animationFormsDictionary);
      keys.forEach( (key: string) => {
        const pair = this.animationPairs.find( (pair) => pair.item.id.toString() === key );
        if (pair === undefined) {
          delete this.animationPairs[parseInt(key)];

          this.animationForms = this.animationForms
          .filter( (form) => {
            return form.value.id !== parseInt(key);
          }  );
        }
      } );
    })
  }

  getPair(id: number | null): AnimationPair
  {
    // the row would not render if there was not an id
    const forcedId = id as number;
    return this.animationFormsDictionary[forcedId];
  }

  updateMesh(form: FormGroup<AnimationPropertyGroup>): void
  {
    const id: number = form.value.id as number;
    let xPosStart: number | null | undefined = form.value.startValue;
    let xPosEnd: number | null | undefined = form.value.endValue;
    const pair: AnimationPair = this.animationFormsDictionary[id];
    const item: MeshInterface = pair.item;

    if (xPosStart !== null && xPosStart !== undefined) {
      xPosStart = xPosStart*1;
      if (!Number.isNaN(xPosStart))
      {
        item.xPos.startValue = xPosStart;
      }
    }

    if (xPosEnd !== null && xPosEnd !== undefined) {
      xPosEnd = xPosEnd*1;
      if (!Number.isNaN(xPosEnd))
      {
        item.xPos.endValue = xPosEnd;
      }
    }
    this.threeJsService.updateMesh(item);
  }
}

interface AnimationPropertyGroup {
  id: FormControl<number | null>;
  startValue: FormControl<number | null>;
  endValue: FormControl<number | null>;
}

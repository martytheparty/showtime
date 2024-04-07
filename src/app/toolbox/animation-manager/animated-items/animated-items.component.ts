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
  xAnimationForms: FormGroup<AnimationPropertyGroup>[] = [];
  yAnimationForms: FormGroup<AnimationPropertyGroup>[] = [];

  constructor(){
    effect(() => {
      console.log('effect');
      this.animationPairs = this.threeJsService.animationPairValues();
      this.animationPairs.forEach( (pair: AnimationPair) => {
        if (this.animationFormsDictionary[pair.item.id]) {
          let form = this.xAnimationForms.find(
            (form) => form.value.id = pair.item.id
          );

          if (form) {
            form.patchValue({startValue: pair.item.xPos.startValue*1});

            form = {... form} as FormGroup<AnimationPropertyGroup>;

            this.xAnimationForms = [... this.xAnimationForms];
          }
        }
        else {
          // create a new form
          const formXGroup: FormGroup<AnimationPropertyGroup> = new FormGroup<AnimationPropertyGroup>({
            id: new FormControl(pair.item.id),
            startValue: new FormControl(pair.item.xPos.startValue),
            endValue: new FormControl(pair.item.xPos.endValue)
          });
          this.xAnimationForms.push(formXGroup);

          const formYGroup: FormGroup<AnimationPropertyGroup> = new FormGroup<AnimationPropertyGroup>({
            id: new FormControl(pair.item.id),
            startValue: new FormControl(pair.item.yPos.startValue),
            endValue: new FormControl(pair.item.yPos.endValue)
          });
          this.yAnimationForms.push(formYGroup);
        } 

        this.animationFormsDictionary[pair.item.id] = pair;

      } );

      const keys = Object.keys(this.animationFormsDictionary);
      keys.forEach( (key: string) => {
        const pair = this.animationPairs.find( (pair) => pair.item.id.toString() === key );
        if (pair === undefined) {
          delete this.animationPairs[parseInt(key)];

          this.xAnimationForms = this.xAnimationForms
          .filter( (form) => {
            return form.value.id !== parseInt(key);
          }  );

          this.yAnimationForms = this.yAnimationForms
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

  updateXMesh(form: FormGroup<AnimationPropertyGroup>): void
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

  updateYMesh(form: FormGroup<AnimationPropertyGroup>): void
  {
    const id: number = form.value.id as number;
    let yPosStart: number | null | undefined = form.value.startValue;
    let yPosEnd: number | null | undefined = form.value.endValue;
    const pair: AnimationPair = this.animationFormsDictionary[id];
    const item: MeshInterface = pair.item;

    if (yPosStart !== null && yPosStart !== undefined) {
      yPosStart = yPosStart*1;
      if (!Number.isNaN(yPosStart))
      {
        item.yPos.startValue = yPosStart;
      }
    }

    if (yPosEnd !== null && yPosEnd !== undefined) {
      yPosEnd = yPosEnd*1;
      if (!Number.isNaN(yPosEnd))
      {
        item.yPos.endValue = yPosEnd;
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

import { Component, effect, inject } from '@angular/core';
import { ThreejsService } from '../../../threejs.service';
import { AnimationPair } from '../../../interfaces/animations-interfaces';
import { FormControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MeshInterface } from '../../../interfaces/mesh-interface';
import { AnimationPropertyComponent } from './animation-property/animation-property.component';

@Component({
  selector: 'app-animated-items',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    AnimationPropertyComponent
  ],
  templateUrl: './animated-items.component.html',
  styleUrl: './animated-items.component.scss'
})
export class AnimatedItemsComponent {
  threeJsService: ThreejsService = inject(ThreejsService);
  animationPairs: AnimationPair[] = [];

  constructor(){
    effect(() => {
      this.animationPairs = this.threeJsService.animationPairValues();
    })
  }

  valueChange(pair: AnimationPair): void
  {
    this.threeJsService.updateMesh(pair.item);
  }

}

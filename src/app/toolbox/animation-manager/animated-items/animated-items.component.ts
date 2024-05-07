import { Component, effect, inject } from '@angular/core';
import { ThreejsService } from '../../../threejs.service';
import { AnimationInterfaceProperties, AnimationPair, ThreeObjProperties, ThreeObjSubProperties } from '../../../interfaces/animations-interfaces';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnimationPropertyComponent } from './animation-property/animation-property.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface PropertyMenuItem {
  name: string
  itemValue: AnimationInterfaceProperties,
  threeProperty: ThreeObjProperties,
  threeSubProperty: ThreeObjSubProperties
}

@Component({
  selector: 'app-animated-items',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    AnimationPropertyComponent,
    FormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './animated-items.component.html',
  styleUrl: './animated-items.component.scss'
})
export class AnimatedItemsComponent {
  threeJsService: ThreejsService = inject(ThreejsService);
  animationPairs: AnimationPair[] = [];
  menuItems: PropertyMenuItem[] = [
    { name: 'X Position', itemValue: 'xPos', threeProperty: 'position', threeSubProperty: 'x'},
    { name: 'Y Position', itemValue: 'yPos', threeProperty: 'position', threeSubProperty: 'y'},
    { name: 'Z Position', itemValue: 'zPos', threeProperty: 'position', threeSubProperty: 'z'},
    { name: 'X LookAt', itemValue: 'xLookat', threeProperty: 'lookAt', threeSubProperty: 'x'}
  ];
  selectedProperty: PropertyMenuItem = this.menuItems[0];

  constructor(){
    effect(() => {
      this.animationPairs = this.threeJsService.animationPairValues();
    })
  }

  valueChange(pair: AnimationPair): void
  {
    if (pair.item.type === 'mesh')
    {
      this.threeJsService.updateMesh(pair.item);
    } else if (pair.item.type === 'light') {
      this.threeJsService.updateLight(pair.item);
    }  else if (pair.item.type === 'PerspectiveCamera' ||
                pair.item.type === 'OrthographicCamera') {
      this.threeJsService.updateCamera();
    }

  }

}

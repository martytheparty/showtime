import { Component, effect, inject } from '@angular/core';
import { ThreejsService } from '../../../services/threejs.service';
import { AnimationPair, PropertyMenuItem } from '../../../interfaces/animations-interfaces';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnimationPropertyComponent } from './animation-property/animation-property.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  menuItems: PropertyMenuItem[] = [];
  selectedProperty: PropertyMenuItem | undefined;

  constructor(){
    effect(() => {
      this.animationPairs = this.threeJsService.animationPairValues();
      this.menuItems = this.threeJsService.animationMenuItemValues();
      if (this.selectedProperty === undefined && this.menuItems.length > 0) {
        this.selectedProperty = this.menuItems[0];
      }

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
    } else if (pair.item.type === 'Scene') {
      this.threeJsService.updateScene(pair.item);
    }

  }

}

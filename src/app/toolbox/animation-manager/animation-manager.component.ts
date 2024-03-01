import { Component, effect, inject } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ThreejsService } from '../../threejs.service';

@Component({
  selector: 'app-animation-manager',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './animation-manager.component.html',
  styleUrl: './animation-manager.component.scss'
})
export class AnimationManagerComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  checked = false;

  constructor(){
    effect(() => {
      this.checked = this.threeJsService.animationValue();
    })
  }

  updateAnimation(event: MatCheckboxChange): void
  {
    this.threeJsService.updateAnimation(event.checked);
  }
}

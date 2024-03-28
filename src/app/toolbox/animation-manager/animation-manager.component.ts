import { Component, effect, inject } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ThreejsService } from '../../threejs.service';

@Component({
  selector: 'app-animation-manager',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
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
    if (event.checked) {
      this.restartAnimation();
    }
  }

  restartAnimation():void {
    this.threeJsService.resetClock();
  }
}

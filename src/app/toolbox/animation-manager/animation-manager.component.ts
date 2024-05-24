import { Component, effect, inject } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ThreejsService } from '../../services/threejs.service';
import { AnimationInterface, AnimationPair } from '../../interfaces/animations-interfaces';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { AnimatedItemsComponent } from './animated-items/animated-items.component';
@Component({
  selector: 'app-animation-manager',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
    CommonModule,
    AnimatedItemsComponent
  ],
  templateUrl: './animation-manager.component.html',
  styleUrl: './animation-manager.component.scss'
})
export class AnimationManagerComponent {
  threeJsService: ThreejsService = inject(ThreejsService);

  checked = false;
  animation: AnimationInterface | undefined;

  constructor(){
    effect(() => {
      this.animation = this.threeJsService.animationValue();
    })
  }

  updateAnimation(event: MatCheckboxChange): void
  {
    if (this.animation) {
      this.animation.running = event.checked;
      this.threeJsService.updateAnimation(this.animation);
      if (event.checked) {
        this.restartAnimation();
      }
    }
  }

  updateAnimationLooping(event: MatCheckboxChange): void
  {
    if (this.animation) {
      this.animation.looping = event.checked;
      this.threeJsService.updateAnimation(this.animation);
      if (event.checked) {
        this.restartAnimation();
      }
    }
  }

  updateLoopTime(): void
  {
    if (this.animation) {
      this.animation.time = this.animation.time*1;
      if (Number.isNaN(this.animation.time)) {
        this.animation.time = 0;
      }
      this.threeJsService.updateAnimation(this.animation);
    }
  }

  updatePause(event: MatCheckboxChange): void
  {
    if (this.animation) {
      this.animation.pause = event.checked;
      this.threeJsService.updateAnimation(this.animation);
    }
  }

  restartAnimation():void {
    this.threeJsService.resetClock();
  }
}

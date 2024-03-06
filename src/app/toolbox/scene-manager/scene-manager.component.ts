import { Component, inject, effect } from '@angular/core';
import { ColorPickerComponent } from '../common-components/color-picker/color-picker.component';
import { ThreejsService } from '../../threejs.service';
import { SceneInterface } from '../../interfaces/scene-interface';

@Component({
  selector: 'app-scene-manager',
  standalone: true,
  imports: [
    ColorPickerComponent
  ],
  templateUrl: './scene-manager.component.html',
  styleUrl: './scene-manager.component.scss'
})
export class SceneManagerComponent {

  threejsService: ThreejsService = inject(ThreejsService);

  scene: SceneInterface | undefined;

  red = 0;
  green = 0;
  blue = 0;

  constructor() {
    effect(
      () => {
        this.scene  = this.threejsService.sceneItemValues();
        
        this.red = this.scene.bgRedColor;
        this.green = this.scene.bgGreenColor;
        this.blue = this.scene.bgBlueColor;
      }
    );
  }

  redColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.bgRedColor = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }

  greenColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.bgGreenColor = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }

  blueColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.bgBlueColor = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }
}

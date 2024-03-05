import { Component, signal } from '@angular/core';
import { ColorPickerComponent } from '../common-components/color-picker/color-picker.component';

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

  color = '010,100,100';

  colorChange(newColor: string): void
  {
    if (newColor.length === 11)
    {
      console.log('Update The Color...', newColor);
    }
  }
}

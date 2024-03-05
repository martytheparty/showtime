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



}

import { Component, input, output } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-color-picker',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSliderModule,
        CommonModule
    ],
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent {


  redValue = input.required<number>();
  greenValue = input.required<number>();
  blueValue = input.required<number>();

 redUpdate = output<number>();
 greenUpdate = output<number>();
 blueUpdate = output<number>();


  updateColor(event: Event, color: 'red' | 'green' | 'blue')
  {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);

    if (color === 'red')
    {
      this.redUpdate.emit(value);
    } else if(color === 'green') {
      this.greenUpdate.emit(value);
    } else if(color === 'blue') {
      this.blueUpdate.emit(value);
    }
  }
}

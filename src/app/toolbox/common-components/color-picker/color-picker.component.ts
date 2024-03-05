import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatSliderDragEvent, MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-picker',
  standalone: true,
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


  updateColor(event: Event, color: string)
  {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);

  }
}

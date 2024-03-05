import { Component, EventEmitter, Output, effect, input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
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

  color = input.required<string>(); // 'nnn,nnn,nnn' 
  @Output() colorUpdate: EventEmitter<string> = new EventEmitter();


  redString: string = '000';
  greenString: string = '000';
  blueString: string = '000';
  redValue: number = 0;
  greenValue: number = 0;
  blueValue: number = 0;

  constructor() {
    effect(
      () => {
        const colors: string[] = this.color().split(',');

        this.redValue = parseInt(colors[0]);
        this.redString = this.getZeroFilled(this.redValue);

        this.greenValue = parseInt(colors[1]);
        this.greenString = this.getZeroFilled(this.greenValue);

        this.blueValue = parseInt(colors[2]);
        this.blueString = this.getZeroFilled(this.blueValue);
      }
    );
  }


  updateColor(event: Event, color: string)
  {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    let zeroFilled =  value.toString();
    if (value)
    {
      if (zeroFilled.length === 2) {
        zeroFilled = '0' + zeroFilled;
      } else if (zeroFilled.length === 1) {
        zeroFilled = '00' + zeroFilled;
      }
    }

    if (color === 'red') {
      this.redValue = value;
      this.redString = zeroFilled;
    } else if (color === 'green') {
      this.greenValue = value;
      this.greenString = zeroFilled;
    } else if (color === 'blue') {
      this.blueValue = value;
      this.blueString = zeroFilled;
    }

    this.colorUpdate.emit(`${this.redString},${this.greenString},${this.blueString}`);
  }

  getZeroFilled(value: number): string {
    let zeroFilled =  value.toString();

    if (zeroFilled.length === 2) {
      zeroFilled = '0' + zeroFilled;
    } else if (zeroFilled.length === 1) {
      zeroFilled = '00' + zeroFilled;
    }

    return zeroFilled;
  }
}

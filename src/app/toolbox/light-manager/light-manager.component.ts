import { Component, OnDestroy, effect, inject } from '@angular/core';
import { ThreejsService } from '../../threejs.service';
import { LightInterface } from '../../interfaces/light-interface';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableFilterComponent } from '../common-components/table-filter/table-filter.component';
import { ColorPickerComponent } from '../common-components/color-picker/color-picker.component';

@Component({
  selector: 'app-light-manager',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    ReactiveFormsModule,
    TableFilterComponent,
    MatSliderModule,
    ColorPickerComponent
  ],
  templateUrl: './light-manager.component.html',
  styleUrl: './light-manager.component.scss'
})

export class LightManagerComponent implements OnDestroy {
  threejsService: ThreejsService = inject(ThreejsService);

  lightsList: LightInterface[] = [];
  filteredLightsList: LightInterface[] = [];

  filterValue: string = '';

  subs: Subscription[] = [];

  displayedColumns: string[] = ['id', "name","xPos", "yPos", "zPos", "expand"];
  edit = false;
  expandedLightId = 0;

  constructor(){
    effect(
      () => {
        this.lightsList = this.threejsService.lightListValues();
        if(this.filterValue === '') {
          this.filteredLightsList = this.lightsList;
        } else  {
          this.filteredLightsList = this.lightsList.filter(
            (light: LightInterface) => {
              return light.name?.toLocaleLowerCase().includes(this.filterValue.toLocaleLowerCase());
            }
          );
        }
      }
    ); 
  }

  addLight(): void
  {
    const lightItem: LightInterface = {
      id: -1,
      xPos: 0,
      yPos: 0,
      zPos: 0,
      intensity: 1,
      redColor: 255,
      greenColor: 255,
      blueColor: 255
    };

    this.threejsService.addLight(lightItem);

    lightItem.form = new FormGroup(
      {
        id: new FormControl(lightItem.id),
        name: new FormControl(''),
        xPos: new FormControl(lightItem.xPos),
        yPos: new FormControl(lightItem.yPos),
        zPos: new FormControl(lightItem.zPos),
        intensity: new FormControl(lightItem.intensity)
      }
    );

    lightItem.form.valueChanges.subscribe(
      () => {
        lightItem.name = lightItem.form?.value.name;
        lightItem.intensity = lightItem.form?.value.intensity;

        if (lightItem.form?.value.xPos || lightItem.form?.value.xPos === 0) {
          const xPosition = parseFloat(lightItem.form.value.xPos);
          if (!isNaN(xPosition))
          {
            lightItem.xPos = xPosition;
          }
        }

        if (lightItem.form?.value.yPos || lightItem.form?.value.yPos === 0) {
          const yPosition = parseFloat(lightItem.form.value.yPos);
          if (!isNaN(yPosition))
          {
            lightItem.yPos = yPosition;
          }
        }

        if (lightItem.form?.value.zPos || lightItem.form?.value.zPos === 0) {
          const zPosition = parseFloat(lightItem.form.value.zPos);
          if (!isNaN(zPosition))
          {
            lightItem.zPos = zPosition;
          }
        }

        // this is updated very often by the slider... this may need to be debounced
        // if there are performance issues.
        lightItem.intensity = lightItem.form?.value.intensity;
        lightItem.name = lightItem.form?.value.name;

        this.threejsService.updateLight(lightItem);
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(
      (sub) => sub.unsubscribe()
    );
  }

  toggleEdit(): void
  {
    this.edit = !this.edit;
  }

  updateFilter(event: string): void
  {
    this.filterValue = event;

    this.filteredLightsList = this.lightsList.filter(
      (light: LightInterface) => {
        return light.name?.toLocaleLowerCase().includes(this.filterValue.toLocaleLowerCase());
      }
    );
  }

  deleteLight(lightItem: LightInterface): void
  {
    this.threejsService.deleteLight(lightItem);
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  redUpdate(event: number, lightItem: LightInterface): void
  {
    lightItem.redColor = event;
    this.threejsService.updateLight(lightItem);
  }

  greenUpdate(event: number, lightItem: LightInterface): void
  {
    lightItem.greenColor = event;
    this.threejsService.updateLight(lightItem);
  }

  blueUpdate(event: number, lightItem: LightInterface): void
  {
    lightItem.blueColor = event;
    this.threejsService.updateLight(lightItem);
  }
}

import { Component, OnDestroy, effect, inject } from '@angular/core';
import { ThreejsService } from '../../services/threejs.service';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

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
    ColorPickerComponent,
    MatCheckboxModule,
    MatSelectModule
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
        this.updateForms();

        if(this.filterValue === '') {
          this.filteredLightsList = this.lightsList;
        } else  {
          this.filteredLightsList = this.lightsList.filter(
            (light: LightInterface) => {
              return light.name?.toLocaleLowerCase().includes(this.filterValue.toLocaleLowerCase());
            }
          );
        }

        // determine if the row should be openned due to id change
        this.lightsList.forEach( (lightItem: LightInterface) => 
          {
            if (this.expandedLightId === lightItem.previousId) {
              this.expandedLightId = lightItem.id;
            }
          }
          );
      }
    ); 
  }

  addLight(): void
  {
    const lightItem: LightInterface = {
      id: -1,
      name: '',
      lightType: 'PointLight',
      xPos: {startValue: 0, endValue: 0, animated: true},
      yPos: {startValue: 0, endValue: 0, animated: true},
      zPos: {startValue: 0, endValue: 0, animated: true},
      intensity: {startValue: 1, endValue: 0, animated: true},
      castShadow: true,
      redColor: 255,
      greenColor: 255,
      blueColor: 255,
      animated: false,
      type: 'light',
      previousId: -1,
      angle: 1,
      penumbra: 0,
      decay: 1,
      target: {
        xPos: 0,
        yPos: 0,
        zPos: 0,
        addedToScene: false
      }
    };

    this.threejsService.addLight(lightItem);

    lightItem.form = new FormGroup(
      {
        id: new FormControl(lightItem.id),
        name: new FormControl(''),
        lightType: new FormControl(lightItem.lightType),
        xPos: new FormControl(lightItem.xPos.startValue),
        yPos: new FormControl(lightItem.yPos.startValue),
        zPos: new FormControl(lightItem.zPos.startValue),
        intensity: new FormControl(lightItem.intensity.startValue),
        castShadow: new FormControl(lightItem.castShadow),
        animated: new FormControl(lightItem.animated),
        angle: new FormControl(lightItem.angle),
        penumbra: new FormControl(lightItem.penumbra),
        decay: new FormControl(lightItem.decay),
        targetXPos: new FormControl(lightItem.target.xPos)
      }
    );

    lightItem.form.valueChanges.subscribe(
      () => {
        lightItem.name = lightItem.form?.value.name;
        lightItem.lightType = lightItem.form?.value.lightType;

        if (lightItem.form?.value.angle || lightItem.form?.value.angle === 0) {
          const angle = parseFloat(lightItem.form.value.angle);
          if (!isNaN(angle))
          {
            lightItem.angle = lightItem.form?.value.angle;
          }
        }

        if (lightItem.form?.value.penumbra || lightItem.form?.value.penumbra === 0) {
          const penumbra = parseFloat(lightItem.form.value.penumbra);
          if (!isNaN(penumbra))
          {
            lightItem.penumbra = lightItem.form?.value.penumbra;
          }
        }

        if (lightItem.form?.value.decay || lightItem.form?.value.decay === 0) {
          const decay = parseFloat(lightItem.form.value.decay);
          if (!isNaN(decay))
          {
            lightItem.decay = lightItem.form?.value.decay;
          }
        }

        if (lightItem.form?.value.targetXPos || lightItem.form?.value.targetXPos === 0) {
          const targetXPos = parseFloat(lightItem.form.value.targetXPos);
          if (!isNaN(targetXPos))
          {
            lightItem.target.xPos = lightItem.form?.value.targetXPos * 1;
          }
        }

        if (lightItem.form?.value.intensity || lightItem.form?.value.intensity === 0) {
          const intensity = parseFloat(lightItem.form.value.intensity);
          if (!isNaN(intensity))
          {
            lightItem.intensity.startValue = intensity;
          }
        }

        if (lightItem.form?.value.xPos || lightItem.form?.value.xPos === 0) {
          const xPosition = parseFloat(lightItem.form.value.xPos);
          if (!isNaN(xPosition))
          {
            lightItem.xPos.startValue = xPosition;
          }
        }

        if (lightItem.form?.value.yPos || lightItem.form?.value.yPos === 0) {
          const yPosition = parseFloat(lightItem.form.value.yPos);
          if (!isNaN(yPosition))
          {
            lightItem.yPos.startValue = yPosition;
          }
        }

        if (lightItem.form?.value.zPos || lightItem.form?.value.zPos === 0) {
          const zPosition = parseFloat(lightItem.form.value.zPos);
          if (!isNaN(zPosition))
          {
            lightItem.zPos.startValue = zPosition;
          }
        }

        lightItem.name = lightItem.form?.value.name;
        lightItem.castShadow = lightItem.form?.value.castShadow;
        lightItem.animated = lightItem.form?.value.animated;
        this.threejsService.updateLight(lightItem);
      }
    );
  }

  updateForms(): void
  {
    this.lightsList.forEach(
      (lightItem: LightInterface) => {
        if (lightItem.form) {
          lightItem.form.patchValue(
            {
              id: lightItem.id,
              name: lightItem.name,
              xPos: lightItem.xPos.startValue,
              yPos: lightItem.yPos.startValue,
              zPos: lightItem.zPos.startValue,
              redColor: lightItem.redColor,
              greenColor: lightItem.greenColor,
              blueColor: lightItem.blueColor,
              castShadow: lightItem.castShadow,
              animated: lightItem.animated,
              intensity: lightItem.intensity.startValue,
              angle: lightItem.angle,
              penumbra: lightItem.penumbra,
              decay: lightItem.decay,
              targetXPos: lightItem.target.xPos
            }, { emitEvent: false}
          )
        } else {
          console.log('forms and subs need to be refactored off of the light item for export/import reasons');
        }
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

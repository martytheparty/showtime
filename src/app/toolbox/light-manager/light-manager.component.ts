import { Component, OnDestroy, effect, inject } from '@angular/core';
import { ThreejsService } from '../../services/threejs.service';
import { LightInterface, LightTypes } from '../../interfaces/light-interface';
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
import { FormLuInterface } from '../../interfaces/common';

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

  formDataDict: FormLuInterface = {};

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
      stId: -1,
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

    const form = new FormGroup(
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
        targetXPos: new FormControl(lightItem.target.xPos),
        targetYPos: new FormControl(lightItem.target.yPos),
        targetZPos: new FormControl(lightItem.target.zPos)
      }
    );

    const sub: Subscription  = form.valueChanges.subscribe(
      () => {
        lightItem.name = form.value.name as string;
        lightItem.lightType = form.value.lightType as LightTypes;

        if (form?.value.angle || form?.value.angle === 0) {
          const strAngle = form.value.angle as unknown as string;
          const angle = parseFloat(strAngle);
          if (!isNaN(angle))
          {
            lightItem.angle = angle;
          }
        }

        if (form?.value.penumbra || form?.value.penumbra === 0) {
          const strPenumbra = form.value.penumbra as unknown as string;
          const penumbra = parseFloat(strPenumbra);
          if (!isNaN(penumbra))
          {
            lightItem.penumbra = penumbra;
          }
        }

        if (form?.value.decay || form?.value.decay === 0) {
          const strDecay = form.value.decay as unknown as string;
          const decay = parseFloat(strDecay);
          if (!isNaN(decay))
          {
            lightItem.decay = form?.value.decay;
          }
        }

        if (form?.value.targetXPos || form?.value.targetXPos === 0) {
          const strtargetXPos = form.value.targetXPos as unknown as string;
          const targetXPos = parseFloat(strtargetXPos);
          if (!isNaN(targetXPos))
          {
            lightItem.target.xPos = targetXPos;
          }
        }

        if (form?.value.targetYPos || form?.value.targetYPos === 0) {
          const strTargetYPos = form.value.targetYPos as unknown as string;
          const targetYPos = parseFloat(strTargetYPos);
          if (!isNaN(targetYPos))
          {
            lightItem.target.yPos = targetYPos;
          }
        }

        if (form?.value.targetZPos || form?.value.targetZPos === 0) {
          const strTargetZPos = form.value.targetZPos as unknown as string;
          const targetZPos = parseFloat(strTargetZPos);
          if (!isNaN(targetZPos))
          {
            lightItem.target.zPos = targetZPos;
          }
        }

        if (form?.value.intensity || form?.value.intensity === 0) {
          const strIntensity = form?.value.intensity as unknown as string;
          const intensity = parseFloat(strIntensity);
          if (!isNaN(intensity))
          {
            lightItem.intensity.startValue = intensity;
          }
        }

        if (form?.value.xPos || form?.value.xPos === 0) {
          const strXPos = form.value.xPos as unknown as string;
          const xPosition = parseFloat(strXPos);
          if (!isNaN(xPosition))
          {
            lightItem.xPos.startValue = xPosition;
          }
        }

        if (form?.value.yPos || form?.value.yPos === 0) {
          const strYPos = form.value.yPos as unknown as string;
          const yPosition = parseFloat(strYPos);
          if (!isNaN(yPosition))
          {
            lightItem.yPos.startValue = yPosition;
          }
        }

        if (form?.value.zPos || form?.value.zPos === 0) {
          const strZPos = form.value.zPos as unknown as string;
          const zPosition = parseFloat(strZPos);
          if (!isNaN(zPosition))
          {
            lightItem.zPos.startValue = zPosition;
          }
        }

        lightItem.castShadow = form?.value.castShadow as boolean;
        lightItem.animated = form?.value.animated as boolean;
        this.threejsService.updateLight(lightItem);
      }
    );

    this.formDataDict[lightItem.stId] = {
      form, 
      sub
    };
  }

  updateForms(): void
  {
    this.lightsList.forEach(
      (lightItem: LightInterface) => {
        const form = this.formDataDict[lightItem.stId].form;
        if (form) {
          form.patchValue(
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
              targetXPos: lightItem.target.xPos,
              targetYPos: lightItem.target.yPos,
              targetZPos: lightItem.target.zPos
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

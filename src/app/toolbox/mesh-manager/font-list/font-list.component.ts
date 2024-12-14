import { Component, inject, effect, input, output } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FontInterface, FontName } from '../../../interfaces/three/mesh-interface';
import { MatIconModule } from '@angular/material/icon';
import { ThreejsService } from '../../../services/threejs.service';

@Component({
    selector: 'app-font-list',
    imports: [
        MatSelectModule,
        MatIconModule
    ],
    templateUrl: './font-list.component.html',
    styleUrl: './font-list.component.scss'
})
export class FontListComponent {

  font = input.required<FontName>();
  newFont = output<FontName>();

  threeJsService: ThreejsService = inject(ThreejsService);

  fonts: FontName[] = [];

  constructor() {
    effect( () => {
      if (this.threeJsService.fontListValues().length > 0) {
        this.fonts = this.threeJsService
                            .fontListValues()
                              .map((font: FontInterface) =>  font.name);
      }
    } );
  }

  changeFont(event: MatSelectChange){
    this.newFont.emit(event.value);
  }

}

import { Component, inject, effect } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FontInterface, FontName } from '../../../interfaces/mesh-interface';
import { MatIconModule } from '@angular/material/icon';
import { ThreejsService } from '../../../services/threejs.service';

@Component({
  selector: 'app-font-list',
  standalone: true,
  imports: [ 
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './font-list.component.html',
  styleUrl: './font-list.component.scss'
})
export class FontListComponent {

  threeJsService: ThreejsService = inject(ThreejsService);

  fonts: FontName[] = [];

  constructor() {
    effect( () => {
      if (this.threeJsService.fontListValues().length > 0) {
        this.fonts = this.threeJsService
                            .fontListValues()
                              .map((font: FontInterface) =>  font.name);
        console.log(this.threeJsService.fontListValues());
      }
    } );
  }

}

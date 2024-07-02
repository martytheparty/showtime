import { Component, inject, effect, input } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
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

  font = input.required<string>();

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
    
    console.log('hrllo',event);
  }

}

import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FontName } from '../../../interfaces/mesh-interface';
import { MatIconModule } from '@angular/material/icon';

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

  fonts: FontName[] = [];

}

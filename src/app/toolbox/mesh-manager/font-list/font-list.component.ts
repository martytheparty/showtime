import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-font-list',
  standalone: true,
  imports: [ 
    MatSelectModule
  ],
  templateUrl: './font-list.component.html',
  styleUrl: './font-list.component.scss'
})
export class FontListComponent {

}

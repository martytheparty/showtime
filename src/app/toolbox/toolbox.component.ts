import { AfterViewInit, Component, inject } from '@angular/core';
import { ThreejsService } from '../threejs.service';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.scss'
})
export class ToolboxComponent implements AfterViewInit {
  threejsService: ThreejsService = inject(ThreejsService);
  
  ngAfterViewInit(): void {
    this.threejsService.setupCamera();
    this.threejsService.addMesh();
  }

}

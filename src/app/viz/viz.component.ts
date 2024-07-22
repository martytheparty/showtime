import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ThreejsService } from '../services/threejs.service';



@Component({
  selector: 'app-viz',
  standalone: true,
  imports: [],
  templateUrl: './viz.component.html',
  styleUrl: './viz.component.scss'
})
export class VizComponent implements AfterViewInit {

  threejsService: ThreejsService = inject(ThreejsService);
  @ViewChild('viz') viz!: ElementRef;

  ngAfterViewInit(): void {
    const vizDiv: HTMLDivElement = this.viz.nativeElement;
    this.threejsService.setDims(vizDiv);
    this.threejsService.setupRenderer();
    this.threejsService.attachDom(vizDiv);
    this.threejsService.markAsInitialized();
  }

}

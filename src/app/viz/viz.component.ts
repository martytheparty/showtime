import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ThreejsService } from '../services/threejs.service';



@Component({
    selector: 'app-viz',
    imports: [],
    templateUrl: './viz.component.html',
    styleUrl: './viz.component.scss'
})
export class VizComponent implements AfterViewChecked {
  threejsService: ThreejsService = inject(ThreejsService);
  @ViewChild('viz') viz!: ElementRef;
  initialized = false;

  ngAfterViewChecked(): void {
    const vizDiv: HTMLDivElement = this.viz.nativeElement;
    if (!this.initialized && vizDiv.clientHeight > 0) {
      this.threejsService.setDims(vizDiv);
      this.threejsService.setupRenderer();
      this.threejsService.attachDom(vizDiv);
      this.threejsService.markAsInitialized();
      this.initialized = true;
    }
  }

}

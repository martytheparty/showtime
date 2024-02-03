import { Component, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreejsService } from './threejs.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  threejsService: ThreejsService = inject(ThreejsService);
  @ViewChild('viz') viz!: ElementRef;

  constructor(){}

  ngAfterViewInit(): void {
    const vizDiv: HTMLDivElement = this.viz.nativeElement;
    this.threejsService.setDims(vizDiv);
    this.threejsService.setupCamera();
    this.threejsService.addMesh();
    this.threejsService.setupRenderer();
    this.threejsService.attachDom(vizDiv);
  }
}

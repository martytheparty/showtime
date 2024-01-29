import { Component, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreejsService } from './threejs.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: Window, useValue: window }
]
})
export class AppComponent implements AfterViewInit {
  threejsService: ThreejsService = inject(ThreejsService);

  constructor(private window: Window){}

  ngAfterViewInit(): void {
    this.threejsService.runThreeJs(window);
  }
}

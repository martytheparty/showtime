import { Component, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreejsService } from './services/threejs.service';
import { VizComponent } from './viz/viz.component';
import { ToolboxComponent } from './toolbox/toolbox.component';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, VizComponent, ToolboxComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent  {}

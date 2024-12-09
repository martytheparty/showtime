import { Component } from '@angular/core';
import { VizComponent } from './viz/viz.component';
import { ToolboxComponent } from './toolbox/toolbox.component';


@Component({
    selector: 'app-root',
    imports: [VizComponent, ToolboxComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent  {}

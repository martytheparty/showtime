import { Component, OnDestroy, effect, inject } from '@angular/core';
import { ThreejsService } from '../../threejs.service';
import { LightInterface } from '../../interfaces/light-interface';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-light-manager',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './light-manager.component.html',
  styleUrl: './light-manager.component.scss'
})

export class LightManagerComponent implements OnDestroy {
  threejsService: ThreejsService = inject(ThreejsService);

  lightsList: LightInterface[] = [];
  subs: Subscription[] = [];

  displayedColumns: string[] = ['id', "xPos", "yPos", "zPos", "intensity"];

  constructor(){
    effect(
      () => {
        this.lightsList = this.threejsService.lightListValues();
      }
    ); 
  }

  addLight(): void
  {
    const lightItem: LightInterface = {
      id: -1,
      xPos: 0,
      yPos: 0,
      zPos: 0,
      intensity: 1
    };

    this.threejsService.addLight(lightItem);
  }

  ngOnDestroy(): void {
    this.subs.forEach(
      (sub) => sub.unsubscribe()
    );
  }
}

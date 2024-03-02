import { Component, OnDestroy, effect, inject } from '@angular/core';
import { ThreejsService } from '../../threejs.service';
import { LightInterface } from '../../interfaces/light-interface';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-light-manager',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './light-manager.component.html',
  styleUrl: './light-manager.component.scss'
})
export class LightManagerComponent implements OnDestroy {
  threejsService: ThreejsService = inject(ThreejsService);

  lightsList: LightInterface[] = [];
  subs: Subscription[] = [];

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
      zPos: 0
    };

    this.threejsService.addLight(lightItem);
  }

  ngOnDestroy(): void {
    this.subs.forEach(
      (sub) => sub.unsubscribe()
    );
  }
}

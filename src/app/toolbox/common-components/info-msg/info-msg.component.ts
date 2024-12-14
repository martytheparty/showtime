import { Component, Inject, inject } from '@angular/core';
import { ValidationTokenTypes } from '../../../interfaces/showtime/validation-interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ValidationService } from '../../../services/utils/validation.service';

@Component({
    selector: 'app-info-msg',
    imports: [
        MatIconModule
    ],
    templateUrl: './info-msg.component.html',
    styleUrl: './info-msg.component.scss'
})
export class InfoMsgComponent {

  validationService: ValidationService = inject(ValidationService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { validationTokens: ValidationTokenTypes[] }) {
  }
}

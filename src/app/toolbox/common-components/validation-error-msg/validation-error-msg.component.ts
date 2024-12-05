import { Component, inject, input, effect } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ValidationTokenTypes } from '../../../interfaces/showtime/validation-interface';
import { ValidationService } from '../../../services/utils/validation.service';

@Component({
  selector: 'app-validation-error-msg',
  standalone: true,
  imports: [MatInputModule],
  templateUrl: './validation-error-msg.component.html',
  styleUrl: './validation-error-msg.component.scss'
})
export class ValidationErrorMsgComponent {
  validationService: ValidationService = inject(ValidationService);
  token = input.required<ValidationTokenTypes>();  
}

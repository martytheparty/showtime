import { Component, output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
    selector: 'app-table-filter',
    imports: [MatInputModule, MatFormFieldModule],
    templateUrl: './table-filter.component.html',
    styleUrl: './table-filter.component.scss'
})
export class TableFilterComponent {

  filterValue = output<string>();

  emitFilter(event: KeyboardEvent): void
  {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    this.filterValue.emit(target.value);
  }
}

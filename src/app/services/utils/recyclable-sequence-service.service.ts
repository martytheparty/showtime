import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecyclableSequenceService {

  private currentId = 0;
  private recycledIds: number[] = [];

  generateId(): number {
    if (this.recycledIds.length > 0) {
      return this.recycledIds.pop() as number;
    }
    return ++this.currentId;
  }

  recycleId(id: number): void {
    if (id > 0 && id <= this.currentId) {
      this.recycledIds.push(id);
    }
  }
}

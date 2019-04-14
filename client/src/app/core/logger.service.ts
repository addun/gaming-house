import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {

  constructor() {
  }

  public log(...args): void {
    console.log(...args);
  }

  public warm(...args): void {
    console.warn(...args);
  }

  public error(...args): void {
    console.error(...args);
  }

}

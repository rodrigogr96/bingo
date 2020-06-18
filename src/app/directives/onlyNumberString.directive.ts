import { Directive, ElementRef, HostListener, Injectable} from '@angular/core';

@Directive({
  selector: '[numberStringOnly]'
})

@Injectable({
  providedIn: 'root'
})

export class OnlynumberStringDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z0-9]/g, "");
    if ( initalValue !== this._el.nativeElement.value) {
      event.preventDefault()
    }
  }
}
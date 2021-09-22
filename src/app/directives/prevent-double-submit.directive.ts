import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[preventDoubleSubmit]'
})
export class PreventDoubleSubmitDirective {

  timeStampAnterior: number = 0;
  @Input() debounceTime: number = 500;

  constructor() { }

  @HostListener('click', ['$event']) clickEvent($event) {

      if ($event['detail'] === 1 && (($event['timeStamp'] - this.timeStampAnterior) >= this.debounceTime)){
        this.timeStampAnterior = $event['timeStamp'];
        return true;
      }else {
        $event.stopPropagation();
        return false;
      }
    
  }

}

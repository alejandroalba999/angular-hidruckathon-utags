import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventDoubleSubmitDirective } from './directive.index';


@NgModule({
  declarations: [
    PreventDoubleSubmitDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PreventDoubleSubmitDirective
  ]
})
export class DirectiveModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {A11yModule} from '@angular/cdk/a11y';
import {ReactiveFormsModule} from '@angular/forms';
import {ModalService} from './modal.service';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    ReactiveFormsModule,
    A11yModule
  ],
  declarations: [],
  providers: [ModalService],
  exports: [
    OverlayModule,
    A11yModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}

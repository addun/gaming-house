import { Injectable, Injector } from '@angular/core';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

export class ModalRef {

  public constructor(private readonly overlayRef: OverlayRef) {
  }

  public close() {
    this.overlayRef.dispose();
  }
}

@Injectable()
export class ModalService {

  constructor(private overlay: Overlay, private injector: Injector) {
  }

  public show<T>(component: ComponentType<T>) {
    const strategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayRef = this.overlay.create({
      positionStrategy: strategy,
      hasBackdrop: true,
    });

    const modalRef = new ModalRef(overlayRef);

    const injector = new PortalInjector(this.injector, new WeakMap([
      [ModalRef, modalRef],
    ]));

    const componentPortal = new ComponentPortal(component, null, injector);
    overlayRef.attach(componentPortal);

    return modalRef;
  }

}

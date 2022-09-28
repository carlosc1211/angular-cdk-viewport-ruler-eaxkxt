import { Component, DoCheck, NgZone, OnDestroy } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'my-app',
  template: `
    <p>Viewport size: {{ width }} x {{ height }}</p>
    <button type="button" (click)="refresh = !refresh">Toggle refresh</button>
    <p>Detection changes: {{ count }}</p>
  `
})
export class AppComponent implements DoCheck, OnDestroy {
  // A property for turning on and off the refreshing. Notice that when this is false, the counter stops.
  refresh = true;
  count = 0;
  width: number;
  height: number;
  private readonly viewportChange = this.viewportRuler
    .change(200)
    .subscribe(() => this.refresh && this.ngZone.run(() => this.setSize()));
  constructor(
    private readonly viewportRuler: ViewportRuler,
    private readonly ngZone: NgZone
  ) {
    // change happens well, on change. The first load is not a change, so we get the values here too. (You can use `startWith` operator too.)
    this.setSize();
  }
  // This is just for showing how high performance this solution is.
  ngDoCheck() {
    this.count++;
  }
  // Never forget to unsubscribe!
  ngOnDestroy() {
    this.viewportChange.unsubscribe();
  }

  private setSize() {
    const { width, height } = this.viewportRuler.getViewportSize();
    this.width = width;
    this.height = height;
  }
}

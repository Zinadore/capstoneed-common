import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ced-progress-arc',
  templateUrl: 'progress-arc.component.html'
})

export class ProgressArcComponent  implements OnInit {
  @Input() size:number = 30;
  @Input() strokeWidth:number = 2.5;
  @Input() strokeColor:string = 'black';
  @Input() backgroundColor:string = null;
  @Input() counterClockwise:boolean = false;
  @Input() progress:number = 0.0;  // meaningful range: <0.0, 1.0>

  private strokeWidthCapped: number;
  private radius: number;
  private circumference: number;
  private offset: number;

  constructor() {
    this.offset = /firefox/i.test(navigator.userAgent) ? -89.9 : -90;
  }

  ngOnInit(){
    this.updateRadius();
  }

  private transform(): string{
    let t = 'rotate('+this.offset+', '+this.size/2+', '+this.size/2+') ';
    if(this.counterClockwise)
      t += ' translate(0, ' + this.size + ') scale(1, -1)';

    return t
  }

  private updateRadius() {
    this.strokeWidthCapped = Math.min(this.strokeWidth, this.size / 2 - 1);
    this.radius = Math.max((this.size - this.strokeWidthCapped) / 2 - 1, 0);
    this.circumference = 2 * Math.PI * this.radius;
  };
}

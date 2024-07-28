
export interface Controller {
  
  onUp(listener: () => any): void;
  onDown(listener: () => any): void;
  onRight(listener: () => any): void;
  onLeft(listener: () => any): void;

  onReleaseUp(listener: () => any): void;
  onReleaseDown(listener: () => any): void;
  onReleaseRight(listener: () => any): void;
  onReleaseLeft(listener: () => any): void;
}


interface IControllerEventBus {
  onUp: (() => any)[],
  onDown: (() => any)[],
  onRight: (() => any)[],
  onLeft: (() => any)[],

  onReleaseUp: (() => any)[],
  onReleaseDown: (() => any)[],
  onReleaseRight: (() => any)[],
  onReleaseLeft: (() => any)[],
}

export class HTMLElementController implements Controller {

  private readonly controllerEventBus: IControllerEventBus = {
    onUp: [],
    onDown: [],
    onRight: [],
    onLeft: [],
    onReleaseUp: [],
    onReleaseDown: [],
    onReleaseRight: [],
    onReleaseLeft: []
  }

  constructor(
    private readonly htmlElement: HTMLElement
  ){
    this.registerEventListener();
  }

  private registerEventListener(){
    this.htmlElement.addEventListener("keydown", (e) => {
      switch(e.code){
        case "ArrowUp" : this.triggerEventBus("onUp");  break;
        case "ArrowDown" : this.triggerEventBus("onDown"); break;
        case "ArrowRight" : this.triggerEventBus("onRight");  break;
        case "ArrowLeft" : this.triggerEventBus("onLeft");  break;
      }
    })

    this.htmlElement.addEventListener("keyup", (e) => {
      switch(e.code){
        case "ArrowUp" : this.triggerEventBus("onReleaseUp");  break;
        case "ArrowDown" : this.triggerEventBus("onReleaseDown");  break;
        case "ArrowRight" : this.triggerEventBus("onReleaseRight");  break;
        case "ArrowLeft" : this.triggerEventBus("onReleaseLeft");  break;
      }
    })
  }

  private triggerEventBus (key: keyof IControllerEventBus){
    this.controllerEventBus[key].forEach(fn => fn());
  }

  private addEventListener(cb: () => any, key: keyof IControllerEventBus){
    this.controllerEventBus[key].push(cb);
  }

  onUp(listener: () => any): void {
    this.addEventListener(listener, "onUp")
  }
  onDown(listener: () => any): void {
    this.addEventListener(listener, "onDown")
  }
  onRight(listener: () => any): void {
    this.addEventListener(listener, "onRight")
  }
  onLeft(listener: () => any): void {
    this.addEventListener(listener, "onLeft")
  }
  onReleaseUp(listener: () => any): void {
    this.addEventListener(listener, "onReleaseUp")
  }
  onReleaseDown(listener: () => any): void {
    this.addEventListener(listener, "onReleaseDown")
  }
  onReleaseRight(listener: () => any): void {
    this.addEventListener(listener, "onReleaseRight")
  }
  onReleaseLeft(listener: () => any): void {
    this.addEventListener(listener, "onReleaseLeft")
  }


}
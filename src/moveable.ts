

interface Direction {
  up: boolean,
  down: boolean,
  right: boolean,
  left: boolean
}

export interface Moveable {
  direction : Direction;
  move(...args: any[]): any;
}
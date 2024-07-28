





export class NumberUtils {
  static round(num: number, precision: number){
    const factor = 10**precision;
    return Math.round(num * factor) / factor;
  }
}






export class NumberUtils {
  static round(num: number, precision: number = 2){
    const factor = 10**precision;
    return Math.round(num * factor) / factor;
  }

  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
}
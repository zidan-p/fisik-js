import { Vector } from "./vector";






export class Matrix<TRow extends number = number, TCol extends number = number> {

  private _rows: TRow;
  private _cols: TCol;

  private _data: number[][];

  constructor(data: number[][]);
  constructor(rows: TRow, cols: TCol);
  constructor(firstArgs: number | number[][], secondArgs?: number){

    // check if it's an array
    if(Array.isArray(firstArgs) && firstArgs?.length){
      if(!Array.isArray(firstArgs[0])) throw new Error ("invalid matrix value : " + JSON.stringify(firstArgs));

      this._data = firstArgs;
      this._rows = firstArgs.length as TRow;
      this._cols = firstArgs[0].length as TCol;
      return;
    }

    if(!secondArgs) throw new Error("Please include the _cols value");

    this._rows = firstArgs as number as TRow;
    this._cols = secondArgs as number as TCol;
    this._data = Matrix.emptyDataMatrix(this._rows, this._cols);
  }

  static emptyDataMatrix(rows: number, cols: number) {
    const data: number[][] = [];
    for (let index = 0; index < rows; index++) {
      data[index] = [];
      for (let j = 0; j < cols; j++) data[index][j] = 0
    }
    return data;
  }

  public get rows(){return this._rows}
  // public set rows(r: number){}

  public get cols(){return this._cols}

  public get data(){return this._data}
  public set data(d: number[][]){
    if(d.length < this._rows) 
      throw new Error("Invalid new data value rows : " + d.length + ", it should be  : " + this._rows );
    if(d[0]?.length < this._cols) 
      throw new Error("Invalid new data value cols : " + d[0]?.length + ", it should be  : " + this._cols );

    this._data = d;
  }


  static rotationMatrix(angle: number){
    const mat = new Matrix(2,2);
    mat.data[0][0] = Math.cos(angle);
    mat.data[0][1] = -Math.sin(angle);
    mat.data[1][0] = Math.sin(angle);
    mat.data[1][1] = Math.cos(angle);
    return mat;
  }

  rotationMatrix(angle: number){
    this.data[0][0] = Math.cos(angle);
    this.data[0][1] = -Math.sin(angle);
    this.data[1][0] = Math.sin(angle);
    this.data[1][1] = Math.cos(angle);
  }

  static multVector(mat: Matrix ,vec: Vector){
    let result = new Vector(0,0);
    result.x = mat.data[0][0]*vec.x + mat.data[0][1]*vec.y;
    result.y = mat.data[1][0]*vec.x + mat.data[1][1]*vec.y;
    return result;
  }

}


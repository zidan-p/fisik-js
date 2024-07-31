





export class Matrix<T extends number = number, R extends number = number> {

  private _rows: T;
  private _cols: R;

  private _data: number[][];

  constructor(data: number[][]);
  constructor(rows: T, cols: R);
  constructor(firstArgs: number | number[][], secondArgs?: number){

    // check if it's an array
    if(Array.isArray(firstArgs) && firstArgs?.length){
      if(!Array.isArray(firstArgs[0])) throw new Error ("invalid matrix value : " + JSON.stringify(firstArgs));

      this._data = firstArgs;
      this._rows = firstArgs.length as T;
      this._cols = firstArgs[0].length as R;
      return;
    }

    if(!secondArgs) throw new Error("Please include the _cols value");

    this._rows = firstArgs as number as T;
    this._cols = secondArgs as number as R;
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

}


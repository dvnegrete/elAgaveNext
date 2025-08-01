import csvParser from "csv-parser";
import { createReadStream } from "node:fs";

export const chargeCSV = (csvFilePath: Buffer) => {
    return new Promise((resolve, reject) => {
    //   const result = [];
      createReadStream(csvFilePath)
        .pipe(csvParser())
        .on("data", async (row) => {
          console.log(row)
        })
        .on("end", () => {
          console.log("Archivo CSV procesado con éxito");
          resolve("result");
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };
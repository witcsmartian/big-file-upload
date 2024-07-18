// eslint-disable-next-line no-undef
import SparkMD5 from 'spark-md5'

export const creatChunk = (file, i, chunkSize) => {
  return new Promise((resolve) => {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const blob = file.slice(start, end);

    // eslint-disable-next-line no-undef
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      spark.append(e?.target?.result);

      resolve({
        start,
        end,
        index: i,
        hash: spark.end(),
        blob,
      });
    };

    fileReader.readAsArrayBuffer(blob);
  });
};

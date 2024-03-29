import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { join } from 'path';
import { Options } from 'csv-parse';

export const csvReaderStream = (
  filepath: string,
  options?: {
    onData?: (...args: any[]) => void | {};
    onError?: (err: any) => void | {};
    onFinish?: () => void | {};
  }
) => {
  try {
    const { onData, onError, onFinish } = options || {};
    const path = join(__dirname, '../../..', filepath);

    createReadStream(path)
      .pipe(parse({ delimiter: ',', encoding: 'utf8' }))
      .on('data', (...args: any[]) => onData?.(...args))
      .on('end', () => onFinish?.())
      .on('error', (err) => onError?.(err));
  } catch (err) {
    throw err;
  }
};

type CSVDataRecords<T> = {
  type: 'records';
  data: T[];
};
type CSVDataArray = {
  type: 'array';
  data: string[][];
};
export const csvReaderAsync = async <T extends Object>(
  filepath: string,
  toRecords: boolean = true,
  options?: Options
): Promise<CSVDataRecords<T> | CSVDataArray> => {
  const path = join(__dirname, '../../..', filepath);

  const records: string[][] = [];
  const parser = createReadStream(path).pipe(
    parse({
      delimiter: ',',
      encoding: 'utf8',
      ...(options || {}),
    })
  );
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  if (toRecords) {
    return {
      type: 'records',
      data: arr2Records<T>(records),
    };
  }
  return {
    type: 'array',
    data: records,
  };
};

const arr2Records = <T extends Object>(arr: string[][]): T[] => {
  const [keys, ...data] = arr;
  return data.map((dataItem) => {
    const res: T = {} as T;
    keys.forEach((key, index) => {
      res[key] = dataItem[index];
    });
    return res;
  });
};

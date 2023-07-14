import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';

import { parse } from 'csv-parse';
import { Observable, throwError } from 'rxjs';

import { Record } from '@models/index';

@Injectable()
export class FileService {
  /**
   * Read file from source and stream its content
   * @param  info               file info
   * @return      [description]
   */
  read(info: any): Observable<Record> {
    return !!process.env.NAME
      ? this.readFromS3Bucket(info)
      : this.readLocalFile(info);
  }

  /**
   * Read from local
   * @param  info               file info
   * @return      Observable<Record>
   */
  private readLocalFile(info: any): Observable<Record> {
    const { path = 'resources/players_20.csv' } = info;

    const stream = createReadStream(path).pipe(parse({ columns: true }));

    return new Observable<Record>((subscriber) => {
      (async () => {
        for await (const record of stream) {
          subscriber.next(record);
        }

        subscriber.complete();
      })();
    });
  }

  private readFromS3Bucket(info: any): Observable<Record> {
    return throwError('Not implemented yet');
  }
}

import {CacheItem} from './CacheItem';
import * as crypto from 'crypto';

export class Cache {

  private _cache: { [key: string]: CacheItem } = {};

  public set(key: string, data: any, expiration?: number | Date): void {
    let cacheItem: CacheItem = null;
    key = crypto.createHash('md5').update(key).digest('hex');

    if (!expiration) {
      cacheItem = new CacheItem(data);
    } else if (typeof expiration === 'number') {
      let now: Date = new Date();
      now.setSeconds(now.getSeconds() + expiration);
      cacheItem = new CacheItem(data, now);
    } else if (expiration instanceof Date) {
      cacheItem = new CacheItem(data, expiration);
    } else {
      throw 'Invalid expiration type';
    }

    this._cache[key] = cacheItem;
  }

  public get<T>(key: string): T {
    key = crypto.createHash('md5').update(key).digest('hex');
    let cacheItem: CacheItem = this._cache[key];

    if (!cacheItem) {
      return null;
    }

    if (!cacheItem.expiredOn) {
      return cacheItem.data;
    }

    let now: Date = new Date();

    if (now > cacheItem.expiredOn) {
      this._cache[key] = null;
      return null;
    } else {
      return cacheItem.data;
    }
  }
}

import { expect } from 'chai';

import { Cache } from './../../src/core/utils/Cache';

describe('sp-request: Cache', () => {
  const cache: Cache = new Cache();

  it('should return item from cache without expiration', () => {
    const key = 'cache key';
    const value: any = { data: 'some data' };

    cache.set(key, value);

    const data: any = cache.get(key);

    expect(data).to.equal(value);
  });

  it('should return null for non-existing item', () => {
    const data: any = cache.get('some key');

    expect(data).to.be.undefined;
  });

  it('should clear the cache', () => {
    const key = 'key';
    cache.set(key, 'value');
    cache.clear();

    expect(cache.get(key)).to.be.undefined;
  });

  it('should return item from cache with expiration in sec', () => {
    const key = 'cache key';
    const value: any = { data: 'some data' };

    cache.set(key, value, 1000);

    const data: any = cache.get(key);

    expect(data).to.equal(value);
  });

  it('should return null when item expired', () => {
    const key = 'cache key';
    const value: any = { data: 'some data' };

    cache.set(key, value, -1);

    const data: any = cache.get(key);
    expect(data).to.be.undefined;
  });

  it('should return item from cache with expiration on date', () => {
    const key = 'cache key';
    const value: any = { data: 'some data' };
    const now: Date = new Date();
    now.setSeconds(now.getSeconds() + 10);
    cache.set(key, value, now);

    const data: any = cache.get(key);

    expect(data).to.equal(value);
  });

  it('should return null when item expired on date', () => {
    const key = 'cache key';
    const value: any = { data: 'some data' };
    const now: Date = new Date();
    now.setSeconds(now.getSeconds() - 1);
    cache.set(key, value, now);

    const data: any = cache.get(key);
    expect(data).to.be.undefined;
  });

  it('should remove value from cache', () => {
    const key = 'cache key';
    const value: any = { data: 'some data' };
    cache.set(key, value);
    let data: any = cache.get(key);
    expect(data).to.equal(value);

    cache.remove(key);
    data = cache.get(key);

    expect(data).is.undefined;
  });
});

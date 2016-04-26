import {Foo} from './../src/Foo';
import {Bar} from './../src/core/Bar';
import {expect} from 'chai';

describe('default spec', () => {
  it('should write a message', () => {
    let foo: Foo = new Foo('hello');
    expect(foo.getName()).to.equals('hello');
  });

  it('should write a message2', () => {
    let foo: Foo = new Bar('hello');
    expect(foo.getName()).to.equals('hello');
  });

  it('should write a message3', () => {
    let foo: Foo = new Bar('hello');
    expect(foo.getName()).to.equals('hello');
  });
});

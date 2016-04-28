import {expect} from 'chai';
import * as sprequest from './../src/core/SPRequest';
import {IUserCredentials} from './../src/core/interfaces/IUserCredentials';
import {ISPRequest} from './../src/core/interfaces/ISPRequest';

describe('default spec', () => {
  it('should write a message', (done) => {
    let req: ISPRequest = sprequest.create(<IUserCredentials>{
      username: 'user',
      password: 'pass'
    });

    req('https://sp2013dev/sites/dev')
      .then((data) => {
        console.log(data.statusCode);
        done();
      });

    expect('hello').to.equals('hello');
  });
});

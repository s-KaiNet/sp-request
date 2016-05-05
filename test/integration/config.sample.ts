import {IUserCredentials} from './../../src/core/auth/IUserCredentials';
import {IEnvironment} from './../../src/core/auth/IEnvironment';

export var onprem: IUserCredentials = {
  username: '[user]',
  password: '[pass]'
};

export var env: IEnvironment = {
  domain: 'sp'
};

export var online: IUserCredentials = {
  username: '[user]',
  password: '[pass]'
};

export var url: any = {
  online: 'https://[domain].sharepoint.com',
  onprem: 'http://onprem/sharepoint/url'
};

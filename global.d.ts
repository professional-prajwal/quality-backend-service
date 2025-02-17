/* eslint-disable no-var,vars-on-top */
import * as Photon from '@postman/photon';
import asyncModule = require('async');
import lodashModule = require('lodash');
import LogServiceModule = require('./api/services/LogService');

declare global {
  var app: any,
    server: any,

    async: typeof asyncModule,
    _ : typeof lodashModule,

    Health: any,

    LogService: typeof LogServiceModule;

  type PhotonRequest = Photon.PhotonRequest;
  type PhotonResponse = Photon.PhotonResponse;
}

export {};

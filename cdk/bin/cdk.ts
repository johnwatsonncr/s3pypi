#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { PyPiS3Stack } from '../lib/cdk-stack';

const app = new cdk.App();
new PyPiS3Stack(app, 'PyPiS3Stack2');

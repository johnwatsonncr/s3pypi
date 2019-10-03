import {
  CfnOutput, Construct, Stack, App, StackProps, RemovalPolicy, PhysicalName,
} from '@aws-cdk/core';
import { Bucket, BucketEncryption, } from '@aws-cdk/aws-s3';
import { CloudFrontWebDistribution, HttpVersion, } from '@aws-cdk/aws-cloudfront';


export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const bucket = new Bucket(this, 'pypiBucket', {
      encryption: BucketEncryption.S3_MANAGED,
      bucketName: 'pypi.repository.20191003',
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: true
    });

    const distribution = new CloudFrontWebDistribution(this, 'PyPiCFDistribution', {
      originConfigs: [
          {
              s3OriginSource: {
                  s3BucketSource: bucket
              },
              behaviors : [ {isDefaultBehavior: true}],
              
          }
      ],
   });
    new CfnOutput(this, 'pypiIndexUrl', {
      description: 'index url to add to pip config',
      exportName: 'pypiIndexUrl',
      value: bucket.bucketDomainName,
    });
  }
}

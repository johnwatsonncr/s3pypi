import {
  CfnOutput, Construct, Stack, App, StackProps, RemovalPolicy, PhysicalName,
} from '@aws-cdk/core';
import { Bucket, BucketEncryption, BucketPolicy, } from '@aws-cdk/aws-s3';
import { CloudFrontWebDistribution, HttpVersion, CfnCloudFrontOriginAccessIdentity, } from '@aws-cdk/aws-cloudfront';
import { PolicyDocument, PolicyStatement, CanonicalUserPrincipal, AnyPrincipal } from '@aws-cdk/aws-iam';

export class PyPiS3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const bucket = new Bucket(this, 'pypiBucket', {
      encryption: BucketEncryption.S3_MANAGED,
      bucketName: 'pypi.repository.20191004',
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: true,
    });

    const identityResource = new CfnCloudFrontOriginAccessIdentity(this, "OAI",{
      cloudFrontOriginAccessIdentityConfig: {
        comment: 'pypi s3 cloudfront identity access'
      }
    });

    const statement = new PolicyStatement( {
        actions: [
          's3:ListBucket'
        ],
        principals: [new AnyPrincipal()],
        resources: [ bucket.bucketArn ],
    });
    const statement2 = new PolicyStatement( {
      actions: [
        's3:GetObject', 
        's3:PutObject'
      ],
      principals: [new AnyPrincipal()],
      resources: [ bucket.bucketArn+'/*' ],
  });

    bucket.addToResourcePolicy(statement);
    bucket.addToResourcePolicy(statement2);

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

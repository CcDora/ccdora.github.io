const s3StaticSite = require('./s3-static-site');

s3StaticSite.deploy({
  bucket: 'connect.calibrus.com',
  cloudFrontId: 'E6D1SM8TS6CAJ'
}).then(_ => {
  console.log('Deployment complete');
}).catch(e => {
  console.log('Something went wrong!', e);
});


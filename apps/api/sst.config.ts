/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'api',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      // protect: ['production'].includes(input?.stage),
      home: 'aws',
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc('SupeVpc');
    const cluster = new sst.aws.Cluster('SupeCluster', { vpc });

    cluster.addService('SupeAPIService', {
      loadBalancer: {
        ports: [{ listen: '80/http', forward: '4000/http' }],
      },
      dev: {
        command: 'pnpm dev',
      },
    });
  },
});

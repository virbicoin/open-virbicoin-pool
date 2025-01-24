/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'open-virbicoin-pool',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // API host and port
      ApiUrl: 'https://dev.mofumofu.me/',

      // HTTP mining endpoint
      HttpHost: 'https://dev.mofumofu.me/',
      HttpPort: 8881,

      // Stratum mining endpoint
      StratumHost: 'dev.mofumofu.me',
      StratumPort: 8001,

      // Fee and payout details
      PoolFee: '1%',
      PayoutThreshold: '0.1 VBC',

      // For network hashrate (change for your favourite fork)
      BlockTime: 12.0
    }
  };

  if (environment === 'development') {
    /* Override ApiUrl just for development, while you are customizing
      frontend markup and css theme on your workstation.
    */
    ENV.APP.ApiUrl = 'https://dev.mofumofu.me/'
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};

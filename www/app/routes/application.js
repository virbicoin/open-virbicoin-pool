import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  intl: Ember.inject.service(),

  beforeModel() {
    this.get('intl').setLocale('en-us');
  },

	model: function() {
    var url = config.APP.ApiUrl + 'api/stats';
    return Ember.$.getJSON(url).then(function(data) {
      return Ember.Object.create(data);
    });
	},

  setupController: function(controller, model) {
    this._super(controller, model);

    const history = controller.get('hashrateHistory');
    const newRecord = {
      timestamp: new Date(),
      hashrate: controller.get('hashrate')
    };
    history.pushObject(newRecord);

    while (history.get('length') > 60) {
      history.shiftObject();
    }

    Ember.run.later(this, this.refresh, 5000);
  }
});

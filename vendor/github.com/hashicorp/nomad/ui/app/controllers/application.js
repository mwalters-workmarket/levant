import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { run } from '@ember/runloop';
import { observer, computed } from '@ember/object';
import Ember from 'ember';
import codesForError from '../utils/codes-for-error';

export default Controller.extend({
  config: service(),

  error: null,

  errorStr: computed('error', function() {
    return this.get('error').toString();
  }),

  errorCodes: computed('error', function() {
    return codesForError(this.get('error'));
  }),

  is403: computed('errorCodes.[]', function() {
    return this.get('errorCodes').includes('403');
  }),

  is404: computed('errorCodes.[]', function() {
    return this.get('errorCodes').includes('404');
  }),

  is500: computed('errorCodes.[]', function() {
    return this.get('errorCodes').includes('500');
  }),

  throwError: observer('error', function() {
    if (this.get('config.isDev')) {
      run.next(() => {
        throw this.get('error');
      });
    } else if (!Ember.testing) {
      run.next(() => {
        // eslint-disable-next-line
        console.warn('UNRECOVERABLE ERROR:', this.get('error'));
      });
    }
  }),
});

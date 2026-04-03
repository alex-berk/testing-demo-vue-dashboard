import './commands';
import { mount } from 'cypress/vue';
import '../../src/styles.css';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

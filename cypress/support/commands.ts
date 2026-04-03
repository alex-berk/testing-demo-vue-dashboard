declare global {
  namespace Cypress {
    interface Chainable {
      getByCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getByCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});

export {};

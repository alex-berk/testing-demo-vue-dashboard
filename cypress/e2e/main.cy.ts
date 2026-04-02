/// <reference types="cypress" />

type ItemsInterception = {
  request: {
    query: Record<string, string | number>;
  };
  response?: {
    statusCode: number;
    body: {
      items: unknown[];
    };
  };
};

const getItemsInterception = (alias: string) =>
  cy.get(alias) as unknown as Cypress.Chainable<ItemsInterception>;

describe('main demo page', () => {
  it('shows the main title and subtitle', () => {
    cy.visit('/');

    cy.get('[data-cy="page-title"]').should('have.text', 'Demo Catalog');
    cy.get('[data-cy="page-subtitle"]').should(
      'contain',
      'single-page app that fetches a tiny catalog',
    );
  });

  it('captures the items request and checks its params', () => {
    cy.intercept('GET', '**/api/items*').as('get-items');

    cy.visit('/');
    cy.wait('@get-items'); // checks if it was called at all

    getItemsInterception('@get-items').should((interception) => {
      expect(interception.request.query).to.deep.include({
        section: 'featured',
        limit: '3',
        locale: 'en-US',
      });
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.items).to.have.length(3);
    });

    cy.contains('QA Field Notes').should('be.visible'); // really bad code smell on a live request
  });

  it('stubs the items response with a fixture and renders the stubbed data', () => {
    cy.intercept('GET', '**/api/items*', {
      fixture: 'featured-items.stub.json',
    }).as('get-items-stub');

    cy.visit('/');
    cy.wait('@get-items-stub');

    getItemsInterception('@get-items-stub').should((interception) => {
      expect(interception.request.query).to.deep.include({
        section: 'featured',
        limit: '3',
        locale: 'en-US',
      });
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.items).to.have.length(2);
    });

    cy.contains('Stubbed Floor Lamp').should('be.visible');
    cy.contains('Fixture-backed response for Cypress intercept demos.').should(
      'be.visible',
    );
    cy.contains('QA Field Notes').should('not.exist');
  });
});

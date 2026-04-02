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

    cy.get('@get-items').should((interception) => {
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
});


describe('visual eval smoke', () => {
  const aiRoute = Cypress.expose('VISUAL_EVAL_ROUTE') || 'shift';

  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.intercept('GET', '**/api/items*', {
      fixture: 'featured-items.stub.json',
    }).as('get-items');
  });

  it('passes when the baseline page is identical', () => {
    cy.visit('/baseline');
    cy.wait('@get-items');

    cy.getByCy('featured-items-panel').should('be.visible');
    cy.getByCy('item-stubbed-floor-lamp').should('be.visible');

    cy.visualTest('baseline-page-identical');
  });

  it('uses the AI fallback for the intentional shift diff', () => {
    cy.visit(aiRoute);
    cy.wait('@get-items');

    cy.getByCy('featured-items-panel').should('be.visible');
    cy.getByCy('item-stubbed-floor-lamp').should('be.visible');

    cy.visualTest('baseline-page-ai-fallback');
  });
});

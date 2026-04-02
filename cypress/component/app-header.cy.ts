import AppHeader from '../../src/components/AppHeader.vue';

describe('<AppHeader />', () => {
  it('renders the passed title and subtitle', () => {
    cy.mount(AppHeader, {
      props: {
        title: 'QA Demo Store',
        subtitle: 'A tiny component test for Cypress.',
      },
    });

    cy.get('[data-cy="page-title"]').should('have.text', 'QA Demo Store');
    cy.contains('A tiny component test for Cypress.').should('be.visible');
  });
});

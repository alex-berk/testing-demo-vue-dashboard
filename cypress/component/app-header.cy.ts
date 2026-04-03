import AppHeader from '../../src/components/AppHeader.vue';

describe('<AppHeader />', () => {
  it('renders the passed title and subtitle', () => {
    const title = 'QA Demo Store'
    const subtitle = 'A tiny component test for Cypress.'
    cy.mount(AppHeader, {
      props: {
        title,
        subtitle
      },
    });

    cy.getByCy('page-title').should('have.text', title);
    cy.contains(subtitle).should('be.visible');
  });
});

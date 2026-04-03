describe('eval pages rendering', () => {
  it('renders the baseline page without the request profile block', () => {
    cy.intercept('GET', '**/api/items*').as('get-items');

    cy.visit('/baseline');
    cy.wait('@get-items');

    cy.contains('Request profile').should('not.exist');
    cy.getByCy('featured-items-panel').should('be.visible');
    cy.contains('QA Field Notes').should('be.visible');
  });

  it('renders the shift page 3 pixels higher than baseline', () => {
    cy.intercept('GET', '**/api/items*', {
      fixture: 'featured-items.stub.json',
    }).as('get-items');

    let baselineTop = 0;

    cy.visit('/baseline');
    cy.wait('@get-items');
    cy.getByCy('featured-items-panel').then(($panel) => {
      baselineTop = $panel[0].getBoundingClientRect().top;
    });

    cy.visit('/shift');
    cy.wait('@get-items');
    cy.getByCy('featured-items-panel').then(($panel) => {
      expect($panel[0].getBoundingClientRect().top).to.be.closeTo(baselineTop - 3, 0.5);
    });
  });

  it('renders the crop page with the last card clipped by the grid shell', () => {
    cy.intercept('GET', '**/api/items*').as('get-items');

    let baselineCardWidth = 0;

    cy.visit('/baseline');
    cy.wait('@get-items');
    cy.get('[data-cy="item-vitest-mug"]').then(($card) => {
      baselineCardWidth = $card[0].getBoundingClientRect().width;
    });

    cy.visit('/crop');
    cy.wait('@get-items');

    cy.contains('Request profile').should('not.exist');
    cy.getByCy('card-grid-shell').then(($shell) => {
      const cropMaskStyles = window.getComputedStyle($shell[0], '::after');

      expect(cropMaskStyles.width).to.eq('92px');

      cy.get('[data-cy="item-vitest-mug"]').then(($card) => {
        expect($card[0].getBoundingClientRect().width).to.be.closeTo(
          baselineCardWidth,
          0.5,
        );
      });
    });
  });
})

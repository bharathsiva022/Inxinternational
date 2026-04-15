Cypress.Commands.add('visitPage', (path) => {
  cy.visit(path, { failOnStatusCode: false });
  cy.get('body').should('be.visible');
});

Cypress.Commands.add('checkNoPhpError', () => {
  const errorPatterns = ['Fatal error', 'Uncaught', 'Drupal\\Core',
    'PDOException', 'Warning:', 'Parse error'];
  cy.document().then(doc => {
    const html = doc.documentElement.innerHTML;
    errorPatterns.forEach(err => {
      expect(html, `PHP error in HTML: "${err}"`).not.to.include(err);
    });
  });
  cy.get('body').then($body => {
    if ($body.find('.messages--error').length) {
      throw new Error('Drupal error message block detected on page');
    }
  });
  cy.location('href').then(url => {
    cy.request({ url, failOnStatusCode: false }).its('status').should('not.equal', 500);
  });
});

Cypress.Commands.add('hoverOnElement', (selector) => {
  cy.get(selector).trigger('mouseover');
});

Cypress.Commands.add('clickElement', (selector) => {
  cy.get(selector).click({ force: true });
});

Cypress.Commands.add('assertCssProperty', (selector, property, value) => {
  cy.get(selector).should('have.css', property).and('include', value);
});

Cypress.Commands.add('setResponsiveViewport', (width, height) => {
  cy.viewport(width, height);
});

Cypress.Commands.add('checkNoJsError', () => {
  cy.window().then((win) => {
    const errors = win.console.error.calls?.all() || [];
    if (errors.length > 0) {
      throw new Error('JavaScript errors found in console: ' + JSON.stringify(errors));
    }
  });
});
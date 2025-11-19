describe('Mi primer test', () => {
  it('debe cargar la página y mostrar un título', () => {
    cy.visit('/');
    cy.get('h1').should('be.visible').and('contain', 'Probando Cypress');
  });
});
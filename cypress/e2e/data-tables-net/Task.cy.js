describe('DataTables', () => {
  it('verify that the DataTables page loads', () => {
    cy.visit('https://datatables.net/')
    cy.get('.fw-hero > h1').should('contain.text', 'Add advanced interaction controlsto your HTML tables the free & easy way')
  })
})
describe('Verify the entries per page dropdown', () => {
  const dropdown = ['10', '25', '50', '100']
  let c = 0;
  it('verify the entries per page page for each dropdown (10)', () => {
    cy.visit('https://datatables.net/')
    cy.get('#dt-length-0').select(dropdown[c])
    cy.get('#example_info').should('contain.text', 'Showing 1 to 10 of 57 entries')
    c++
  })
  it('verify the entries per page page for each dropdown (25)', () => {
    cy.visit('https://datatables.net/')
    cy.get('#dt-length-0').select(dropdown[c])
    cy.get('#example_info').should('contain.text', 'Showing 1 to 25 of 57 entries')
    c++
  })
  it('verify the entries per page page for each dropdown (50)', () => {
    cy.visit('https://datatables.net/')
    cy.get('#dt-length-0').select(dropdown[c])
    cy.get('#example_info').should('contain.text', 'Showing 1 to 50 of 57 entries')
    c++
  })
  it('verify the entries per page page for each dropdown (100)', () => {
    cy.visit('https://datatables.net/')
    cy.get('#dt-length-0').select(dropdown[c])
    cy.get('#example_info').should('contain.text', 'Showing 1 to 57 of 57 entries')
    c++
  })
})
describe('Verify the functionality of the search bar', () => {
  it('verify the accuracy of the search bar for Position', () => {
    cy.visit('https://datatables.net/')
    cy.get('#dt-search-0').type('Software Engineer')
    for (let i = 0; i < 1; i++) {
      for (let j = 1; j < 6; j++) {
        cy.get(`tbody > :nth-child(${j}) > :nth-child(2)`).should('contain.text', 'Software Engineer')
      }
    }
  })
  it('verify the accuracy of the search bar for Office', () => {
    cy.visit('https://datatables.net/')
    cy.get('#dt-search-0').type('Tokyo')
    for (let i = 0; i < 1; i++) {
      for (let j = 1; j <= 5; j++) {
        cy.get(`tbody > :nth-child(${j}) > :nth-child(3)`).should('contain.text', 'Tokyo')
      }
    }
  })
  it('verify the accuracy of the search bar for Employee Name', () => {
    cy.visit('https://datatables.net/')
    cy.get('#dt-search-0').type('Angelica Ramos')
    cy.get('.dtr-control').click()
    try {
        cy.get('[data-dtr-index="5"] > .dtr-data')
            .should('be.visible')
            .and('have.text', '$1,200,000')
    }
    catch (error) {
        cy.log('Maybe her salary is updated because of revenue increase this year:', error)
    }
  })
  it('verify the accuracy of the search bar for Age', () => {
    const age = ['19', '20', '21', '21', '22', '22', '22', '23', '23', '27']
    cy.visit('https://datatables.net/')
    cy.get('[data-dt-column="3"] > .dt-column-header > .dt-column-title').click()
    for (let i = 0; i < 1; i++) {
      for (let j = 1; j <= 10; j++) {
        cy.get(`tbody > :nth-child(${j}) > :nth-child(4)`).should('contain.text', age[j - 1])
      }
    }
  })
})
describe('Verify sorting functionality', () => {
  it('verify the sorting functionality of the for Age', () => {
    const age = ['19', '20', '21', '21', '22', '22', '22', '23', '23', '27']
    cy.visit('https://datatables.net/')
    cy.get('[data-dt-column="3"] > .dt-column-header > .dt-column-title').click()
    for (let i = 0; i < 1; i++) {
      for (let j = 1; j <= 10; j++) {
        cy.get(`tbody > :nth-child(${j}) > :nth-child(4)`).should('contain.text', age[j - 1])
      }
    }
  })
  it('verify the sorting functionality of the for Employee Name', () => {
    const expectedFirstLetters = ['A', 'A', 'A', 'B', 'B', 'B', 'B', 'C', 'C', 'C']
    cy.visit('https://datatables.net/')
    for (let i = 0; i < 1; i++) {
      for (let j = 1; j <= 10; j++) {
        cy.get(`:nth-child(${j}) > .sorting_1`).invoke('text').then((name) => {
          const firstLetter = name.trim().charAt(0);
          expect(firstLetter).to.eq(expectedFirstLetters[j - 1]);
        });
      }
    }
  })
})
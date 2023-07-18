// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getByPlaceholder", (selector) => {
  return cy.get(`[Placeholder=${selector}]`)
})

Cypress.Commands.add("getButtonByName", (selector) => {
  return cy.get(`button[name=${selector}]`)
})

Cypress.Commands.add('addContact', (name, phone, email) => {
  if(name != ''){
    cy.getByPlaceholder('Name').type(`${name}`)  
  }
  if(phone != ''){
    cy.getByPlaceholder('Phone').type(`${phone}`)
  }
  if(email != ''){
    cy.getByPlaceholder('Email').type(`${email}`)
  }
  cy.getButtonByName('add').click()
})

Cypress.Commands.add('loadContacts', () => {
  const allContacts = require('../fixtures/example.json')

  allContacts.forEach((contact) => {
    cy.addContact(`${contact.name}`, `${contact.phone}`, `${contact.email}`)
  })
  cy.get('table tbody tr').should('have.length', 10)
})
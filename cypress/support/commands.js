import '@testing-library/cypress/add-commands'
import { codes } from 'keycode'

const keycode = name => ({ keyCode: codes[name], which: codes[name] })

Cypress.Commands.add('firstCell', () => cy.get('.ag-cell:first').click())

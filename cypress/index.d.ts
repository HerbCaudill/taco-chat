﻿declare namespace Cypress {
  interface Chainable {
    getTeamName(): Chainable<string> // returns team name
    getUserName(): Chainable<string> // returns user name

    invite(userName: string): Chainable<string> // returns code

    join(code: string): Chainable<Element>
    addToTeam(userName: string): Chainable<Element>
    getUserRow(userName: string): Chainable<Element>
    connectionStatus(userName: string): Chainable<string>
    makeAdmin(userName: string): Chainable<Element>
    removeAdmin(userName: string): Chainable<Element>
  }
}

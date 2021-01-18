Cypress.Commands.add('getTeamName', { prevSubject: true }, subject => {
  const s = () => cy.wrap(subject)
  return s().find('.TeamName').invoke('text')
})

Cypress.Commands.add('getUserName', { prevSubject: true }, subject => {
  const s = () => cy.wrap(subject)
  return s().find('h1').invoke('text')
})

Cypress.Commands.add('invite', { prevSubject: true }, (subject, userName: string) => {
  const s = () => cy.wrap(subject)
  // click invite button
  s().findByText('Invite someone').click()

  // choose user from dropdown
  s().find('select').select(userName)

  // press invite button
  s().findByText('Invite').click()

  // capture invitation code
  return s()
    .get('pre.InvitationCode')
    .then(pre => {
      s().findByText('Copy').click()
      return cy.wrap(pre).invoke('text')
    })
})

Cypress.Commands.add('join', { prevSubject: true }, (subject, code: string) => {
  const s = () => cy.wrap(subject)
  s().wait(100).findByText('Join team').click()
  s().get('input').type(code)
  s().findByText('Join').click()
  return s()
    .getUserName()
    .then(userName => s().get('.MemberTable').contains(userName))
})

Cypress.Commands.add('addToTeam', { prevSubject: true }, (subject, userName: string) => {
  const s = () => cy.wrap(subject)
  s()
    .invite(userName)
    .then(code => {
      peer(userName).join(code)
    })
    .then(() =>
      s()
        .getTeamName()
        .then(teamName => peer(userName).getTeamName().should('equal', teamName))
    )
})

Cypress.Commands.add('getUserRow', { prevSubject: true }, (subject, userName: string) => {
  return cy.wrap(subject).find('.MemberTable').findByText(userName).parents('tr')
})

Cypress.Commands.add('connectionStatus', { prevSubject: true }, (subject, userName: string) => {
  const connCell = cy.wrap(subject).getUserRow(userName).findByText('💻').parents('td').first()
  return connCell.invoke('attr', 'title')
})

Cypress.Commands.add('promote', { prevSubject: true }, (subject, userName: string) =>
  cy.wrap(subject).getUserRow(userName).findByTitle('Click to make team admin').click()
)

Cypress.Commands.add('removeAdmin', { prevSubject: true }, (subject, userName: string) =>
  cy.wrap(subject).getUserRow(userName).findByTitle('Team admin (click to remove)').click()
)

const peer = (name: string) => cy.get('h1').contains(name).parents('.Peer')

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      getTeamName(): Chainable<string> // returns team name
      getUserName(): Chainable<string> // returns user name
      invite(userName: string): Chainable<string> // returns code
      join(code: string): Chainable<Element>
      addToTeam(userName: string): Chainable<Element>
      getUserRow(userName: string): Chainable<Element>
      connectionStatus(userName: string): Chainable<string>
      promote(userName: string): Chainable<Element>
      demote(userName: string): Chainable<Element>
    }
  }
}

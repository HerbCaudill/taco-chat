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
    .get('pre')
    .then(pre => {
      s().findByText('Copy').click()
      return cy.wrap(pre).invoke('text')
    })
})

Cypress.Commands.add('join', { prevSubject: true }, (subject, code: string) => {
  const s = () => cy.wrap(subject)
  s().findByText('Join team').click()
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
  return peer(userName).get('.MemberTable').findByText(userName)
})

Cypress.Commands.add('getUserRow', { prevSubject: true }, (subject, userName: string) =>
  cy.wrap(subject).get('.MemberTable').findByText(userName).parents('tr')
)

Cypress.Commands.add('makeAdmin', { prevSubject: true }, (subject, userName: string) => {
  // TODO: The fact that we need to wait 1000ms for this to work is probably a symptom of the same
  // bug that is making updates stop after the first one or two go through.

  // After update are we getting into a different state that's no longer listening?

  // At any rate it shouldn't make a difference whether we make Bob an admin after or before he's joined.
  //

  cy.wait(1000)
  return cy.wrap(subject).getUserRow('Bob').findByTitle('Click to make team admin').click()
})

const peer = (name: string) => cy.get('h1').contains(name).parents('.Peer')

export {}

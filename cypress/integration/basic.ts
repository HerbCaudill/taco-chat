import '@testing-library/cypress'

describe('taco-chat', () => {
  beforeEach(() => {
    cy.visit('/')
    localStorage.setItem('debug', 'lf:*')
  })

  describe('first load', () => {
    it('has just one peer, which is Alice', () => {
      cy.get('.Peer')
        // just one
        .should('have.length', 1)
        // it's Alice
        .contains('Alice')
    })

    it('shows the signature chain', () => {
      cy.get('.ChainDiagram')
        .get('svg')
        // has only one link
        .should('have.length', 1)
        // it's the ROOT
        .contains('ROOT')
    })
  })

  describe('we add Bob', () => {
    it('has two peers, the second of which is Bob', () => {
      add('Bob:laptop')
      cy.get('.Peer')
        // there are two
        .should('have.length', 2)
        // the second is Bob
        .eq(1)
        .contains('Bob')
    })
  })

  describe('Bob creates another team', () => {
    it('has two different teams', () => {
      add('Bob:laptop')

      // Click 'create team' and wait for the team name to show up
      bob().findByText('Create team').click().get('.TeamName')

      // team names are different
      alice()
        .getTeamName()
        .then(aliceTeamName => peer('Bob').getTeamName().should('not.equal', aliceTeamName))
    })
  })

  describe('Alice adds Bob to team', () => {
    it('has the same team for both peers', () => {
      add('Bob:laptop')
      alice().addToTeam('Bob')

      // team names are the same
      alice()
        .getTeamName()
        .then(aliceTeamName => bob().getTeamName().should('equal', aliceTeamName))
    })
  })

  describe('Alice makes Bob admin', () => {
    it(`adds Bob as an admin on Alice's side`, () => {
      add('Bob:laptop')
      alice().addToTeam('Bob')
      bob().get('.MemberTable').findByText('Bob')

      alice().makeAdmin('Bob')
    })
  })
})

const peer = (name: string) => cy.get('h1').contains(name).parents('.Peer')

const alice = () => peer('Alice')
const bob = () => peer('Bob')

const add = (id: string) => cy.get('.Chooser select').select(id)

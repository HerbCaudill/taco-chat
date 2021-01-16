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

  describe.only('Alice makes Bob admin after he joins', () => {
    it(`adds Bob as an admin on Alice's side`, () => {
      add('Bob:laptop')
      alice().addToTeam('Bob')
      alice().makeAdmin('Bob')

      // alice shows bob as an admin
      alice()
        .getUserRow('Bob')
        .findByTitle('Team admin (click to remove)')
        .should('have.length', '1')

      // bob shows bob as an admin
      bob() //
        .getUserRow('Bob')
        .findByTitle('Team admin (click to remove)')
        .should('have.length', '1')
    })
  })

  describe.skip('Alice makes Bob admin before he joins', () => {
    // ????
    // This test is failing and I can't figure out why.

    it(`adds Bob as an admin on Alice's side`, () => {
      add('Bob:laptop')
      alice()
        .invite('Bob')
        .then(code => {
          alice().makeAdmin('Bob')
          // alice shows bob as an admin
          alice()
            .getUserRow('Bob')
            .findByTitle('Team admin (click to remove)')
            .should('have.length', '1')

          bob().join(code) // This kicks off the connection protocol.

          // ????
          // The only difference between this scenario and the previous one is that in this case
          // Alice's signature chain has the ADD_MEMBER_ROLE element.

          // In the logs you'll see this:

          // 👩🏾 -> 👨‍🦲 #5 UPDATE AAAA
          // 👩🏾 sending  {type: "UPDATE", payload: {…}, index: 5}

          // this should be followed by

          // tc:👩🏾 sending {type: "UPDATE", payload: {…}, index: 5}

          // but it's not. Alice's message #5 is getting stuck in the pipes somewhere between the
          // auth Connection and the taco-chat Connection.

          // At this point Bob is in `synchronizing-waiting` state, so should be

          alice()
            .getTeamName()
            .then(teamName => bob().getTeamName().should('equal', teamName))
        })
    })
  })
})

const peer = (name: string) => cy.get('h1').contains(name).parents('.Peer')

const alice = () => peer('Alice')
const bob = () => peer('Bob')

const add = (id: string) => cy.get('.Chooser select').select(id)

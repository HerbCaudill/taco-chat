import '@testing-library/cypress'

describe('taco-chat', () => {
  beforeEach(() => {
    cy.visit('/')
    localStorage.setItem('debug', 'lf:*')
  })

  describe('page loads', () => {
    it('we see just one peer, which is Alice', () => {
      cy.get('.Peer')
        // just one
        .should('have.length', 1)
        // it's Alice
        .contains('Alice')
    })

    it('we see the signature chain', () => {
      cy.get('.ChainDiagram')
        .get('svg')
        // has only one link
        .should('have.length', 1)
        // it's the ROOT
        .contains('ROOT')
    })
  })

  describe('we add Bob', () => {
    beforeEach(() => {
      add('Bob:laptop')
    })

    it('we see two peers, the second of which is Bob', () => {
      cy.get('.Peer')
        // there are two
        .should('have.length', 2)
        // the second is Bob
        .eq(1)
        .contains('Bob')
    })

    describe('Bob creates another team', () => {
      beforeEach(() => {
        bob()
          // Click 'create team'
          .findByText('Create team')
          .click()
          // wait for the team name to show up
          .get('.TeamName')
      })

      it('Bob and Alice are on two different teams', () => {
        alice()
          .getTeamName()
          .then(aliceTeamName =>
            peer('Bob') //
              .getTeamName()
              .should('not.equal', aliceTeamName)
          )
      })
    })

    describe('Alice makes Bob admin before he joins', () => {
      it(`Alice sees that Bob is an admin`, () => {
        alice()
          .invite('Bob')
          .then(code => {
            alice().promote('Bob')
            // Alice sees that Bob is an admin
            alice()
              .getUserRow('Bob')
              .findByTitle('Team admin (click to remove)')
              .should('have.length', '1')

            bob().join(code) // This kicks off the connection protocol.
            alice()
              .getTeamName()
              .then(teamName => bob().getTeamName().should('equal', teamName))
          })
      })
    })

    describe('Alice adds Bob to the team', () => {
      beforeEach(() => {
        alice().addToTeam('Bob')
      })

      it('has the same team for both peers', () => {
        alice()
          .getTeamName()
          .then(aliceTeamName => bob().getTeamName().should('equal', aliceTeamName))
      })

      it(`both peers have 'connected' status`, () => {
        alice().connectionStatus('Bob').should('equal', 'connected')
        bob().connectionStatus('Alice').should('equal', 'connected')
      })

      describe('Alice promotes Bob', () => {
        beforeEach(() => {
          // Alice makes Bob an admin
          alice().promote('Bob')
        })

        it.only(`Alice and Bob see that Bob is admin`, () => {
          // Alice sees Bob is an admin
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

        describe('then Alice demotes Bob', () => {
          beforeEach(() => {
            // Alice removes Bob's admin role
            alice().demote('Bob')
          })

          it(`neither one sees Bob as admin`, () => {
            // Alice no longer sees Bob as Admin
            alice()
              .getUserRow('Bob')
              .findByTitle('Click to make team admin')
              .should('have.length', '1')

            // Neither does Bob
            bob()
              .getUserRow('Bob')
              .findByTitle('Click to make team admin')
              .should('have.length', '1')
          })
        })
      })
    })
  })
})

const peer = (name: string) => cy.get('h1').contains(name).parents('.Peer')

const alice = () => peer('Alice')
const bob = () => peer('Bob')

const add = (id: string) => cy.get('.Chooser select').select(id)

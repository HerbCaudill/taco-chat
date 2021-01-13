import '@testing-library/cypress'

describe('taco-chat', () => {
  beforeEach(() => {
    cy.visit('/')
    localStorage.setItem('debug', 'lf:*')
  })

  describe('on first load', () => {
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

  describe('add Bob', () => {
    const alice = () => cy.get('.Peer').eq(0)
    const bob = () => cy.get('.Peer').eq(1)

    beforeEach(() =>
      // select Bob from 'Add...' dropdown
      cy.get('.Chooser select').select('Bob:laptop')
    )

    it('has two peers, the second of which is Bob', () => {
      cy.get('.Peer')
        // there are two
        .should('have.length', 2)
        // the second is Bob
        .eq(1)
        .contains('Bob')
    })

    describe('Bob creates another team', () => {
      beforeEach(() => {
        bob().findByText('Create team').click().get('.TeamName')
      })

      it('has two different teams', () => {
        const aliceTeamName = cy.$$('.Peer:eq(0) .TeamName').text()
        const bobTeamName = cy.$$('.Peer:eq(1) .TeamName').text()
        // team names are different
        cy.wrap(aliceTeamName).should('not.equal', bobTeamName)
      })
    })

    describe('invite Bob', () => {
      beforeEach(() => {
        // click invite button
        alice().findByText('Invite someone').click()

        // invite Bob
        alice().get('.InviteWho').select('Bob')
        alice().findByText('Invite').click()
        // capture invitation code
        alice()
          .get('pre')
          .invoke('text')
          .then(code => {
            alice().findByText('Copy').click()
            bob().findByText('Join team').click()
            bob().get('input').type(code)
            bob().findByText('Join').click()
          })
      })

      it('has the same team for both peers', () => {
        bob().get('.MemberTable').contains('Bob')
        alice()
          .get('.TeamName')
          .invoke('text')
          .then(aliceTeamName =>
            bob().get('.TeamName').invoke('text').should('equal', aliceTeamName)
          )
      })
    })
  })
})

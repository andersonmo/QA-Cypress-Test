describe('Test Contact App', () => {

  beforeEach(() => {
    cy.visit('./contact_app.html')
  })

  it('Test if the application loads correctly', () => {
    cy.get('h1.text-center').should('have.text', 'Contact List App');
    cy.get('table tbody tr').should('have.length', 1)
  })

  // Add tests here
  it('Test if the application loads correctly Part 2', () => {
    cy.get('table tbody tr th').should('have.length', 4)
    cy.get('table tbody tr th').eq(0).should('have.text', 'Name')
    cy.get('table tbody tr th').eq(1).should('have.text', 'Phone')
    cy.get('table tbody tr th').eq(2).should('have.text', 'Email')
    cy.get('table tbody tr th').eq(3).should('have.text', 'Actions')
    cy.getButtonByName('delete').should('not.exist')
    cy.getButtonByName('edit').should('not.exist')
  })

  context('Add contacts', () => {
    it('Add Full Contact', () => {
      cy.addContact('First Name','1112223333','invalid@email.com')
      cy.addContact('Long Name 002','456789123456','fake@email.com')
      cy.get('table tbody tr').should('have.length', 3)
      cy.contains('First Name')
        .parent('tr')
        .within(() => {
          cy.get('td').eq(0).should('have.text', 'First Name')
          cy.get('td').eq(1).should('have.text', '1112223333')
          cy.get('td').eq(2).should('have.text', 'invalid@email.com')
          cy.get('td').eq(3).getButtonByName('delete').should('exist')
          cy.get('td').eq(3).getButtonByName('edit').should('exist')
        })
    })

    it('Add Contact partial information', () => {
      cy.addContact('Anderson', '' , '')
      cy.addContact('', '9998887777' , '')
      cy.addContact('', '' , 'example@mail.ca')
      cy.addContact('', '' , '')
      cy.addContact('ThinkOn Sales', '' , 'sales@thinkon.com')
      cy.addContact('ThinkOn Support', '1 877 787 0306' , '')
      cy.addContact('', '+44 2039 664888' , 'requests@thinkon.com')
      cy.get('table tbody tr').should('have.length', 8)
    })
  })

  context('Delete contacts', () => {
    it('Delete last contact in the list', () => {
      cy.loadContacts()
      cy.contains('last@email.com')
        .parent('tr')
        .within(() => {
          cy.get('td').eq(3).getButtonByName('delete').click()
        })
      cy.get('table tbody tr').should('have.length', 9)
      cy.get('table').find('tr').eq(8).find('td').eq(2).should('not.have.text', 'last@email.com')
      cy.get('table').find('tr').eq(8).find('td').eq(0).should('have.text', 'ThinkOn Support')
      cy.get('table').find('tr').eq(8).find('td').eq(1).should('have.text', '1 877 787 0306')
      cy.get('table').find('tr').eq(8).find('td').eq(2).should('have.text', '')
    })

    it('Delete first contact in the list', () => {
      cy.loadContacts()
      cy.get('table').find('tr').eq(1).within(() => {
        cy.get('td').eq(3).getButtonByName('delete').click()
      })
      cy.get('table tbody tr').should('have.length', 9)
      cy.get('table').find('tr').eq(1).find('td').eq(2).should('not.have.text', 'invalid@email.com')
      cy.get('table').find('tr').eq(1).find('td').eq(0).should('have.text', 'Be$t Friend')
      cy.get('table').find('tr').eq(1).find('td').eq(1).should('have.text', '000222333')
      cy.get('table').find('tr').eq(1).find('td').eq(2).should('have.text', 'fake@email.com')
    })

    it('Delete contact in the middle of the list', () => {
      cy.loadContacts()
      cy.get('table').find('tr').eq(4).within(() => {
        cy.get('td').eq(3).getButtonByName('delete').click()
      })
      cy.get('table tbody tr').should('have.length', 9)
      cy.get('table').find('tr').eq(4).find('td').eq(1).should('not.have.text', '9998887777')
      cy.get('table').find('tr').eq(4).find('td').eq(0).should('have.text', '')
      cy.get('table').find('tr').eq(4).find('td').eq(1).should('have.text', '')
      cy.get('table').find('tr').eq(4).find('td').eq(2).should('have.text', 'example@mail.ca')
    })

  })

  context('Edit Contacts', () => {
    it('Edit a contact in the list', () => {
      cy.loadContacts()
      cy.get('table').find('tr').eq(1).within(() => {
        cy.get('td').eq(3).getButtonByName('edit').click()
        cy.get('td').eq(3).getButtonByName('delete').should('not.exist')
        cy.get('td').eq(3).getButtonByName('edit').should('not.exist')
        cy.get('td').eq(3).getButtonByName('update').should('exist')
        cy.get('td').eq(0).within(() => {
          cy.get('input').should('be.visible').clear()
          cy.get('input').type('New Name')
        })
        cy.get('td').eq(1).within(() => {
          cy.get('input').should('be.visible')
        })
        cy.get('td').eq(2).within(() => {
          cy.get('input').should('be.visible')
        })
        cy.get('td').eq(3).getButtonByName('update').click()
        cy.get('td').eq(3).getButtonByName('update').should('not.exist')
        cy.get('td').eq(3).getButtonByName('delete').should('exist')
        cy.get('td').eq(3).getButtonByName('edit').should('exist')
        cy.get('td').eq(0).should('have.text', 'New Name')
        cy.get('td').eq(1).should('have.text', '+1(222)333-9999')
        cy.get('td').eq(2).should('have.text', 'invalid@email.com')
      })
    })

    it('User give up to edit', () => {
      cy.loadContacts()
      cy.get('table').find('tr').eq(1).within(() => {
        cy.get('td').eq(3).getButtonByName('edit').click()
        cy.get('td').eq(3).getButtonByName('update').click()
        cy.get('td').eq(3).getButtonByName('delete').should('exist')
        cy.get('td').eq(3).getButtonByName('edit').should('exist')
        cy.get('td').eq(0).should('have.text', 'Contact A')
        cy.get('td').eq(1).should('have.text', '+1(222)333-9999')
        cy.get('td').eq(2).should('have.text', 'invalid@email.com')
      })
    })

    it('User starts to edit more than one contact', () => {
      cy.loadContacts()
      cy.get('table').find('tr').eq(2).within(() => {
        cy.get('td').eq(3).getButtonByName('edit').click()
      })
      cy.get('table').find('tr').eq(6).within(() => {
        cy.get('td').eq(3).getButtonByName('edit').click()
      })
      cy.get('table').find('tr').eq(5).within(() => {
        cy.get('td').eq(3).getButtonByName('edit').click()
      })
      cy.get('table').find('tr').eq(6).within(() => {
        cy.get('td').eq(1).within(() => {
          cy.get('input').clear()
          cy.get('input').type('999 999 999')
        })
        cy.get('td').eq(2).within(() => {
          cy.get('input').clear()
          cy.get('input').type('test@cypress.com')
        })
        cy.get('td').eq(3).getButtonByName('update').click()
      })
      cy.get('table').find('tr').eq(5).within(() => {
        cy.get('td').eq(3).getButtonByName('update').click()
      })
      cy.get('table').find('tr').eq(2).within(() => {
        cy.get('td').eq(3).getButtonByName('update').click()
        cy.get('td').eq(0).should('have.text', 'Be$t Friend')
        cy.get('td').eq(1).should('have.text', '000222333')
        cy.get('td').eq(2).should('have.text', 'fake@email.com')
      })
      cy.get('table').find('tr').eq(5).within(() => {
        cy.get('td').eq(0).should('have.text', '')
        cy.get('td').eq(1).should('have.text', '')
        cy.get('td').eq(2).should('have.text', 'example@mail.ca')
      })
      cy.get('table').find('tr').eq(6).within(() => {
        cy.get('td').eq(0).should('have.text', '')
        cy.get('td').eq(1).should('have.text', '999 999 999')
        cy.get('td').eq(2).should('have.text', 'test@cypress.com')
      })
      cy.get('table tbody tr').should('have.length', 10)
    })
  })
  
});
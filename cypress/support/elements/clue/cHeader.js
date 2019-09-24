class ClueHeader{
    getGroupName(){
        return cy.get('[data-test=group-name]');
        // return cy.get('.header .group .name');
    }
    getGroupMembers(){
        return cy.get('[data-test=group-members]')
    }
}
export default ClueHeader;
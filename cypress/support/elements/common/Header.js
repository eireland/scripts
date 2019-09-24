class Header {
    getClassName(){
        return cy.get('[data-test=user-class]');
    }
    getUserName(){
        return cy.get('[data-test=user-name]')
    }
    getProblemTitle(){
        return cy.get('[data-test=problem-title]')
    }
}
export default Header;
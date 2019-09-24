import Header from '../common/Header'
import LeftNav from './LeftNav'
import Canvas from '../common/Canvas'
// import RightNav from './RightNav'

class ClueWorkspace{

    constructor() {
            this.header = new Header();
            this.leftnav = new LeftNav();
            this.canvas = new Canvas();
            // this.rightnav = new RightNav();
    }

    leaveGroup(){
        this.header.getGroupName().click();
        this.getDialogTitle().should('contain', 'Leave Group');
        this.getDialogOKButton().click();
    }

    cancelLeaveGroup(){
        this.header.getGroupName().click();
        this.getDialogTitle().should('contain', 'Leave Group');
        this.getDialogCancelButton().click();
    }

    getDialogTitle(){
        return cy.get('[data-test=dialog-title]');
    }

    getDialogOKButton(){
        return cy.get('[data-test=dialog-buttons] #okButton');
    }

    getDialogCancelButton(){
        return cy.get('[data-test=dialog-buttons] #cancelButton');
    }
}

export default ClueWorkspace;






class Canvas{
    canvas(){
        return cy.get('.single-workspace:first');
    }

    singleCanvas(){
        return '[data-test=canvas]'
    }

    getSingleCanvas(){
        return cy.get(this.singleCanvas());
    }

    getSingleCanvasDocumentContent(){
        return cy.get('[data-test=canvas]:first .document-content')
    }

    personalDocTitleEl(){
        return '[data-test=personal-doc-title]'
    }

    getPersonalDocTitle(){
        return cy.get(this.personalDocTitleEl())
    }

    getNewDocumentIcon(){
        return cy.get('[data-test=new-icon]')
    }

    getPublishIcon(){
        return cy.get('[data-test=publish-icon]');
    }

    getEditTitleIcon(){
        return cy.get('[data-test=personal-doc-title] [data-test=edit-icon]')
    }

    //Edit Title Dialog
    getDialogTitle(){
        return cy.get('[data-test=dialog-title]');
    }

    getDialogTextInput(){
        return cy.get('[data-test=dialog-text-input]');
    }

    getDialogOKButton(){
        return cy.get('[data-test=dialog-buttons] #okButton');
    }

    getDialogCancelButton(){
        return cy.get('[data-test=dialog-buttons] #cancelButton');
    }

    createNewDocument(title){
        this.getNewDocumentIcon().click()
            .then(()=>{
                this.getDialogTitle().should('exist').contains('Create Personal Document');
                this.getDialogTextInput().click().type('{selectall}{backspace}'+title);
                this.getDialogOKButton().click();
            })
        cy.wait(3000)    
    }

    publishCanvas(){
        this.getPublishIcon().click()
            .then(()=>{
                this.getDialogTitle().should('exist').contains('Published');
                this.getDialogOKButton().click();
                this.getDialogTitle().should('not.exist');
                this.getPublishIcon().should('exist');
            });
    }

    scrollToBottom(element){
        element.scrollTo('bottom');
    }

    scrollToTop(element){
        element.scrollTo('top');
    }
}

export default Canvas;
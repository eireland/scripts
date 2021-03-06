import Dialog from "../common/Dialog";
import Canvas from "../common/Canvas";

const dialog = new Dialog;
const canvas = new Canvas

//Dataflow canvas and toolbar
class dfCanvas{
    getDataFlowToolTile(){
        return cy.get('.single-workspace .dataflow-tool.editable');
    }
    getProgramToolbar(){
        return cy.get('.single-workspace [data-test=program-toolbar]');
    }
    getProgramToolbarButtons(){
        return cy.get('.single-workspace [data-test=program-toolbar] button')
    }
    openBlock(blockType){ //blockType=['sensor','number','generator','math','logic','transform','relay','data-storage']
        cy.get('.single-workspace [data-test=program-toolbar] button').contains(blockType).click();
    }
    resetPlots(){
        cy.get('.single-workspace [data-test=program-toolbar] button').contains('Reset').click();
    }
    clearCanvas(){
        cy.get('.single-workspace [data-test=program-toolbar] button').contains('Clear').click();
    }
    transformCanvas(){
        cy.get('.flow-tool div:nth-child(1)')
            .invoke('attr','style',"transform-origin: 0px 0px; transform: translate(228.545px, 125.601px) scale(0.901903);")
    }
    getDataFlowProgramEditorTopControl(){
        return cy.get('.single-workspace .program-editor-topbar')
    }
    scrollToTopOfTile(){//only for Dataflow tile
        this.getDataFlowProgramEditorTopControl().scrollIntoView();
    }
    getDurationDropdown(){
        return cy.get('.single-workspace .program-editor-topbar select')
    }
    getRunButton(){
        return cy.get('.single-workspace .program-editor-topbar button').contains('Run')
    }
    getStopButton(){
        return cy.get('.single-workspace .program-editor-topbar button').contains('Stop')
    }
    selectDuration(duration){
        this.getDurationDropdown().select(duration)
    }
    runProgram(){
        this.getRunButton().click();
    }
    stopProgram(){
        this.getStopButton().click();
    }
    transformCanvas(){
        cy.get('.flow-tool div:nth-child(1)')
            .invoke('attr','style',"transform-origin: 0px 0px; transform: translate(228.545px, 125.601px) scale(0.651903);")
    }
    moveBlock(blockType,whichOne, x,y) {
        cy.get('.single-workspace .node.'+blockType).eq(whichOne).parent()
        .invoke('attr','style',"position: absolute; touch-action: none; transform: translate(126.949px, 243.868px);")
    }
    getZoomInButton(){
        return cy.get('.single-workspace .program-editor-zoom button').contains('+')
    }
    getZoomOutButton(){
        return cy.get('.single-workspace .program-editor-zoom button').contains('-')
    }
    zoomIn(){
        this.getZoomInButton().click().click().click().click().click();
    }
    zoomOut(){
        this.getZoomOutButton().click().click().click().click().click();
    }

    createNewProgram(title){
        canvas.getNewDocumentIcon().click()
            .then(()=>{
                // dialog.getDialogTitle().should('exist').and('contains','Create New Dataset');
                dialog.getDialogTextInput().click().type('{selectall}{backspace}'+title);
                dialog.getDialogOKButton().click();
            })
        cy.wait(3000)    
    }

    getProgramRunningCover(){
        return cy.get('.editor.half .cover.running')
    }
    getProgramGraph(){
        return cy.get('.program-graph')
    }

    getFullGraph(){
        return cy.get('.program-graph.full')
    }
}
export default dfCanvas;
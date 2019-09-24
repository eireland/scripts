import Workspace from '../../../support/elements/Workspace.js';
import LeftNav from '../../../support/elements/LeftNav';
import RightNav from '../../../support/elements/RightNav';
import Canvas from '../../../support/elements/Canvas';
import LearningLog from '../../../support/elements/LearningLog';
import TextToolTile from '../../../support/elements/clue/TextToolTile'

const baseUrl = `${Cypress.config("baseUrl")}`;
const queryParam = `${Cypress.config("queryParams")}`
let leftNav = new LeftNav,
    rightNav = new RightNav,
    canvas = new Canvas,
    learningLog = new LearningLog,
    textToolTile = new TextToolTile;


context('Test the overall workspace', function(){

    describe('Desktop functionalities', function(){
        // TODO: Learning Log has changed with new feature changes.
        it('will verify that clicking on tab closes the nav area', function(){
            leftNav.openLeftNavTab('Introduction'); //left nav expand area should be visible
            leftNav.getLeftNavExpandedSpace().should('be.visible');
            leftNav.closeLeftNavTab('Introduction'); //left nav expand area should not be visible
            leftNav.getLeftNavExpandedSpace().should('not.be.visible');

            rightNav.openRightNavTab('my-work'); //my work expand area should be visible
            rightNav.getRightNavExpandedSpace().should('be.visible');
            rightNav.closeRightNavTab('my-work'); //my work expand area should not be visible
            rightNav.getRightNavExpandedSpace().should('not.be.visible');
        });
        // TODO: Learning Log has changed with new feature changes.
        it('will verify that left nav area is closes when other tabs are opened', function(){ //should this be tab closes when no longer in that area? my work and left nav
            leftNav.openLeftNavTab('Introduction'); //left nav expand area should be visible
            leftNav.getLeftNavExpandedSpace().should('be.visible');
            rightNav.getRightNavExpandedSpace().should('not.be.visible');

            rightNav.openRightNavTab('my-work'); //my work expand area should be visible
            leftNav.getLeftNavExpandedSpace().should('not.be.visible');
            rightNav.getRightNavExpandedSpace().should('be.visible');
        });
        it('will verify canvases do not persist between problems', function(){
            let problem1='1.1',
                problem2='2.1';
            let tab1 ='Introduction';

            cy.visit(baseUrl+'?appMode=qa&fakeClass=5&fakeUser=student:1&qaGroup=1&problem='+problem1);
            cy.wait(1000);
            
            canvas.addTextTile();
            textToolTile.enterText('This is the '+tab1+ ' in Problem '+problem1);
            textToolTile.getTextTile().last().should('contain', 'Problem '+problem1);

            cy.visit(baseUrl+'?appMode=qa&fakeClass=5&fakeUser=student:1&qaGroup=1&problem='+problem2);
            cy.wait(1000);
            textToolTile.getTextTile().should('not.exist');

            //Shows student as disconnected and will not load the introduction canvas
            cy.visit(baseUrl+'?appMode=qa&fakeClass=5&fakeUser=student:1&qaGroup=1&problem='+problem1);
            cy.wait(2000);
            textToolTile.getTextTile().last().should('contain', 'Problem '+problem1);
            canvas.deleteTile('text')//clean up
        })

    });
});
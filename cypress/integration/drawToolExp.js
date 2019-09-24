import Canvas from '../support/elements/common/Canvas'
import ClueCanvas from '../support/elements/clue/cCanvas'
import DrawToolTile from '../support/elements/clue/DrawToolTile'
import Workspace from '../support/elements/common/Workspace';
import ClueWorkspace from '../support/elements/clue/cWorkspace';


let canvas = new Canvas;
let clueCanvas = new ClueCanvas;
let clueWorkspace = new ClueWorkspace;
let workspace = new Workspace;

let drawToolTile = new DrawToolTile;

function getRandomNumber(max){
    let number =  Math.floor(Math.random() * Math.floor(max))
    return number
}

before(()=>{
    cy.visit('https://collaborative-learning.concord.org/branch/master/?appMode=qa&fakeUser=student:12&qaGroup=9&fakeClass=9&problem=1.2')
    cy.wait(2000);
})
context('add content to document',()=>{
    it('populate a canvas with draw tiles',()=>{
        let toolArr=['line', 'rect', 'ellipse'];
        let selectedShape = toolArr[getRandomNumber(2)];
        clueCanvas.addTile('drawing');

        switch (selectedShape) {
            case 'line':
                drawToolTile.getDrawToolLine().first().click();
                break;
            case 'rect':
                drawToolTile.getDrawToolRectangle().first().click();
                break;
            case 'ellipse':
                drawToolTile.getDrawToolEllipse().first().click();
                break;        

        }
        drawToolTile.getDrawTile().first()
            .trigger('mousedown')
            .trigger('mousemove',100,250)
            .trigger('mouseup')
    })
})
import Canvas from '../support/elements/common/Canvas'
import ClueCanvas from '../support/elements/clue/cCanvas'
import GraphToolTile from '../support/elements/clue/GraphToolTile'
import ImageToolTile from '../support/elements/clue/ImageToolTile'
import DrawToolTile from '../support/elements/clue/DrawToolTile'
import TextToolTile from '../support/elements/clue/TextToolTile'
import TableToolTile from '../support/elements/clue/TableToolTile'
import Workspace from '../support/elements/common/Workspace';
import ClueWorkspace from '../support/elements/clue/cWorkspace';
import ClueHeader from '../support/elements/clue/cHeader';
import Header from '../support/elements/common/Header';

let canvas = new Canvas;
let clueCanvas = new ClueCanvas;
let clueWorkspace = new ClueWorkspace;
let workspace = new Workspace;
let header = new Header;
let clueHeader = new ClueHeader;

let graphToolTile = new GraphToolTile;
let imageToolTile = new ImageToolTile;
let drawToolTile = new DrawToolTile;
let textToolTile = new TextToolTile;
let tableToolTile = new TableToolTile;
 
function selectTile(){
    let tiles = ['text','table','geometry','image','drawing']
    // let random = Math.floor(Math.random() * Math.floor(tiles.length - 1))
    let random = getRandomNumber(tiles.length - 1)

    console.log(tiles[random])
    return tiles[random];
}

function getRandomNumber(max){
    let number =  Math.floor(Math.random() * Math.floor(max))
    return number
}

function getTilesArray(){
    let i=0;
    let tilesToAdd=[];

    for (i;i<3;i++) {
        tilesToAdd.push(selectTile())
    }
    return tilesToAdd;
}
before(()=>{
    cy.visit('https://collaborative-learning.concord.org/branch/master/?appMode=qa&fakeUser=student:9&qaGroup=9&fakeClass=9&problem=1.2')
    cy.wait(5000);
})
context('add content to document',()=>{
    let tilesToAdd=getTilesArray();
    let userName='',investigationTitle='';

    before(()=>{
        clueCanvas.getInvestigationCanvasTitle().then(($titleEl)=>(
            investigationTitle = $titleEl.text()
        ))
        header.getUserName().then(($userNameEl)=>{
            userName = $userNameEl.text()
        })
    })
    it('populate a canvas with random tiles',()=>{
        tilesToAdd.forEach((tile)=>{
            clueCanvas.addTile(tile);
        })
    })
    it('populate a tile',()=>{
        if (tilesToAdd.includes('text')) {
            textToolTile.enterText('User is '+userName+' in Investigation '+investigationTitle);
        }
        if (tilesToAdd.includes('geometry')) {
            graphToolTile.addPointToGraph(getRandomNumber(15),getRandomNumber(15))
            graphToolTile.addPointToGraph(getRandomNumber(15),getRandomNumber(15))
            graphToolTile.addPointToGraph(getRandomNumber(15),getRandomNumber(15))
        }
        if (tilesToAdd.includes('table')) {
            tableToolTile.addNewRow();
            tableToolTile.enterData(0, getRandomNumber(15))
            tableToolTile.enterData(1, getRandomNumber(15))
            tableToolTile.addNewRow();
            tableToolTile.enterData(2, getRandomNumber(15))
            tableToolTile.enterData(3, getRandomNumber(15))
            tableToolTile.addNewRow();
            tableToolTile.enterData(4, getRandomNumber(15))
            tableToolTile.enterData(5, getRandomNumber(15))
            tableToolTile.addNewRow();
            tableToolTile.enterData(6, getRandomNumber(15))
            tableToolTile.enterData(7, getRandomNumber(15))
        }
        if (tilesToAdd.includes('image')) {
            let images = ['fan.png','graph.png','image.png','folder.png','chair.png']
            clueCanvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            cy.uploadFile(imageToolTile.imageChooseFileButton(), images[getRandomNumber(images.length-1)], 'image/png')
            cy.wait(3000)
        }
        if(tilesToAdd.includes('drawing')) {
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
        }
    })
})
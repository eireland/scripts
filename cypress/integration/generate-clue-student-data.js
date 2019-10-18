
import ClueCanvas from '../support/elements/clue/cCanvas'
import GraphToolTile from '../support/elements/clue/GraphToolTile'
import ImageToolTile from '../support/elements/clue/ImageToolTile'
import DrawToolTile from '../support/elements/clue/DrawToolTile'
import TextToolTile from '../support/elements/clue/TextToolTile'
import TableToolTile from '../support/elements/clue/TableToolTile'
import Header from '../support/elements/common/Header';

let clueCanvas = new ClueCanvas;
let header = new Header;
let graphToolTile = new GraphToolTile;
let imageToolTile = new ImageToolTile;
let drawToolTile = new DrawToolTile;
let textToolTile = new TextToolTile;
let tableToolTile = new TableToolTile;

async function selectRandomTile(){
    let tiles = ['text','table','geometry','image','drawing']
    // let random = Math.floor(Math.random() * Math.floor(tiles.length - 1))
    let random = getRandomNumber(tiles.length - 1)

    console.log(tiles[random])
    return (tiles[random]);
}

async function getRandomNumber(max){
    let number =  Math.floor(Math.random() * Math.floor(max))
    return number
}

async function getTilesArray(){
    let i=0;
    let tilesToAdd=[];

    for (i;i<3;i++) {
        tilesToAdd.push(selectRandomTile())
    }
    return tilesToAdd;
}

async function addToTile(tile, user, title){
    switch(tile){
        case 'text':
            textToolTile.enterText('User is '+user+' in Investigation '+title);
            break;
        case 'geomtery':
            graphToolTile.addPointToGraph(getRandomNumber(15),getRandomNumber(15))
            graphToolTile.addPointToGraph(getRandomNumber(15),getRandomNumber(15))
            graphToolTile.addPointToGraph(getRandomNumber(15),getRandomNumber(15))
             break;
        case 'table':
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
            break;
        case 'image':
            let images = ['fan.png','graph.png','image.png','folder.png','chair.png']
            clueCanvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            cy.uploadFile(imageToolTile.imageChooseFileButton(), images[getRandomNumber(images.length-1)], 'image/png')
            cy.wait(3000);
            break;
        case 'drawing':
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
            break;    
    }
    return "done!"  
}

async function getInvestigationTitle(){
    await clueCanvas.getInvestigationCanvasTitle().should('exist');
    return clueCanvas.getInvestigationCanvasTitle().then(($title)=>{
        return $title.text()
    })
}

function getUsername(){
    return header.getUserName().then(($user)=>{
        return $user.text();
    })
}

function getStudentRunLink(studentUid, offeringId) {
    return "https://learn.staging.concord.org/users/" + studentUid + "/portal/offerings/" + offeringId + ".run_resource_html"
}

async function populateDocument(student) {
    let tilesToAdd= await getTilesArray();
    let title = await getInvestigationTitle();
    console.log('tilesToAdd: '+tilesToAdd)
    for (var tile in tilesToAdd) {
        clueCanvas.addTile(tile);
        await addToTile(tile, student, title);
    }
    return "done!"
}

context("CLUE Dashboard Data Setup", () => {
    // const offeringId = 40557;
    const offeringId = 1219;
    // const portalProductionUrl = "https://learn.concord.org/"
    const portalStagingUrl = "https://learn.staging.concord.org"
    // let tilesToAdd=getTilesArray();

    it("Visits student CLUE documents and adds data", () => {
        cy.fixture("staging-student-ids.json").as("studentUids")
        cy.get("@studentUids").then((studentUids) => {
            let index=1, group=1;
            for (var student in studentUids) {
                cy.loginStaging(studentUids[student].username, "tardis")
                //get student url for clue launch
                let studentClueLaunchUrl = getStudentRunLink(studentUids[student].uid, offeringId)
                cy.visit(studentClueLaunchUrl)
                cy.wait(3000)
                cy.waitForSpinner();

                if(((index==1)||(index%5)==0)) { //select a group from the dropdown
                    cy.get('select').select('Group ' + group);
                    cy.get('[value="Create Group"]').click();
                    cy.wait(1000); 
                }
                else { //select an existing group
                    cy.get('.groups > .group-list > .group').contains(group).click();
                }
                //fill document
                cy.populateDocument(studentUids[student].username)

                //log out
                cy.visit(portalStagingUrl)
                cy.get(".portal-pages-main-nav-contain").find("a.log-in").click({force:true})
                index++
                if((index%5)==0) {group++}
            }
        })
    })

})
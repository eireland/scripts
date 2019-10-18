// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import Header from './elements/common/Header';
import ClueCanvas from '../support/elements/clue/cCanvas'
import GraphToolTile from '../support/elements/clue/GraphToolTile'
import ImageToolTile from '../support/elements/clue/ImageToolTile'
import DrawToolTile from '../support/elements/clue/DrawToolTile'
import TextToolTile from '../support/elements/clue/TextToolTile'
import TableToolTile from '../support/elements/clue/TableToolTile'

let clueCanvas = new ClueCanvas;
let header = new Header;
let graphToolTile = new GraphToolTile;
let imageToolTile = new ImageToolTile;
let drawToolTile = new DrawToolTile;
let textToolTile = new TextToolTile;
let tableToolTile = new TableToolTile;

Cypress.Commands.add("setupGroup", (students, group) => {
    const baseUrl = `${Cypress.config("baseUrl")}`;

    let qaClass = 10,
        problem = 2.3;
    let teacher = 10;

    // let header = new Header
 
    let i=0, j=0;

    for (i=0;i<students.length;i++) {
        cy.wait(2000)
        cy.visit(baseUrl+'?appMode=qa&qaGroup='+group+'&fakeClass='+qaClass+'&fakeUser=student:'+students[i]+'&problem='+problem);
        cy.wait(3000);
    }
    //verify Group num and there are 4 students in the group
    header.getGroupName().should('contain','Group '+group);
    for (j=0; j<students.length; j++) {
        header.getGroupMembers().find('div.member').should('contain','S'+students[j])
    }
});

Cypress.Commands.add("uploadFile",(selector, filename, type="")=>{
    // cy.fixture(filename).as("image");

    return cy.get(selector).then(subject => {
        return cy.fixture(filename,'base64')
            .then(Cypress.Blob.base64StringToBlob)
        // From Cypress document: https://docs.cypress.io/api/utilities/blob.html#Examples
        // return Cypress.Blob.base64StringToBlob(cy.fixture(filename), "image/png")
            .then((blob) => {
            const el = subject[0]
            const nameSegments = filename.split('/')
            const name = nameSegments[nameSegments.length - 1]
            const testFile = new File([blob], name, { type });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(testFile);
            el.files = dataTransfer.files;
            return subject;
        })
    })
})
Cypress.Commands.add("clearQAData", (data)=>{ //clears data from Firebase (currently data='all' is the only one supported)
    const baseUrl = `${Cypress.config("baseUrl")}`;
    if (data=='all') {
        cy.visit(baseUrl + '?appMode=qa&qaClear=' + data + '&fakeClass=1&fakeUser=student:1');
        cy.wait(3000);
        cy.get('span').should('contain','QA Cleared: OK');
    }
})
Cypress.Commands.add("login", (baseUrl, testTeacher) => {
    cy.visit(baseUrl + "/users/sign_in")
    cy.get("input#user_login").type(testTeacher.username)
    cy.get("input#user_password").type(testTeacher.password)
    cy.get("form").submit()
})
Cypress.Commands.add("addAClass", (baseUrl, testClass) => {
    cy.visit(baseUrl + "/portal/classes/new")
    cy.get("input#portal_clazz_name").type(testClass.className)
    cy.get("input#portal_clazz_class_word").type(testClass.classWord)
    cy.get("select#portal_clazz_school").select(testClass.schoolName)
    cy.get("input#portal_clazz_grade_levels_12").check().should("be.checked")
    cy.get("form.new_portal_clazz").submit()
})
Cypress.Commands.add("assignActivityToClass", (baseUrl, testClass) => {
    cy.visit(baseUrl + "/search")
    cy.get(".search-form__field").find("input").type(testClass.activityName)
    cy.get("input#go-button").click({force:true})
    cy.get("input#include_contributed").check().should("be.checked")
    cy.contains("Assign to a Class").click({force:true})
    cy.get(".content").find("input").check()
    cy.get('td > .button').click({force:true})
    cy.get('.buttons_container > .button').click({force:true})
})
Cypress.Commands.add("registerStudents", (baseUrl, testClass) => {
    cy.visit(baseUrl + "/recent_activity")
    cy.get("div#clazzes_nav").contains("Classes").click({ force: true }).then(() => {
        cy.contains(testClass.className).click({force:true})
        cy.get("li.open--1fle3cuw").eq(1).within(() => {
            cy.contains("Student Roster").click({force:true})
        })
    })
    cy.wait(1000)
    cy.contains("Register & Add New Student").click({ force: true })
        for (let i = 0; i < testClass.studentTotal; i++) {
            let index = i + 1;
            cy.get("form.new_portal_student").find('input#user_first_name').type(testClass.firstName)
            cy.get("form.new_portal_student").find('input#user_last_name').type(testClass.lastName + index.toString())
            cy.get("form.new_portal_student").find('input#user_password').type(testClass.password)
            cy.get("form.new_portal_student").find('input#user_password_confirmation').type(testClass.password)
            cy.get("form.new_portal_student").find('.create_button > .pie').click({force:true})
            cy.wait(1000)
            cy.waitForSpinnerStudentRegistration()
            cy.get(".ui-window").within(() => {
                cy.contains("Cancel").click({force:true})
            })
        }
        cy.get(".ui-window").within(() => {
            cy.get("input.pie").eq(1).click({force:true})
        })
})
Cypress.Commands.add("waitForSpinnerStudentRegistration", () => {
    cy.get('.waiting', { timeout: 60000 }).should('not.exist')
})

Cypress.Commands.add("populateDocument", (username) => {
    let tilesToAdd =  getTilesArray();
    let title =  getInvestigationTitle();
    cy.log('tilesToAdd: '+tilesToAdd)
    cy.log('title: '+title)
    tilesToAdd.forEach((tile)=>{
        clueCanvas.addTile(tile);
        cy.wait(1500);
        addToTile(tile, username, title);
    })
})
function selectRandomTile(){
    let tiles = ['text','table','geometry','image','drawing']
    // let random = Math.floor(Math.random() * Math.floor(tiles.length - 1))
    let random = getRandomNumber(tiles.length - 1)

    console.log(tiles[random])
    return (tiles[random]);
}

function getRandomNumber(max){
    let number =  Math.floor(Math.random() * Math.floor(max))
    return number
}

function getTilesArray(){
    let i=0;
    let tilesToAdd=[];

    for (i;i<3;i++) {
        tilesToAdd.push(selectRandomTile())
    }
    return tilesToAdd;
}

function addToTile(tile, user, title){
    switch(tile){
        case 'text':
            textToolTile.enterText('User is '+user);
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

// Cypress.Commands.add("getInvestigationTitle", () => {
function getInvestigationTitle(){
    cy.waitForSpinner()
    clueCanvas.getInvestigationCanvasTitle().should('exist');
    return clueCanvas.getInvestigationCanvasTitle().text();
}

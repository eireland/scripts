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

Cypress.Commands.add("setupGroup", (students, group) => {
    const baseUrl = `${Cypress.config("baseUrl")}`;

    let qaClass = 10,
        problem = 2.3;
    let teacher = 10;

    let header = new Header
 
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
Cypress.Commands.add("waitForSpinner", () => {
    cy.get('.progress', { timeout: 60000 }).should('not.exist')
})

Cypress.Commands.add("loginStaging", (username, password) => {
    cy.visit("https://learn.concord.org/users/sign_in")
    cy.get("input#user_login").type(username)
    cy.get("input#user_password").type(password)
    cy.get("form").submit()
})

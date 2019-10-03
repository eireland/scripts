context("Testing Login for Portal", () => {

    const portalProductionUrl = "https://learn.concord.org";
    const portalStagingUrl = "https://learn.staging.concord.org"

    const testTeacher = {
        username : "clueteachertest",
        password : "password"
    }

    const testClass = {
        className: "CLUE A",
        classWord: "cluetestingclasswordA",
        schoolName : "Framingham H S",
        activityName: "Testing CLUE Activity",
        studentTotal : "24",
        firstName : "a",
        lastName : "",
        password : "password"
    }

    it("logs into portal and adds a class", () => {
        cy.login(portalProductionUrl, testTeacher)
        cy.addAClass(portalProductionUrl, testClass)
    })

    it("logs into portal and adds students to an existing class", () => {
        cy.login(portalProductionUrl, testTeacher)
        cy.registerStudents(portalProductionUrl, testClass)
    })

    it.only("logs into portal and adds activity to an existing class", () => {
        cy.login(portalProductionUrl, testTeacher)
        cy.assignActivityToClass(portalProductionUrl, testClass)
    })
    
    it("logs in and sets up class with students and activity", () => {
        cy.login(portalProductionUrl, testTeacher)
        cy.addAClass(portalProductionUrl, testClass)
        cy.registerStudents(portalProductionUrl, testClass)
        cy.assignActivityToClass(portalProductionUrl, testClass)
    })

})
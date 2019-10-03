context("CLUE Dashboard Data Setup", () => {
    const offeringId = 40557;
    const portalProductionUrl = "https://learn.concord.org/"

    function getStudentRunLink(studentUid, offeringId) {
        return "https://learn.concord.org/users/" + studentUid + "/portal/offerings/" + offeringId + ".run_resource_html"
    }

    it("Visits student CLUE documents and adds data", () => {
        cy.fixture("student-ids.json").as("studentUids")
        cy.get("@studentUids").then((studentUids) => {
            for (var student in studentUids) {
                cy.login(studentUids[student].username, "password")
                //get student url for clue launch
                let studentClueLaunchUrl = getStudentRunLink(studentUids[student].uid, offeringId)
                cy.visit(studentClueLaunchUrl)
                cy.wait(3000)
                cy.waitForSpinner()
                //log out
                cy.visit(portalProductionUrl)
                cy.get(".portal-pages-main-nav-contain").find("a.log-in").click({force:true})
            }
        })
    })

})
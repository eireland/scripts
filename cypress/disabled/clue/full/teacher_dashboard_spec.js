import TeacherDashboard from "../../../support/elements/TeacherDashboard";
import Canvas from "../../../support/elements/Canvas";


context("Teacher Space", () => {

    let dashboard = new TeacherDashboard();
    let canvas = new Canvas();

    const qaParam = '?appMode=demo&demoName=Test%20Group&fakeClass=1&fakeUser=teacher:1&unit=s+s&problem=1.1'

    const clueInfo = {
        investigationTitle : "Enlarging and Reducing Shapes",
        group1Name : "Group 1",
        groupTotal : 13,
        classTotal : 1,
        testProblemTitle : "1.1 Solving a Mystery",
        problemTotal : 16,
        teacherName : "Teacher 1"
    }

    before(() => {
        cy.visit('https://collaborative-learning.concord.org/branch/master/' + qaParam)
    })

    context('Teacher Dashboard View',()=>{
        describe ('UI visibility',()=>{
            it.only('verify header elements',()=>{
                dashboard.getInvestigationTitle().should('be.visible').and('contain', clueInfo.investigationTitle)
                dashboard.getProblemDropdown().should('be.visible')
                dashboard.getProblemList().should('not.exist')
                dashboard.getClassList().should('not.exist')
                dashboard.getProblemDropdown().click({force:true})
                dashboard.getProblemList().children().should('have.length', clueInfo.problemTotal)
                dashboard.getProblemDropdown().click({force:true})
                dashboard.getDashboardViewToggle().should('be.visible').and('have.class', 'bp3-active')
                dashboard.getWorkspaceViewToggle().should('be.visible').and('not.have.class', 'bp3-active')
                dashboard.getUserName().should('be.visible').and('contain', clueInfo.teacherName)
                dashboard.getClassDropdown().should('be.visible')
                dashboard.getClassList().should('not.exist')
                dashboard.getClassDropdown().click({force:true})
                dashboard.getClassList().children().should('have.length', clueInfo.classTotal)
            })
            it('verify six-pack elements',() => {
                dashboard.getSixPackView().should('exist').and('be.visible')
                dashboard.getGroupName().eq(0).should('contain', clueInfo.group1Name)
                dashboard.getSixPackView().then(() => {
                    dashboard.getFourPackViews().should('have.length', clueInfo.groupTotal)
                })
            })
        })
        describe('Header element functionality tests',()=>{
            it('verify switching problems changes title displayed on the far left',()=>{
                dashboard.getProblemDropdown().click({force:true}).then(() => {
                    dashboard.getProblemList().contains(clueInfo.testProblemTitle).click({force:true})
                })
                dashboard.getInvestigationTitle().should('contain', clueInfo.testProblemTitle)
            })
            it('verify switching problems changes six pack content',()=>{

            })
            it('verify dashboard/workspace switch changes workspace view',()=>{
                dashboard.getDashboardViewToggle().should('be.visible').and('have.class', 'bp3-active')
                dashboard.getSingleWorkspace().should('not.be.visible')
                dashboard.getWorkspaceViewToggle().should('be.visible').and('not.have.class', 'bp3-active').click({force:true})
                dashboard.getWorkspaceViewToggle().should('have.class', 'bp3-active')
                dashboard.getSingleWorkspace().should('be.visible')
                dashboard.getDashboardViewToggle().click({force:true})
            })
            it('verify selected class is shown next to the teacher name',()=>{
                dashboard.getClassDropdown().click({force:true})
                dashboard.getClassList().contains(testClassTitle).click({force:true})
                dashboard.getClassList().should('not.be.visible')
            })
            it('verify switching classes changes six pack content',()=>{
    
            })
        })
        describe('6-pack view functionality',()=>{
            it('verify each canvas in a 4 up view is read only',()=>{
                cy.get('.text-tool').each(($el, index, $list) => {
                    $el.should('have.class', 'read-only').click({force:true})
                })
                /**
                 * Get canvas'
                 * For each canvas
                 *  find('.text-tool').should('have.class', 'read-only')
                 */
            })
            it('verify clicking a students canvas in 4 up view zooms into students canvas', () => {
                /**
                 * get 4 up view and assert number of elements
                 * Click on student canvas
                 * Assert that number of elements is now only 1. Others are no longer visible. Maybe they still 'exist'
                 */
            })
        })
        describe('6-pack view live updates',()=>{
            it('verify 4up views in 6 pack are updated as student makes changes',()=>{
                /**
                 * Check for current existing element in student canvas
                 * Visit student link
                 * Do some work as student
                 * Verify that there were changes/new elements
                 */
            })
        })    
    })
    
    context('Teacher Workspace',()=>{
        describe ('UI visibility',()=>{
            it('verify right nav elements',()=>{
                //Supports will be labeled with <Investigation#>.<Prob#> <Section Name> Support <n>
                const testSupportLabel = '1.2 Now What Do You Know? Support 2'

                dashboard.getWorkspaceViewToggle().click({force:true})
                dashboard.getRightNavMyWorkTab().should('be.visible').and('have.attr', 'aria-selected', false)
                dashboard.getRightNavClassWorkTab().should('be.visible').and('have.attr', 'aria-selected', false)
                dashboard.getRightNavSupportsTab().should('be.visible').and('have.attr', 'aria-selected', false).click({force:true})
                dashboard.getRightNavSupportsTab().should('have.attr', 'aria-selected', true)
                //verify Supports tab is blue
                //Sections are 'Just In Time' for current problem only, Teacher Supports
            })
        })
        describe('teacher functionalities',()=>{ 
            it('verify document curation',()=>{//adding a star to a student document

            })
            it('verify supports functionality',()=>{//may need to break down even further between class, group, and student
           
            })
        })
    })
    context ("Teacher Supports in student's view",()=>{
        describe("test visibility of teacher supports in student's workspace",()=>{
            it('verify support thumbnails are visible',()=>{

            })
            it('verify supports open in 2up view righthand workspace',()=>{
                
            })
        })
    })
})
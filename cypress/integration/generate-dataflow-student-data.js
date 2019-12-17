import dfBlock from "../support/elements/dataflow/dfBlock"
import dfCanvas from "../support/elements/dataflow/dfCanvas"
import dfControlPanels from "../support/elements/dataflow/dfControlPanels"
import dfHeader from "../support/elements/dataflow/dfHeader"
import Canvas from "../support/elements/common/Canvas"

const block = new dfBlock;
const dfcanvas = new dfCanvas;
const controlPanel = new dfControlPanels;
const header = new dfHeader;
const canvas = new Canvas;

const url = "https://collaborative-learning.concord.org/branch/dataflow/";
const queryParam = "?appMode=demo&demoName=LIGHTHOUSETEST&fakeClass=1&fakeUser=student:"

context("Add Dataflow student content", () => {
    it("Visits student Dataflow documents and adds data", () => {
        let studentNum=0;
        for(studentNum=14; studentNum<=20; studentNum++){
            cy.visit(url+queryParam+studentNum);
            cy.wait(3000)
            cy.waitForSpinner();
            header.switchWorkspace('Workspace');
            cy.wait(1000);

            //will need to pick a sensor after
            dfcanvas.openBlock('Sensor');
            dfcanvas.openBlock('Data Storage');
            block.moveBlock('data-storage',0,255,5)
            block.connectBlocks('sensor',0,'data-storage',0)
            
            //will turn relay on when sine wave is greater than 0
            dfcanvas.openBlock('Number');
            dfcanvas.openBlock('Generator');
            dfcanvas.openBlock('Logic');
            block.moveBlock('logic',0,255,255);
            dfcanvas.openBlock('Relay');
            block.moveBlock('relay',0,510,255);
            block.connectBlocks('generator',0,'logic',0)
            block.connectBlocks('number',0,'logic',1)
            block.connectBlocks('logic',0,'relay',0)
        }
    })
})


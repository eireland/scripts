import LeftNav from '../../../support/elements/LeftNav'
import Canvas from '../../../support/elements/Canvas'
import GraphToolTile from '../../../support/elements/GraphToolTile'
import RightNav from '../../../support/elements/RightNav'

const leftNav = new LeftNav;
const canvas = new Canvas;
const rightNav = new RightNav;
const graphToolTile = new GraphToolTile;

let doc1='2.1 Drawing Wumps', doc2='Points', doc3='Polygon', doc4='Movable Line'

context('Test graph tool functionalities', function(){
    describe('adding points and polygons to a graph', function(){
        it('will add a point to the origin', function(){ //this will be in doc1
            canvas.addGraphTile();
            graphToolTile.addPointToGraph(0,0);
            graphToolTile.getGraphPointCoordinates().should('contain', '(0, 0)');
        });
        it('will add points to a graph', function(){ //this will be in doc2
            canvas.createNewDocument(doc2)
            cy.wait(2000)
            canvas.addGraphTile();
            graphToolTile.getGraphTile().last().click();
            graphToolTile.addPointToGraph(5,5);
            graphToolTile.addPointToGraph(10,5);
            graphToolTile.addPointToGraph(10,10);
            graphToolTile.getGraphPoint().should('have.length',4)
        });
        it('will add a polygon to a graph', function(){ //This will be in doc3
            canvas.createNewDocument(doc3)
            cy.wait(2000)
            canvas.addGraphTile();
            graphToolTile.getGraphTile().last().click();
            graphToolTile.addPointToGraph(3.2,4);
            graphToolTile.addPointToGraph(7.4, 2.2);
            graphToolTile.addPointToGraph(13.2,5);
            graphToolTile.addPointToGraph(13.2,5);
            graphToolTile.getGraphPoint().last().click({force:true}).click({force:true});
            graphToolTile.getGraphPolygon().should('exist');
        });
    });

    describe('restore points to canvas', function(){
        // TODO: Issues with coordinates
        it('will verify restore of point at origin', function(){
            rightNav.openRightNavTab('my-work');
            rightNav.openSection('my-work','investigations');
            rightNav.openCanvasItem('my-work', 'investigations', doc1) //reopen doc1
            graphToolTile.getGraphPointCoordinates().should('contain', '(0, 0)');
        });
        it('will verify restore of multiple points', function(){
            rightNav.openRightNavTab('my-work');
            rightNav.openSection('my-work','workspaces');
            rightNav.openCanvasItem('my-work','workspaces', doc2) //reopen doc2
            graphToolTile.getGraphPoint().should('have.length',4);
        });
        it('will verify restore of polygon', function(){
            rightNav.openRightNavTab('my-work');
            rightNav.openCanvasItem('my-work','workspaces', doc3) //reopen doc3
            graphToolTile.getGraphPolygon().should('exist');
        });
    });

    context('Graph Toolbar', function(){
        describe('interact with points and polygons', function(){
            it.skip('will select a point', function(){ // TODO: For some reason, text is (0, 0)
                rightNav.openRightNavTab('my-work');
                rightNav.openCanvasItem('my-work','workspaces', doc2)
                graphToolTile.selectGraphPoint(10,10);
                graphToolTile.hoverGraphPoint(10,10);
                cy.get('.single-workspace .geometry-tool .JXGinfobox').invoke('text').should('contain','(10, 10)')
            });
            // it('will drag a point to a new location', function(){
            //
            // });
            // it('will copy and paste a point', function(){ //cannot send keyboard commands to non-text fields
            //
            // });
            // TODO: Failed in the overall tests run
            it('will show and hide angles to a polygon', function(){
                let numAngles=1;
                rightNav.openRightNavTab('my-work');
                rightNav.openCanvasItem('my-work','workspaces', doc3)
                graphToolTile.selectGraphPoint(13.2,5);
                graphToolTile.showAngle();
                graphToolTile.getAngleAdornment().should('exist').and('have.length',numAngles)
                graphToolTile.selectGraphPoint(7.4, 2.2);
                graphToolTile.showAngle();
                graphToolTile.getAngleAdornment().should('exist').and('have.length',numAngles+1)
                graphToolTile.selectGraphPoint(3.2,4);
                graphToolTile.showAngle();
                graphToolTile.getAngleAdornment().should('exist').and('have.length',numAngles+2)
                graphToolTile.selectGraphPoint(13.2,5);
                graphToolTile.hideAngle();
                graphToolTile.getAngleAdornment().should('exist').and('have.length',numAngles+1)
                graphToolTile.selectGraphPoint(7.4, 2.2);
                graphToolTile.hideAngle();
                graphToolTile.getAngleAdornment().should('exist').and('have.length',numAngles)
                graphToolTile.selectGraphPoint(3.2,4);
                graphToolTile.hideAngle();
                graphToolTile.getAngleAdornment().should('not.exist')


                //Add the angles angle for the restore test later
                graphToolTile.selectGraphPoint(13.2,5);
                graphToolTile.showAngle();
                graphToolTile.selectGraphPoint(7.4, 2.2);
                graphToolTile.showAngle();
                graphToolTile.selectGraphPoint(3.2,4);
                graphToolTile.showAngle();
            });
            it('verify rotate tool is visible when polygon is selected', function(){
                rightNav.openRightNavTab('my-work');
                rightNav.openCanvasItem('my-work','workspaces', doc3)
                graphToolTile.getGraphPolygon().click({force:true});
                graphToolTile.getRotateTool().should('be.visible');
            });
            it('will rotate a polygon', function(){
                //not sure how to verify the rotation
                graphToolTile.getRotateTool()
                    .trigger('mousedown')
                    .trigger('dragstart')
                    .trigger('mousemove',18, 73, {force:true})
                    .trigger('dragend')
                    .trigger('drop')
                    .trigger('mouseup');
                //TODO verify points are in new location
            });
            // TODO: trigger() failing due to two elements present
            it.skip('verify drag a polygon to a new location', function(){ //TODO still not working - drag and drop issues
                graphToolTile.getGraphPolygon()
                    .trigger('mousedown', {force:true})
                    .trigger('dragstart', {force:true})
                    // .trigger('drag',100,150,{force:true})
                    .trigger('mousedrag', 100, 150, {force:true})
                    .trigger('dragend', 100, 150, {force:true})
                    .trigger('drop', 100, 150,{force:true})
                    .trigger('mouseup',{force:true});
            });
            it('verify copy and paste a polygon', function(){
                graphToolTile.getGraphPolygon();
                graphToolTile.copyGraphElement();
                graphToolTile.getGraphPolygon().should('have.length',2)
                graphToolTile.getAngleAdornment().should('have.length',6)
                graphToolTile.getGraphPoint().should('have.length',8)
            });
            it('verify restore changes to a graph', function(){
                rightNav.openRightNavTab('my-work');
                rightNav.openCanvasItem('my-work','workspaces', doc3)
                graphToolTile.getAngleAdornment().should('exist').and('have.length',6)
            })
        });

        describe('delete points and polygons', function(){
            // TODO: Incorrect length found
            it('verify delete points with delete tool', function(){ //current behavior of text deletes the entire graph tool tile. Point selection has to be forced
                let basePointCount = 4; // number of points already in doc2

                rightNav.openRightNavTab('my-work');
                rightNav.openCanvasItem('my-work','workspaces', doc2)
                graphToolTile.selectGraphPoint(10,10);
                canvas.getDeleteTool().click();
                graphToolTile.getGraphPoint().should('have.length', basePointCount -1)
                graphToolTile.selectGraphPoint(10,5);
                canvas.getDeleteTool().click();
                graphToolTile.getGraphPoint().should('have.length', basePointCount -2)
                graphToolTile.selectGraphPoint(5,5);
                canvas.getDeleteTool().click();
                graphToolTile.getGraphPoint().should('have.length', basePointCount-3)
            })
            it('verify delete polygon',()=>{
                rightNav.openRightNavTab('my-work');
                rightNav.openCanvasItem('my-work','workspaces', doc3)
                
                graphToolTile.getGraphPolygon().last().click();
                graphToolTile.deleteGraphElement();
                graphToolTile.getGraphPolygon().should('have.length',1)
            })
            it('verify delete points alters polygon',()=>{
                let basePointCount = 4, baseAngleCount=3; // number of points already in doc

                graphToolTile.selectGraphPoint(13.2,5);
                graphToolTile.getAngleAdornment().should('have.length',baseAngleCount);
                canvas.getDeleteTool().click();
                graphToolTile.getGraphPoint().should('have.length', basePointCount -1)
                graphToolTile.selectGraphPoint(7.4, 2.2);
                // graphToolTile.getGraphPoint().last().click();
                canvas.getDeleteTool().click();
                graphToolTile.getGraphPoint().should('have.length', basePointCount -2)
                graphToolTile.selectGraphPoint(3.2,4);
                canvas.getDeleteTool().click();
                graphToolTile.getGraphPoint().should('have.length', basePointCount-3)
            })
        })

        describe('movable line tests',()=>{    
            it('verify add a movable line', function(){
                canvas.createNewDocument(doc4)
                canvas.addGraphTile();
                graphToolTile.addMovableLine();

            });
            it.skip('verify move the movable line', function () {

            });
            it.skip('verify rotate the movable line', function () {

            });
            it.skip('verify movable line equation edit', function () {

            });
        });
    })

});

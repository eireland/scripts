import RightNav from '../../../support/elements/RightNav'
import Canvas from '../../../support/elements/Canvas'
import ImageToolTile from '../../../support/elements/ImageToolTile'

const canvas = new Canvas;
const imageToolTile = new ImageToolTile;
const rightNav = new RightNav;
const baseUrl = `${Cypress.config("baseUrl")}`;

let userCanvas = 'Uploaded Images'
context('Test image functionalities', function(){
    describe('upload image from URL', function(){
        it('will load an png from a URL', function(){
            const imageFileURL = 'https://codap.concord.org/~eireland/image.png';
            canvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            imageToolTile.getImageURLTextField().last().click().type(imageFileURL);
            cy.get(imageToolTile.imageChooseFileButton()).last().click();
            imageToolTile.getImageToolImage().last().should('have.css', 'background-image','url("'+imageFileURL+'")');
        });
        it('will load an jpg from a URL', function(){
            const imageFileURL = 'https://codap.concord.org/~eireland/case_image.jpg';
            canvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            imageToolTile.getImageURLTextField().last().click().type(imageFileURL);
            cy.get(imageToolTile.imageChooseFileButton()).last().click();
            cy.wait(1000);
            imageToolTile.getImageToolImage().last().should('have.css', 'background-image','url("'+imageFileURL+'")');
        });
        it('will load an gif from a URL', function(){
            const imageFileURL = 'https://codap.concord.org/~eireland/model_image.gif';
            canvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            imageToolTile.getImageURLTextField().last().click().type(imageFileURL);
            cy.get(imageToolTile.imageChooseFileButton()).last().click();
            cy.wait(1000);
            imageToolTile.getImageToolImage().last().should('have.css', 'background-image','url("'+imageFileURL+'")');
        });
    })
    describe('upload image from user computer',()=>{   
        before(()=>{ //create a new doc so that save and restore can e tested
            canvas.createNewDocument(userCanvas) 
            cy.wait(2000)
        })
        it('will upload png file from user computer', function(){
            const imageFilePath='image.png';
            canvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            // cy.get(imageToolTile.imageChooseFileButton()).first().click();
            cy.uploadFile(imageToolTile.imageChooseFileButton(), imageFilePath, 'image/png')
            cy.wait(2000)
        })

        it('will upload jpg file from user computer', function(){
            const imageFilePath='case_image.jpg';
            canvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            // cy.get(imageToolTile.imageChooseFileButton()).first().click();
            cy.uploadFile(imageToolTile.imageChooseFileButton(), imageFilePath, 'image/jpg');
            cy.wait(2000)
        })

        it('will upload gif file from user computer', function(){
            const imageFilePath='model_image.gif';
            canvas.addImageTile();
            imageToolTile.getImageToolControl().last().click();
            // cy.get(imageToolTile.imageChooseFileButton()).first().click();
            cy.uploadFile(imageToolTile.imageChooseFileButton(), imageFilePath, 'image/gif')
            cy.wait(2000)
        })
    });
    describe('restore of images', function(){
        before(()=>{ //reopen the first canvas
            rightNav.openRightNavTab('my-work');
            rightNav.openSection('my-work','investigations')
            rightNav.openCanvasItem('my-work','investigations', '2.1 Drawing Wumps')
            cy.wait(5000)
        })
        it('verify restore of all images that were added by URL', function(){
            const imageFileURL = ['https://codap.concord.org/~eireland/image.png', 'https://codap.concord.org/~eireland/case_image.jpg', 'https://codap.concord.org/~eireland/model_image.gif'];
            imageToolTile.getImageToolImage().each(($images, index, $list)=>{
                expect($list).to.have.length(3);
                expect($images).to.have.css('background-image').and.contains(imageFileURL[index]);
            });
        });
        it('open the user created document from above',()=>{
            rightNav.openRightNavTab('my-work');
            rightNav.openSection('my-work','workspaces')
            rightNav.openCanvasItem('my-work','workspaces', userCanvas)
        })
        it('verify restore of all  images that were added by upload', function(){
            const imageFilePath=['image.png','case_image.jpg','model_image.gif'];
            imageToolTile.getImageToolImage().each(($images, index, $list)=>{
                expect($list).to.have.length(3);
                expect($images).to.have.css('background-image').and.contains('url("blob:'+baseUrl);
            })
        })
    });
});

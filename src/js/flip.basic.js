/**
 * Basic Flip Book
 * Expects an element with a single child node that holds all the pages
 * 
 * <div id="bookElement">
 *     <div>
 *          <div>Page 1 Content</div>
 *          <div>Page 2 Content</div>
 *          <div>Page 3 Content</div>
 *     </div>
 * </div>
 */
var flip = window.flip;

flip.basic = function( bookElement )
{
    // In case a string ID is passed
    bookElement = typeof bookElement === 'string' ? document.getElementById(bookElement) : bookElement;

    if( bookElement.childNodes.length !== 1 && console.err ){
        console.err( 'Expects a single child that contains all the page elements' );
        return;
    }

    var pages = [],
        pageElem,
        bookPagesParent,
        onShowComplete;

    bookPagesParent = bookElement.firstElementChild;

    onShowComplete = function( pageIndex ) {
        if( pages[ pageIndex + 1 ] ) {
            flip.prime( pages[ pageIndex + 1 ] );
        }
    };

    // Remove the single child element and create pages
    bookPagesParent.parentNode.removeChild(bookPagesParent);
    while( bookPagesParent.firstElementChild ) {
        pageElem = bookPagesParent.firstElementChild;
        pageElem.parentNode.removeChild( pageElem );
        pages.push( flip.page.create( pageElem, { onShowComplete : onShowComplete } ));
    }

    // Show the first page
    flip.init( bookElement, pages[ 0 ] );
};



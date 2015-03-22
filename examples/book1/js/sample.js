/*jslint bitwise: true, browser: true, continue: false, devel: true, plusplus: true, regexp: true, sloppy: true, white: true */
/*global flip, document, window */

/* Copyright Terrill Dent, 2013 */

var sample = window.sample || {};

sample = (function()
{
        // Objects
    var pages = [],
        
        // Functions
        currentIndex = 0,
        handleShowComplete,
        createPage,
        remove;


    remove = function( elem ){
        if( elem && elem.parentNode ){
            elem.parentNode.removeChild( elem );
        }
    };

    handleShowComplete = function( index )
    {
        return function() {
            currentIndex = index;

            if( pages[ index + 1 ] ) {
                flip.prime( pages[ index + 1 ] );
            }
        };
    };

    createPage = function( div, index )
    {
        remove( div );
        return flip.page.create( div, { onShowComplete : handleShowComplete( index ) } );
    };
    
    return {

        init : function()
        {
            var bookPagesParent = document.getElementById('book-pages'),
                pageIndex = 0;

            remove( bookPagesParent );
            while( bookPagesParent.firstElementChild ) {
                pages.push( createPage( bookPagesParent.firstElementChild, pageIndex ) );
                pageIndex++;
            }

            //console.log( pages );

            // Show the first page
            flip.init( document.getElementById('all-pages'), 
                       document.getElementById('flip-pages'), 
                       document.getElementById('shadow'), 
                       pages[ 0 ] );
        }
    };
}());

window.addEventListener( 'DOMContentLoaded', sample.init, true );


/*jslint bitwise: true, browser: true, continue: false, devel: true, plusplus: true, regexp: true, sloppy: true, white: true */
/*global flip, $, document, window */

/* Copyright Terrill Dent, 2013 */

flip.page = (function() 
{
    var pagePrototype = {
    
        refreshFlip : function()
        {
            var that = this,
                oldFlip = that.flip,
                oldFlipParent;

            if( flip.transitioning ) {
                if( !that.dirty ) {
                    that.dirty = true;
                    flip.addListener( that );
                }
                return;
            }

            if( that.dirty ){
                that.dirty = false;
                flip.removeListener( that );
            }

            that.flip = that.html.cloneNode( true );
                
            if( oldFlip && oldFlip.parentNode ) {
                oldFlipParent = oldFlip.parentNode;
                if( oldFlipParent ) {
                    oldFlipParent.removeChild( oldFlip );
                    oldFlipParent.appendChild( that.flip );
                }
            }
        },

        globalTransitionEnd : function() {
            this.refreshFlip();
        },

        // When a transition is started
        onObscure : function()
        {
            var that = this;
            if( that.listener.onObscure ) {
                that.listener.onObscure();
            }
        },

        // When the page is the topmost
        onStay : function()
        {
            var that = this;
            if( that.listener.onStay ) {
                that.listener.onStay();
            }
        },

        // When the page is originally shown
        onShowComplete : function()
        {
            var that = this;
            if( that.listener.onShowComplete ) {
                that.listener.onShowComplete();
            }
            that.onStay();
        }
    };
    
    return {

        // Create a custom page using provided HTML
        create : function( html, listener ) {
            
            var draggable = Object.create( pagePrototype );
    
            draggable.listener = listener;
            draggable.html = document.createElement( 'div' );
            draggable.html.className = 'page-wrapper';
            draggable.html.appendChild( html );
            draggable.flip = draggable.html.cloneNode( true );

            return draggable;
        }
    };
}());


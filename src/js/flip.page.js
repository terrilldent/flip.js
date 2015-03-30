
var flip = window.flip;

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
        onShowComplete : function(index)
        {
            var that = this;
            if( that.listener.onShowComplete ) {
                that.listener.onShowComplete(index);
            }
            that.onStay();
        }
    };
    
    return {

        // Create a custom page using provided HTML
        create : function( pageContentElem, listener ) {
            
            var draggable = Object.create( pagePrototype );
        
            flip.addClass( pageContentElem, 'flip-page' );

            draggable.listener = listener;
            draggable.html = flip.createElem( 'div', {className: 'flip-page-wrapper'});
            draggable.html.appendChild( pageContentElem );
            draggable.flip = draggable.html.cloneNode( true );

            return draggable;
        }
    };
}());


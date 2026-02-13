var flip = window.flip;

flip.draggable = (function() 
{
    var draggablePrototype = {
            
        getPagePosition : function( e )
        {
            e = e.touches ? e.touches[0] : e;
            return { x : e.pageX , y : e.pageY };
        },

        getInputType : function( e )
        {
            return e.type.indexOf( 'touch' ) === 0 ? 'touch' : 'mouse';
        },
            
        handleEvent : function( e )
        {
            var that = this;
            
            switch( e.type ) {
                case 'touchstart': // Fall through
                case 'mousedown':
                    that.handleTouchStart( e );
                    break;
                case 'touchmove': // Fall through
                case 'mousemove':
                    that.handleTouchMove( e );
                    break;
                case 'touchend': // Fall through
                case 'mouseup':
                    that.handleTouchEnd( e );
                    break;
                case 'mouseout':
                    // This filters mouseout events to only those when you leave the window
                    if( !e.relatedTarget || e.relatedTarget.tagName === 'HTML' ){
                        that.handleTouchEnd( e );
                    }
                    break;
            }
        },
        
        reset : function()
        {
            var that = this;
            
            document.body.removeEventListener( 'touchmove', that, false );
            document.body.removeEventListener( 'touchend',  that,  false );
            
            if( flip.simulateTouch ) {
                document.body.removeEventListener( 'mousemove', that, false );
                document.body.removeEventListener( 'mouseup',   that,  false );
                window.removeEventListener( 'mouseout', that, false );
            }
            
            if( !that.curXY  ) {
                return;
            }
            
            if( that.listener.reset ) {
                that.listener.reset();
            }

            that.curXY = null;
        },
            
        handleTouchStart : function( e )
        {
            var that = this;

            // Ignore synthetic mouse events that follow touch interactions.
            if( that.lastTouchTime && that.getInputType( e ) === 'mouse' && Date.now() - that.lastTouchTime < 500 ) {
                return;
            }
            
            // TODO: add condition if target is an input, then return.
            
            e.preventDefault();
            
            if( that.curXY && e.touches && e.touches.length > 1 ) {
                that.reset();
                return;
            }
            
            if( ( e.touches && e.touches.length ) > 1 ||
                (e.which && e.which === 3) || (e.button && e.button === 2) ) {
                // Ignore right click and second finger press
                return;
            }

            that.activeInputType = that.getInputType( e );
            
            that.outsideBuffer = false;
            that.curXY = null;
            
            document.body.addEventListener( 'touchmove', that, false );
            document.body.addEventListener( 'touchend', that, false );
            
            if( flip.simulateTouch ) {
                document.body.addEventListener( 'mousemove', that, false );
                document.body.addEventListener( 'mouseup', that, false );
                window.addEventListener( 'mouseout', that, false );
            }
            
            that.startXY = that.getPagePosition( e );
            that.curXY = that.startXY;
            if( that.listener.start ) {
                that.listener.start();
            }
        },
        
        // This is bound to the document.body
        handleTouchMove : function( e )
        {
            var that = this,
                deltaY,
                deltaX;

            if( that.activeInputType && that.getInputType( e ) !== that.activeInputType ) {
                return;
            }
            
            e.preventDefault();
            
            if( e.touches && e.touches.length > 1 ) {
                that.reset();
                return;
            }
                        
            // Check if we are outside the horizontal scroll buffer
            that.curXY = that.getPagePosition( e );
            deltaX = that.startXY.x - that.curXY.x;
            deltaY = that.startXY.y - that.curXY.y;
            
            if( that.buffer ) {
                if( !that.outsideBuffer && Math.abs( deltaX ) >= that.buffer ) {
                        
                    if( that.listener.breach ) {
                        that.listener.breach( deltaX, deltaY );
                    }

                    that.outsideBuffer = true;
                }
            }
            
            if( !that.buffer || that.outsideBuffer ) {
                if( that.listener.move ) {
                    that.listener.move();
                }
            }
        },
          
        handleTouchEnd : function( e )
        {
            var that = this;

            if( that.activeInputType && that.getInputType( e ) !== that.activeInputType ) {
                return;
            }

            if( that.getInputType( e ) === 'touch' ) {
                that.lastTouchTime = Date.now();
            }

            e.preventDefault();
            that.reset();
            that.activeInputType = null;
        }
    };
    
    return {
        
        create : function( target, listener, buffer ) {
            
            var draggable = Object.create( draggablePrototype );
            
            draggable.target = target;
            draggable.listener = listener;
            draggable.buffer = buffer;
            draggable.activeInputType = null;
            draggable.lastTouchTime = 0;

            target.addEventListener( 'touchstart', draggable, false );
            if( flip.simulateTouch ) {
                target.addEventListener( 'mousedown', draggable, false );
            }
            return draggable;
        }
    };
}());


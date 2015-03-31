flip.js
=======

Mobile first, flat style JavaScript Page Flip Library. Cross browser support, and works on most desktop browsers.

This library creates a page folding effect using a flat visual style. No curling effects are used, and shadows are kept to a minimum. 

![](http://www.terrill.ca/flipjs/img/flip-example@0.5x.png)

Examples
--------

[Basic Example](http://www.terrill.ca/flipjs/basic-book/)

[Advanced Example](http://www.terrill.ca/illustrations/)


Basic Example
-----------

First import the CSS and JS files from the '/dist' directory into your project.

The easiest way to get started is by calling `flip.basic(element)`. It expects the provided element to have a single child containing all the pages in the book, as in the example below. 


```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <link rel='stylesheet' type='text/css' media='all' href='flip.css'>
</head>
<body>

<div id="book" class="flip-book">
    <div>
        <div><h1>Title Page</h1></div>
        <div><h2>Page Two Content</h2></div>
        <div>Page Three Content</div>
        <div>Page Four Content</div>
        <div>Page Fiv Content</div>
    </div>
</div>

<script type='text/javascript' src='flip-v1.0.0.js'></script>
<script type='text/javascript'>
    window.addEventListener( 'DOMContentLoaded', function(){
        flip.basic( 'book' );
    }, true );
</script>
</body>
</html>
```


Advanced Usage
--------------

Advanced usage example coming soon.


API
===


### flip.basic(bookElement) 
Creates a flip book using the contents of the provided element. Expects provided element to have a single child element that contains all the pages. This is wrapper, and the easiest way to build a book. No need to look at the rest of the API if this works for you.
 
---------------------------------------

### flip.init(bookElement, firstPage) 
Creates a flip book using the contents of the provided element. Expects provided element to have a single child element that contains all the pages. `firstPage` is an object created by flip.page.create().
 
---------------------------------------

### flip.prime(nextPage) 
Creates a flip book using the contents of the provided element. Expects provided element to have a single child element that contains all the pages.
 
---------------------------------------

### flip.getStackHeight() 
Returns the height of the page stack

---------------------------------------

### flip.push(page) 
Push a new page immediately onto the book, and transition it into view.

---------------------------------------

### flip.pop() 
Go back one page and pop the current page off the stack.

---------------------------------------

### flip.close() 
Close the book and return to the first page, removing all other pages from stack.

---------------------------------------

### flip.page.create(pageContentElement, listener) 
Creates a page for the book with the provided content element. The optional page event listener parameter expects an object with functions named the following (all optional): 

    ```
    {
        onObscure:      function(){},
        onStay:         function(){},
        onShowComplete: function(index){}
    }
    ``` 
 
---------------------------------------


Limitations
-----------

Making changes to page content during a transition is not handled very well. The library creates a shadow copy of the original HTML for use while flipping. Modifying the page during transit can result in a partial rendering. It's best to modify pages after flipping is complete. You can register a callback for the end of various animation events with the API.


Build Instructions
------------------

You can build the library yourself using npm and grunt. Clone the repo, then run the `grunt` command from the root directory. It will produce output in the `/dist/` folder.

```
npm install
grunt
```

Looking for a JavaScript Wizard?
------------------

This library was made by Terrill Dent. [I am available for hire, or consulting](http://www.terrill.ca/about/). Get in touch and let's work together!


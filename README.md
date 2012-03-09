Scrollbars for MooTools 1.4
==========

Scrollbars can be used to replace native browser scrollbars with HTML elements. This way you can give it any style you like.

Requirements
------

* MooTools 1.4 >

Usage
-----
Include MooTools together with scrollbars.min.js within your head tags.

	<head>
		<script src="/mootools/mootools-core-1.4.5.js"></script>
		<script src="/scrollbars/scrollbars.min.js"></script>
	</head>


Create the elements you want to add custom scrollbars to.

    <div class="scroll-it" style="height: 150px">
		<p>A lot of text...</p>
	</div>


Add the following script somewhere in your document to make it work.

    <script type="text/javascript">
		window.addEvent('domready', function(){
			$$('.scroll-it').scrollbars();
		});
	</script>

For more examples visit the example page http://ceramedia.github.com/Scrollbars

License
-------

Copyright (c) 2011-2012 Ceramedia, <http://ceramedia.net/>

MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

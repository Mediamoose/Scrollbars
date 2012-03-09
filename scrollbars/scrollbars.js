/**
 * @package		Scrollbars
 *
 * @author 		Sven
 * @since 		01-03-2012
 * @version 	0.5.0
 *
 * This package requires MooTools 1.4 >
 *
 * @license The MIT License
 *
 * Copyright (c) 2011-2012 Ceramedia, <http://ceramedia.nl/>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var ScrollBars = ScrollBars || new Class({

	version: '0.5.0',

	Implements: [Options],

	element: null,

	timer: null,

	fadeTimer: null,

	nativeScrollBarSize: 0,

	options: {
		scrollBarSize: 15,
		scrollStep: 20,
		addBar: true,
		barOverContent: false,
		fade: false
	},

	/**
	 * Initialization
	 */
	initialize: function(element, options) {
		// Element to be scrolled
		this.element = document.id(element);

		// Add styles element to document
		if (!Browser.ie && !$('webkit_hide_scrollbars'))
			document.id(document.body).adopt(new Element('style',{'id':'webkit_hide_scrollbars','text':'.scrollbar-content::-webkit-scrollbar{visibility:hidden;} .scrollbar-content .scrollbar-content-wrapper:after{clear: both;}'}));

		// Detect scrollbar size
		var scrollBarSize = new Element('div',{styles:{'height':'100px','overflow':'scroll'}}).adopt(
			new Element('div',{styles:{'height':'200px'}})
		);
		document.id(document.body).adopt(scrollBarSize);

		this.nativeScrollBarSize = scrollBarSize.getSize().x - scrollBarSize.getScrollSize().x;

		scrollBarSize.destroy();

		//set options
		this.setOptions(options);

		// Add scrollbar
		this.injectHTML();

		// Add fade stuff
		if (this.options.fade)
			this._addFade(this.options.fade);

		// Update sizes
		this.updateScrollBars();

		window.addEvent('load',this.updateScrollBars.bind(this));
		window.addEvent('resize',this.updateScrollBars.bind(this));
	},

	/**
	 * Inject base HTML
	 */
	injectHTML: function(){
		if (this.element.getElement('ul.scrollbar'))
			this.element.getElements('ul.scrollbar').destroy();

		// Default styles
		this.element.setStyles({
			'overflow':'hidden',
			'position':'relative'
		});

		// Set content
		var scrollHtml = new Element('div',{
			'class':'scrollbar-content',
			'styles':{
				'padding-right':this.nativeScrollBarSize,
				'padding-bottom':this.nativeScrollBarSize,
				'overflow':'scroll',
				'height':'100%',
				'width':'100%'
			}
		}).adopt(
			new Element('div',{
				'class':'scrollbar-content-wrapper',
				'styles':{
					'float': 'left',
					'margin-right': -this.nativeScrollBarSize,
					'margin-bottom': -this.nativeScrollBarSize + (Browser.ie ? this.options.scrollBarSize : 0)
				}
			}).adopt(this.element.childNodes)
		);

		this.element.adopt(scrollHtml);

		this.element.setStyle('height',
			this.element.style.height ?
			this.element.getStyle('height') :
			this.element.getElement('.scrollbar-content').getSize().y + (this.options.scrollBarSize-this.nativeScrollBarSize)
		);

		// Build scroll bar vertical
		this.element.grab(
			new Element('ul',{
				'class':'scrollbar vertical',
				'styles':{
					'position':'absolute',
					'right':0,
					'width': this.options.scrollBarSize
				}
			}).adopt([
				new Element('li',{
					'class':'scroll bar-wrapper',
					'styles':{
						'position':'absolute',
						'top':0,
						'bottom':0,
						'min-width':this.options.scrollBarSize
					}
				}),
				new Element('li',{
					'class':'scroll up',
					'text':'up',
					'styles':{
						'position':'absolute',
						'top':0,
						'min-height':this.options.scrollBarSize,
						'min-width':this.options.scrollBarSize
					}
				}).addEvents({
					'mousedown': function(){
						this.element.getElement('.scrollbar-content').scrollTo(
							this.element.getElement('.scrollbar-content').getScroll().x,
							this.element.getElement('.scrollbar-content').getScroll().y - this.options.scrollStep
						);
						this.timer = this.element.getElement('ul.scrollbar.vertical li.scroll.up').fireEvent.delay(100,this.element.getElement('ul.scrollbar.vertical li.scroll.up'),'mousedown');
					}.bind(this),
					'mouseup': function(){
						clearTimeout(this.timer);
					}.bind(this),
					'mouseleave': function(){
						clearTimeout(this.timer);
					}.bind(this)
				}),
				new Element('li',{
					'class':'scroll down',
					'text':'down',
					'styles':{
						'position':'absolute',
						'bottom':0,
						'min-height':this.options.scrollBarSize,
						'min-width':this.options.scrollBarSize
					}
				}).addEvents({
					'mousedown': function(){
						this.element.getElement('.scrollbar-content').scrollTo(
							this.element.getElement('.scrollbar-content').getScroll().x,
							this.element.getElement('.scrollbar-content').getScroll().y + this.options.scrollStep
						);
						this.timer = this.element.getElement('ul.scrollbar.vertical li.scroll.down').fireEvent.delay(100,this.element.getElement('ul.scrollbar.vertical li.scroll.down'),'mousedown');
					}.bind(this),
					'mouseup': function(){
						clearTimeout(this.timer);
					}.bind(this),
					'mouseleave': function(){
						clearTimeout(this.timer);
					}.bind(this)
				})
			]),
			'top'
		);
		// Build scroll bar horizontal
		this.element.grab(
			new Element('ul',{
				'class':'scrollbar horizontal',
				'styles':{
					'position':'absolute',
					'bottom':0,
					'height': this.options.scrollBarSize
				}
			}).adopt([
				new Element('li',{
					'class':'scroll bar-wrapper',
					'styles':{
						'position':'absolute',
						'left':0,
						'right':0,
						'min-height':this.options.scrollBarSize
					}
				}),
				new Element('li',{
					'class':'scroll left',
					'text':'left',
					'styles':{
						'position':'absolute',
						'left':0,
						'min-height':this.options.scrollBarSize,
						'min-width':this.options.scrollBarSize
					}
				}).addEvents({
					'mousedown': function(){
						this.element.getElement('.scrollbar-content').scrollTo(
							this.element.getElement('.scrollbar-content').getScroll().x - this.options.scrollStep,
							this.element.getElement('.scrollbar-content').getScroll().y
						);
						this.timer = this.element.getElement('ul.scrollbar.horizontal li.scroll.left').fireEvent.delay(100,this.element.getElement('ul.scrollbar.horizontal li.scroll.left'),'mousedown');
					}.bind(this),
					'mouseup': function(){
						clearTimeout(this.timer);
					}.bind(this),
					'mouseleave': function(){
						clearTimeout(this.timer);
					}.bind(this)
				}),
				new Element('li',{
					'class':'scroll right',
					'text':'right',
					'styles':{
						'position':'absolute',
						'right':0,
						'min-height':this.options.scrollBarSize,
						'min-width':this.options.scrollBarSize
					}
				}).addEvents({
					'mousedown': function(){
						this.element.getElement('.scrollbar-content').scrollTo(
							this.element.getElement('.scrollbar-content').getScroll().x + this.options.scrollStep,
							this.element.getElement('.scrollbar-content').getScroll().y
						);
						this.timer = this.element.getElement('ul.scrollbar.horizontal li.scroll.right').fireEvent.delay(100,this.element.getElement('ul.scrollbar.horizontal li.scroll.right'),'mousedown');
					}.bind(this),
					'mouseup': function(){
						clearTimeout(this.timer);
					}.bind(this),
					'mouseleave': function(){
						clearTimeout(this.timer);
					}.bind(this)
				})
			]),
			'top'
		);

		// Add drag bar
		if (this.options.addBar)
			this.injectBarHtml();
	},

	/**
	 * Injects HTML for scroll distance bar
	 */
	injectBarHtml: function(){
		var barWrapperVer  = this.element.getElement('ul.scrollbar.vertical li.scroll.bar-wrapper');
		var barWrapperHor  = this.element.getElement('ul.scrollbar.horizontal li.scroll.bar-wrapper');

		// Add bar elements
		barWrapperVer.adopt(
			new Element('div',{
				'class':'scroll bar',
				'styles': {
					'position':'absolute',
					'width':'100%'
				}
			})
		);
		barWrapperHor.adopt(
			new Element('div',{
				'class':'scroll bar',
				'styles': {
					'position':'absolute',
					'height':'100%'
				}
			})
		);

		var mouseMoveEventVer = null;
		var mouseMoveEventHor = null;

		barWrapperVer.addEvents({
			'mousedown': function(event){
				this.element.getElement('.scrollbar-content').scrollTo(
					this.element.getElement('.scrollbar-content').getScroll().x,
					this.element.getElement('.scrollbar-content').getScrollSize().y * ((event.page.y - (barWrapperVer.getElement('.scroll.bar').getSize().y/2) - barWrapperVer.getPosition().y) / barWrapperVer.getSize().y)
				);
				document.id(document.body).addEvent('mousemove',mouseMoveEventVer=function(event){
					event.stop();
					this.element.getElement('.scrollbar-content').scrollTo(
						this.element.getElement('.scrollbar-content').getScroll().x,
						this.element.getElement('.scrollbar-content').getScrollSize().y * ((event.page.y - (barWrapperVer.getElement('.scroll.bar').getSize().y/2) - barWrapperVer.getPosition().y) / barWrapperVer.getSize().y)
					);
					document.id(document.body).focus();
				}.bind(this));
				// prevent selecting
				return false;
			}.bind(this)
		});
		barWrapperHor.addEvents({
			'mousedown': function(event){
				this.element.getElement('.scrollbar-content').scrollTo(
					this.element.getElement('.scrollbar-content').getScrollSize().x * ((event.page.x - (barWrapperHor.getElement('.scroll.bar').getSize().x/2) - barWrapperHor.getPosition().x) / barWrapperHor.getSize().x),
					this.element.getElement('.scrollbar-content').getScroll().y
				);
				document.id(document.body).addEvent('mousemove',mouseMoveEventHor=function(event){
					event.stop();
					this.element.getElement('.scrollbar-content').scrollTo(
						this.element.getElement('.scrollbar-content').getScrollSize().x * ((event.page.x - (barWrapperHor.getElement('.scroll.bar').getSize().x/2) - barWrapperHor.getPosition().x) / barWrapperHor.getSize().x),
						this.element.getElement('.scrollbar-content').getScroll().y
					);
					document.id(document.body).focus();
				}.bind(this));
				// prevent selecting
				return false;
			}.bind(this)
		});

		// Remove move events
		document.id(document.body).addEvent('mouseup',function(){
			document.id(document.body).removeEvent('mousemove',mouseMoveEventVer);
			document.id(document.body).removeEvent('mousemove',mouseMoveEventHor);
		});

		this.element.getElement('.scrollbar-content').addEvent('scroll',function(){
			var scrollBarDistanceVer = Math.floor((this.element.getElement('.scrollbar-content').getScroll().y / this.element.getElement('.scrollbar-content').getScrollSize().y) * 100),
				scrollBarDistanceHor = Math.floor((this.element.getElement('.scrollbar-content').getScroll().x / this.element.getElement('.scrollbar-content').getScrollSize().x) * 100),
				scrollBarVer = this.element.getElement('ul.scrollbar.vertical li.scroll.bar-wrapper .scroll.bar'),
				scrollBarHor = this.element.getElement('ul.scrollbar.horizontal li.scroll.bar-wrapper .scroll.bar');

			// End of scroll switch to bottom
			if (!Browser.ie && scrollBarVer.getStyle('height').toInt() + scrollBarDistanceVer >= 100) {
				scrollBarVer.setStyle('bottom', '0');
				scrollBarVer.setStyle('top', 'auto');
			}
			else {
				scrollBarVer.setStyle('top', scrollBarDistanceVer + '%');
				scrollBarVer.setStyle('bottom', 'auto');
			}
			// End of scroll switch to right
			if (!Browser.ie && scrollBarHor.getStyle('width').toInt() + scrollBarDistanceHor >= 100) {
				scrollBarHor.setStyle('right', '0');
				scrollBarHor.setStyle('left', 'auto');
			}
			else {
				scrollBarHor.setStyle('left', scrollBarDistanceHor + '%');
				scrollBarHor.setStyle('right', 'auto');
			}
		}.bind(this)).fireEvent('scroll');
	},

	/**
	 * Updates all sizes, distances, etc.
	 */
	updateScrollBars: function(){

		var contentElement = this.element.getElement('.scrollbar-content');

		this.element.getElement('ul.scrollbar.vertical').setStyle('height', this.element.getSize().y - this.element.getElement('ul.scrollbar.horizontal').getSize().y);
		this.element.getElement('ul.scrollbar.horizontal').setStyle('width', this.element.getSize().x - this.element.getElement('ul.scrollbar.vertical').getSize().x);

		// Add bar
		if (this.options.addBar) {
			var barWrapperVer  = this.element.getElement('ul.scrollbar.vertical li.scroll.bar-wrapper').setStyles({'top':0,'bottom':0});
			var barWrapperHor  = this.element.getElement('ul.scrollbar.horizontal li.scroll.bar-wrapper').setStyles({'left':0,'right':0});

			// Top Vertical
			if (this.element.getElement('li.scroll.up').getPosition(this.element).y<contentElement.getSize().y/2)
				barWrapperVer.setStyle('top', barWrapperVer.getStyle('top').toInt() + this.element.getElement('li.scroll.up').getSize().y);
			if (this.element.getElement('li.scroll.down').getPosition(this.element).y<contentElement.getSize().y/2)
				barWrapperVer.setStyle('top', barWrapperVer.getStyle('top').toInt() + this.element.getElement('li.scroll.down').getSize().y);

			// Bottom Vertical
			if (this.element.getElement('li.scroll.up').getPosition(this.element).y>contentElement.getSize().y/2)
				barWrapperVer.setStyle('bottom', barWrapperVer.getStyle('bottom').toInt() + this.element.getElement('li.scroll.up').getSize().y);
			if (this.element.getElement('li.scroll.down').getPosition(this.element).y>contentElement.getSize().y/2)
				barWrapperVer.setStyle('bottom', barWrapperVer.getStyle('bottom').toInt() + this.element.getElement('li.scroll.down').getSize().y);

			// Left Horizontal
			if (this.element.getElement('li.scroll.left').getPosition(this.element).x<contentElement.getSize().x/2)
				barWrapperHor.setStyle('left', barWrapperHor.getStyle('left').toInt() + this.element.getElement('li.scroll.left').getSize().x);
			if (this.element.getElement('li.scroll.right').getPosition(this.element).x<contentElement.getSize().x/2)
				barWrapperHor.setStyle('left', barWrapperHor.getStyle('left').toInt() + this.element.getElement('li.scroll.right').getSize().x);

			// Bottom Vertical
			if (this.element.getElement('li.scroll.left').getPosition(this.element).x>contentElement.getSize().x/2)
				barWrapperHor.setStyle('right', barWrapperHor.getStyle('right').toInt() + this.element.getElement('li.scroll.left').getSize().x);
			if (this.element.getElement('li.scroll.right').getPosition(this.element).x>contentElement.getSize().x/2)
				barWrapperHor.setStyle('right', barWrapperHor.getStyle('right').toInt() + this.element.getElement('li.scroll.right').getSize().x);

			// Vert
			barWrapperVer.getElement('.scroll.bar').setStyle(
				'height', Math.min(100,Math.ceil(((contentElement.getSize().y-(Browser.ie ? this.nativeScrollBarSize : 0)) / contentElement.getScrollSize().y) * 100)) + '%'
			);
			// Hor
			barWrapperHor.getElement('.scroll.bar').setStyle(
				'width', Math.min(100,Math.ceil(((contentElement.getSize().x-(Browser.ie ? this.nativeScrollBarSize : 0)) / contentElement.getScrollSize().x) * 100)) + '%'
			);

			// In case we're resizing
			contentElement.fireEvent('scroll');
		}

		// Inactive check
		if (!this.element.getElement('ul.scrollbar.vertical').hasClass('inactive') && contentElement.getScrollSize().y<=contentElement.getSize().y)
			this.element.getElement('ul.scrollbar.vertical').addClass('inactive');
		else if(contentElement.getScrollSize().y>contentElement.getSize().y)
			this.element.getElement('ul.scrollbar.vertical').removeClass('inactive');

		// Check horizontal
		if (!this.element.getElement('ul.scrollbar.horizontal').hasClass('inactive') && contentElement.getScrollSize().x<=contentElement.getSize().x)
			this.element.getElement('ul.scrollbar.horizontal').addClass('inactive');
		else if(contentElement.getScrollSize().x>contentElement.getSize().x)
			this.element.getElement('ul.scrollbar.horizontal').removeClass('inactive');

		// Fix content distance from scrollbars
		if (this.options.barOverContent || (this.element.getElement('ul.scrollbar.vertical').getStyle('display')=='none' && this.element.getElement('ul.scrollbar.horizontal').getStyle('display')=='none')) {
			contentElement.getElement('.scrollbar-content-wrapper').setStyles({
				'padding-right': 0,
				'padding-bottom': 0
			});
		}
		else if (this.element.getElement('ul.scrollbar.vertical').getStyle('display')=='none') {
			contentElement.getElement('.scrollbar-content-wrapper').setStyles({
				'padding-right': 0,
				'padding-bottom': this.options.scrollBarSize
			});
		}
		else if (this.element.getElement('ul.scrollbar.horizontal').getStyle('display')=='none') {
			contentElement.getElement('.scrollbar-content-wrapper').setStyles({
				'padding-right': this.options.scrollBarSize,
				'padding-bottom': 0
			});
		}
		else {
			contentElement.getElement('.scrollbar-content-wrapper').setStyles({
				'padding-right': this.options.scrollBarSize,
				'padding-bottom': this.options.scrollBarSize
			});
		}
	},

	/**
	 * Fade scrollbars
	 * @param fade options of fade function http://mootools.net/docs/core/Fx/Fx.Tween#Element:fade
	 */
	fadeBars: function(fade){
		this.element.getChildren('ul.scrollbar').each(function(ele){
			ele.getElements('li').each(function(eli){
				eli.get('tween').stop();
				eli.fade(fade);
			});
		});
	},

	/**
	 * Add automatic fading scrollbars
	 * @param fadeTime
	 * @private
	 */
	_addFade: function(fadeTime){
		fadeTime = !parseInt(fadeTime)||parseInt(fadeTime)<500 ? 500 : parseInt(fadeTime);

		// Show on mouse movement
		this.element.addEvent('mousemove',function(){
			clearTimeout(this.fadeTimer);
			this.fadeBars('show');
			this.fadeTimer = this.fadeBars.delay(fadeTime, this, 'out');
		}.bind(this));

		this.element.getElement('.scrollbar-content').addEvent('scroll',function(){
			clearTimeout(this.fadeTimer);
			this.fadeBars('show');
			this.fadeTimer = this.fadeBars.delay(fadeTime, this, 'out');
		}.bind(this));

		// First time fading
		this.fadeTimer = this.fadeBars.delay(fadeTime, this, 'out');
	}

});

// Implement in to element
Element.implement({
	scrollbars: function(options){
		return this.store('scrollbars', new ScrollBars(this, options));
	}
});
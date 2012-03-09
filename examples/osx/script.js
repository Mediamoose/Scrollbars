/* Scrollbars 0.5.1 */
window.addEvent('domready',function(){
	$$('.scrollbars.osx').scrollbars({
		scrollBarSize:10,
		barOverContent:true,
		fade:true
	});
});
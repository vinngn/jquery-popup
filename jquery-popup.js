/* 
 * JQuery CustomPopup Plugin
 * @author: vnguyen
 */

(function($){
	var _jquery_popup = {};
	
	//Attach this new method to jQuery
	$.fn.popOut = function(options) {
		
		var defaults = {
			internalCall: false
		};
		
		var options = $.extend(defaults, options);
		
		return this.each(function() {
			var obj = $(this);
			if(obj.hasClass('popup-content')){
				var wrapper = obj.parents('.custompopup');
				var fade_bg = wrapper.prev();
				
				// remove class from the obj
				obj.removeClass('popup-content');
				
				// remove the blurry background if exists
				_jquery_popup.fadeBackground && fade_bg && fade_bg.remove();
				
				// remove the popup wrapper
				wrapper.remove();
				
				// append to the content to body
				obj.appendTo('body').hide();
				
				// trigger popOut event
				!options.internalCall && obj.trigger("popOut");
			}
		});
	};
	
	$.fn.popIn = function(options) {
		
		var defaults = {
			useCloseImage: true, // set false when dont want the close image to be displayed
			autoCloseTime: 0, // the popup will automatically close in autoCloseTime milisecond
			fadeBackground: true, // a layer to cover the content in the background, when set background in inactive
			moveTop: 0, // number of pixel to move top compare to default location (center of the screen)
			miniPadding: false // default padding is 20 px, minipadding 10px
		};
		
		var options = $.extend(defaults, options);
		_jquery_popup.fadeBackground = options.fadeBackground;
		
		//Iterate over the current set of matched elements
		return this.each(function() {
			
			//code to be inserted here
			var obj = $(this).addClass('popup-content');
			var wrapper = $('<div class="custompopup"></div>');
			var proto = "https:" == document.location.protocol? "https" : "http";
			var close_image = $('<a href="#" class="close_image"><img src="' + proto + '://images.shaklee.com/public/us/en/assets/images/design/close.png" title="Close" alt="Close"/></a>');
			var fade_bg = $('<div class="custompopup-fade"></div>');
			
			// popOut all currently open popups
			$('a.close_image').next().popOut({internalCall : true});
			
			// display close image base on setting
			!options.useCloseImage && close_image.css('display', 'none');
			
			// Blurry background base on setting
			options.fadeBackground && fade_bg.appendTo('body');
			
			// add close image and obj to popup
			wrapper.append(close_image).append(obj);
			wrapper.appendTo('body');
			obj.fadeIn();
			
			obj.css("max-height", $(window).height() - 60);
			obj.css("overflow-y", "auto");
			
			if(options.padding){
				wrapper.css("padding", options.padding);
			}
			
			if(options.miniPadding){
				wrapper.css({"padding": "10px"});
				obj.css({"margin-top": "-2px"});
				close_image.css({"margin-top": "-28px", "margin-right": "-28px"});
			}
			
			// calculate wrapper location
			if(options.top){
				wrapper.css("top", options.top);
			}// if the previous popup height is less than 470px 
			else if(wrapper.outerHeight() < 470){
				wrapper.css("top", (($(window).height() - wrapper.outerHeight()) / 2) - 40);
			}
			else{
				wrapper.css("top", (($(window).height() - wrapper.outerHeight()) / 2) - options.moveTop);
			}
			
			if(options.left){
				wrapper.css("left", options.left);
			}
			else{
				wrapper.css("left", (($(window).width() - wrapper.outerWidth()) / 2));
			}
			
			options['background-color'] && wrapper.css("background-color", options['background-color']);
			options['position'] && wrapper.css("position", options['position']);
			$.browser.msie && jQuery.browser.version <= 8 && wrapper.addClass('border-ie8');
			
			// check out the magic :)
			wrapper.fadeIn();
			
			// Automatically popOut if autoCloseTime set
			options.autoCloseTime > 0 && setTimeout(function() { obj.popOut(); }, options.autoCloseTime);
			
			// trigger popIn event
			obj.trigger("popIn");
		});
	};

})(jQuery);





/*
 * The below code not belong to the plugin
 * Just some saving time coding shortcuts which use the above plugin
 * @author: vnguyen
 */

//automatically call popIn on link with .trigger_popup and rel property set
$('a.triggerPopIn').live('click', function(e){
	var div_id = $(this).attr('rel');
	div_id && $.trim(div_id).length > 0 && $('#' + div_id).popIn(); 
	e.preventDefault();
});

//add event handler to the click event of the close image
//whenever this image get click, close the popup
$('a.close_image').live('click', function(e){
	$('a.close_image').next().popOut();
	e.preventDefault();
});

$('a.triggerPopOut, button.triggerPopOut, input.triggerPopOut').live('click', function(e){
	popAllOut();
	e.preventDefault();
});

function popAllOut(){
	$('a.close_image').trigger('click');
}


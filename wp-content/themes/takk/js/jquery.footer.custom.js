/*-----------------------------------------------------------------------------------*/
/*	Custom Footer JS
/*-----------------------------------------------------------------------------------*/

(function($) {
	"use strict";
	
	// Capture page elements
	var $pageContent = $('.main-content');
	var $portfolioContainer = $('#isotope-trigger');	
	var $headerBgObj = $('.bg-cover-img');
	var $shifterElements = $('.shifter-page, .shifter-header');
	var $shifterOverlay = $('.shifter-overlay');
	var $shifterClose = $('.shifter-close');
	var $shifterHandleMain = $('#header-bg-check .shifter-handle');
	var $shifterNav = $('.shifter-navigation');
	var $scrollArrow = $('.scroll-container');
	var $headHesive = $('.headhesive');
	var $window = $(window);	
	var isIE9 = $('html').hasClass('ie9');
	
	
	/*-----------------------------------------------------------------------------------*/
	/*	Background Check
	/*-----------------------------------------------------------------------------------*/
	
	if ($headerBgObj.length) { 
		// Specific images
		BackgroundCheck.init({
			targets: '.bg-cover-targets, .footer-menu li, .contact-info li, .copyright small',
			images: '.bg-cover-images'
		});
		
	}
	
	
	/*-----------------------------------------------------------------------------------*/
	/*	Prevent document scrolling, when the menu is open, 
	/*	but enable scrolling within the menu itself.
	/*-----------------------------------------------------------------------------------*/
	
	$("#scroller").bind('touchstart', function(ev) {
	    if ($(this).scrollTop() === 0) $(this).scrollTop(1);
	    var scrollTop = document.getElementById('scroller').scrollTop;
	    var scrollHeight = document.getElementById('scroller').scrollHeight;
	    var offsetHeight = document.getElementById('scroller').offsetHeight;
	    var contentHeight = scrollHeight - offsetHeight;
	    if (contentHeight == scrollTop) $(this).scrollTop(scrollTop-1);
	});
	
	
	/*-----------------------------------------------------------------------------------*/
	/*	Scroll Arrow
	/*-----------------------------------------------------------------------------------*/
	
	$('.scroll-indicator').click(function() {	
		$('html, body').animate({
		    scrollTop: $('.main-container').offset().top - $headHesive.outerHeight(true) - 20
		}, 800);
	});
	
	$(window).scroll(function() {
		if($(window).scrollTop() >= 300) {
			$scrollArrow.fadeOut(500);
		}
		else {
			$scrollArrow.fadeIn(500);
		}
	});
		
	
	/*-----------------------------------------------------------------------------------*/
	/*	Cover Image
	/*-----------------------------------------------------------------------------------*/ 
	
	if ($headerBgObj.length && !Modernizr.mq("screen and (max-device-width: 1024px)")) { 
		$window.bind('scroll', function() {
			var yPos = -($window.scrollTop() / $headerBgObj.data('speed'));
			var coords = '50% '+ yPos + 'px'; // Put together our final background position
			$headerBgObj.css({ backgroundPosition: coords }); // Move the background
		});
	}

	
	/*-----------------------------------------------------------------------------------*/
	/*	Menu Handle
	/*-----------------------------------------------------------------------------------*/
	
	function openMenu(e) {
		e.gesture.srcEvent.preventDefault(); // Prevent the hammer.js click from being triggered on the close button, which sits behind the tapped menu icon
		$('body, html').toggleClass('shifter-open');
		
		if($('body').hasClass('shifter-open') || $('html').hasClass('shifter-open')) {
			// Show the menu 
			$shifterOverlay.show();
			$shifterElements.transition({ x: -280 }, 300, 'ease');
			$shifterNav.transition({ x: 0, opacity: 1 }, 300, 'ease');
			$('.headhesive').transition({ x: -280 }, 300, 'ease');
			$shifterOverlay.transition({ x: -280, opacity: 1 }, 300, 'ease');
		}
		else {
			closeMenu();
		}	
	}
	
	function closeMenu() {
		$shifterElements.transition({ x: 0 }, 300, 'ease');
		$shifterNav.transition({ x: 280, opacity: 0 }, 300, 'ease');
		$('.headhesive').transition({ x: 0 }, 300, 'ease');	
		$shifterOverlay.transition({ x: 0, opacity: 0 }, 300, 'ease', function () { $(this).hide(); });	
		
		$('body, html').removeClass('shifter-open');
		$shifterNav.find("input").trigger("blur"); // Close mobile keyboard if open	
	}
	
	$shifterHandleMain.hammer().bind('tap', openMenu).transition({ opacity: 1 }, 200); // Initialize the main navigation trigger
	$shifterOverlay.click(closeMenu);
	$shifterClose.click(closeMenu);
	
	
	/*-----------------------------------------------------------------------------------*/
	/*	Fixed header
	/*-----------------------------------------------------------------------------------*/
	
	if ($shifterNav.length) { 
		var offsetSelector = '';
		
		offsetSelector = ($headerBgObj.length) ? '.main-container' : '.main-content';
		
		// Options
		var options = {
		    offset: offsetSelector,
		    onInit: function() {
			    $('.headhesive').css({ translate: '0px, -100%' });
				$('.headhesive .shifter-handle').hammer().bind('tap', openMenu).transition({ opacity: 1 }, 200); // Initialize the navigation trigger found in the fixed bar
		    },
		    onStick: function() {
				$('.headhesive').transition({ y: 0 }, 220, 'ease-in-out'); // Show the fixed header	
		    },
			onUnstick: function() {
				$('.headhesive').transition({ y: '-100%' }, 220, 'ease-in-out'); // Hide the fixed header
			},
		}
		
		// Create a new instance of Headhesive and pass in some options
		var header = new Headhesive('.header', options);
	}
	
	
	/*-----------------------------------------------------------------------------------*/
	/*	Isotope
	/*-----------------------------------------------------------------------------------*/
	
	/* filter items with an isotope filter animation, when one of the filter links is clicked */
	if($('body').hasClass('page-template-template-portfolio-php')) {
		$('.portfolio-filter a').click(function(e) {	
			e.preventDefault();
			
			var selector = $(this).attr('data-filter');
		 	$portfolioContainer.isotope({ filter: selector });
			
			$('html, body').animate({
			    scrollTop: $portfolioContainer.offset().top - $headHesive.outerHeight(true) - 20
			}, 800);
		});
	}
	
	/* Reset the active class on all the buttons and assign it to the currently active category */
	$('.portfolio-filter li a').click(function() { 				
		$('.portfolio-filter li').removeClass('active'); 
		$(this).parent().addClass('active'); 
	});
	
	/* Initialize Isotope */ 
	$portfolioContainer.imagesLoaded(function() {
		
		/* Get the widths of isotope thumbnails, depending on the current screen size */	
		function getThumbWidth() {
			var windowWidth = $(window).width();
			
			if(windowWidth <= 400) {
				return Math.floor($portfolioContainer.width());
			}
			else if(windowWidth <= 850) {
				return Math.floor($portfolioContainer.width() / 2);
			}
			else if(windowWidth <= 1200) {
				return Math.floor($portfolioContainer.width() / 3);
			}
			else {
				return Math.floor($portfolioContainer.width() / 4);
			}
		}
				
		function setThumbWidth() {
			var thumbWidth = getThumbWidth();
			$portfolioContainer.children().css({ width: thumbWidth });
		}
		setThumbWidth();
		
		$portfolioContainer.isotope({
			layoutMode: 'masonry',
			masonry: {
            	columnWidth: getThumbWidth()
            }
        });
        
        $(window).smartresize(function() {
        	setThumbWidth();
        	 
			$portfolioContainer.isotope({
            	masonry: {
                	columnWidth: getThumbWidth()
				}
			});
        });
    });
	

	/*-----------------------------------------------------------------------------------*/
	/*	Responsive Videos
	/*-----------------------------------------------------------------------------------*/
	
	$pageContent.fitVids(); 
	
	
	/*-----------------------------------------------------------------------------------*/
	/*	Comment Form Placeholders for IE9
	/*-----------------------------------------------------------------------------------*/
	
	if (isIE9) {
		
		var authorPlaceholder = $('#commentform #author').attr('placeholder');
		var emailPlaceholder = $('#commentform #email').attr('placeholder');
		var urlPlaceholder = $('#commentform #url').attr('placeholder');
		var commentPlaceholder = $('#commentform #comment').attr('placeholder');		
				
		$('#commentform #author').val(authorPlaceholder);
		$('#commentform #email').val(emailPlaceholder);
		$('#commentform #url').val(urlPlaceholder);
		$('#commentform #comment').val(commentPlaceholder);
		
		$('#commentform input, #commentform textarea').focus(function() {
			if($(this).attr('id') == 'author') {
				if ($(this).val() == authorPlaceholder) { $(this).val(''); }
			}
			else if($(this).attr('id') == 'email') {
				if ($(this).val() == emailPlaceholder) { $(this).val(''); }
			}
			else if($(this).attr('id') == 'url') {
				if ($(this).val() == urlPlaceholder) { $(this).val(''); }
			}
			else if($(this).attr('id') == 'comment') {
				if ($(this).val() == commentPlaceholder) { $(this).val(''); }
			}
		});
		
		$('#commentform input, #commentform textarea').blur(function() {
			if($(this).attr('id') == 'author') {
				if ($(this).val() == '') { $(this).val(authorPlaceholder); }
			}		
			else if($(this).attr('id') == 'email') {
				if ($(this).val() == '') { $(this).val(emailPlaceholder); }
			}
			else if($(this).attr('id') == 'url') {
				if ($(this).val() == '') { $(this).val(urlPlaceholder); }
			}
			else if($(this).attr('id') == 'comment') {
				if ($(this).val() == '') { $(this).val(commentPlaceholder); }
			}
		});
	
	}
	
	
	/*-----------------------------------------------------------------------------------*/
	/*	Fix iOS Safari and IE9+ buggy viewport units
	/*-----------------------------------------------------------------------------------*/

	window.viewportUnitsBuggyfill.init();
	
	
})( jQuery );
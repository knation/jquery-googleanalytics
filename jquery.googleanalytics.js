/**
 *  Google Analytics plugin for JQuery.
 *  
 *  Copyright (c) 2010 Kirk Morales
 *  http://www.kirkmorales.com/projects/jquery-googleanalytics
 *  
 *  Distributed under the MIT License
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 * 	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 * 	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * 	THE SOFTWARE.
 */

var _gaq = _gaq || []; // This variable needs to be declared globally for ga.js to see it

(function($) {
	
	// Define functions and variables for common items to make file compress better
	function oTypeOf(o){ return typeof(o); }
	var __string = 'string', __undefined = 'undefined', __true = true, __false = false, __null = null;
	
	/**
	 * Initiations the Google Analytics tracker object and makes a pageview.
	 * 
	 * 	UA 							(string)	[REQUIRED] The GA UA number to track to.
	 * 	Page 						(string)	The string of the virtual pageview to make. Default: Current page
	 * 	addSlash 					(bool)		Whether to prepend a slash if Page is missing it. Default: __true
	 * 	setAllowLinker 				(bool)		Whether to allow cross-domain tracking. Default: __false
	 * 	setLocalRemoteServerMode	(bool)		Whether to track to GA as well as the local log file. Default: __false
	 */
	$.googleanalytics = function(options) {
		if( oTypeOf(_gaq) == __undefined ) return;
		var opts = $.extend({}, $.googleanalytics.defaults, options), ga, s;
		
		if( oTypeOf(opts.UA) == __undefined ) return __false;
		
		// Create tracker object with given UA
		_gaq.push(['_setAccount', opts.UA]);
				
		// Execute additional optional methods
		if( opts.setAllowLinker ) _gaq.push(['_setAllowLinker', __true]);
		if( opts.setLocalRemoteServerMode ) _gaq.push(['_setLocalRemoteServerMode', __true]);
		
		// Record a pageview
		$.trackPageview(opts.Page, opts);
		
		// Asynchronously load ga.js
		ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = __true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);	
	}
	$.googleanalytics.defaults = {addSlash: __true, setAllowLinker: __false, setLocalRemoteServerMode: __false, Page: __null};
	
	/**
	 * Tracks a pageview.
	 * 
	 * 	page		(string)	The string of the page view to make. Default: Current page
	 * 	options
	 * 		addSlash 	(bool)		Whether to prepend a slash if Page is missing it. Default: __true
	 */
	$.trackPageview = function(page, options) {
		if( oTypeOf(_gaq) == __undefined ) return;
		var opts = $.extend({}, $.trackPageview.defaults, options), method = ['_trackPageview'];
		
		// Handle virtual pageview
		if( oTypeOf(page) == __string ) {
			// Prepend slash if need be
			if( opts.addSlash && page.substring(0,1) != '/' ) page = '/' + page;
			
			// Add the virtual page
			method.push(page);
		}
		// Push the trackPageview method
		_gaq.push(method);
	}
	$.trackPageview.defaults = {addSlash: __true};
	
	/**
	 * Sets the onclick events to send a pageview with a prefix.
	 * 
	 * 	Prefix	(string)	The string to prepend to all downloads.
	 */
	$.fn.gaTagDownloads = function(options) {
		if( oTypeOf(_gaq) == __undefined ) return;
		var opts = $.extend({}, $.fn.gaTagDownloads.defaults, options);
		
		// Make sure prefix ends with a slash
		if( opts.Prefix.substring(opts.Prefix.length-1, 1) != '/' ) opts.Prefix += '/';
		
		return this.each(function() {
			var href = $(this).attr('href'), idx, file;
			
			if( href == __null ) return;
			
			// If there's a slash, get the filename (everything after last slash), otherwise use the entire href value
			idx = href.lastIndexOf('/');
			if( idx > -1 ) 	file = href.substring(idx+1);
			else			file = href;
			
			$(this).click(function(){$.trackPageview(opts.Prefix + file);});
		});
	}
	$.fn.gaTagDownloads.defaults = {Prefix: '/downloads/'};
	
	/**
	 * Sets the onclick events to send a pageview with a prefix for mailto links.
	 * 
	 * 	Prefix	(string)	The string to prepend to all mailto's.
	 */
	$.fn.gaTagMailto = function(options) {
		if( oTypeOf(_gaq) == __undefined ) return;
		var opts = $.extend({}, $.fn.gaTagMailto.defaults, options);
		
		// Make sure prefix ends with a slash
		if( opts.Prefix.substring(opts.Prefix.length-1, 1) != '/' ) opts.Prefix += '/';
		
		return this.each(function() {
			var href = $(this).attr('href'), idx, email;
			
			if( href == __null ) return;
			
			// If it's a mailto, get the email, otherwise quit
			idx = href.lastIndexOf('mailto:');
			if( idx > -1 ) 	email = href.substring(idx+7);
			else			return;
			
			$(this).click(function(){$.trackPageview(opts.Prefix + email);});
		});
	}
	$.fn.gaTagMailto.defaults = {Prefix: '/mailto/'};
	
	/**
	 * If an anchor tag, updates the href values of links to include linker info. If a form,
	 * an event is added to the onsubmit function.
	 * 
	 * This method will stop if either an anchor or form is not linking to an external source or if
	 * the hostnames match EXACTLY.
	 */
	$.fn.gaTagCrossDomain = function() {
		if( oTypeOf(_gaq) == __undefined ) return;
		return this.each(function() {
			var link, idx, idxEnd, hostname, linkHostname;
			
			// Determine the element type
			if( $(this).is('a') )			link = $(this).attr('href');
			else if( $(this).is('form') )	link = $(this).attr('action');
			else 							return;
			
			// Stop if no href or if it's not an external link (starting with http)
			if( link == __null || link.indexOf('http') != 0 ) return;
			
			// Get Current hostname
			hostname = location.hostname;
			idx = hostname.indexOf('//')+2;
			idxEnd = hostname.indexOf('/', idx);
			hostname = hostname.substring(idx, ((idxEnd > -1) ? idxEnd : hostname.length));
			
			// Get hostname in link
			linkHostname = link;
			idx = linkHostname.indexOf('//')+2;
			idxEnd = linkHostname.indexOf('/', idx);
			linkHostname = linkHostname.substring(idx, (idxEnd > -1) ? idxEnd : linkHostname.length);
			
			if( hostname == linkHostname ) return;

			if( $(this).is('a') )			$(this).click(function(){_gaq.push(['_link', link]); return __false;});
			else if( $(this).is('form') )	$(this).submit(function(){_gaq.push(['_linkByPost', this]);});
			
		});
	}
	
	/**
	 * Tracks a Google Analytics event.
	 * 
	 * 	Category	(string)	[REQUIRED] The category to record. Default: empty string
	 * 	Action		(string)	[REQUIRED] The action to record. Default: empty string
	 * 	Label		(string)	The label to record. Default: empty string
	 * 	Value		(int)		The event value to record. Default: 0
	 */
	$.trackEvent = function(options) {
		if( oTypeOf(_gaq) == __undefined ) return;
		var opts = $.extend({}, $.trackEvent.defaults, options);

		// Validate parameters
		if( opts.Category == __null ) return;
		else if( opts.Action == __null ) return;
		else if( opts.Label == __null ) return;
		else if( oTypeOf(opts.Value) != 'number' ) return;
		
		_gaq.push(['_trackEvent', opts.Category, opts.Action, opts.Label, opts.Value]);
	}
	$.trackEvent.defaults = {Category: __null, Action: __null, Label: __null, Value: __null};
	
	/**
	 * Tracks an entire ecommerce transaction, including all items. All params are required.
	 * 
	 * 	Items	(array)		A list of all items included in the transaction.
	 * 		SKU	(string)
	 * 		Name (string)
	 * 		Category (string)
	 * 		Price (string)
	 * 		Quantity (string)
	 * 		
	 * 	OrderID (string)	The order ID to track.
	 * 	Store	(string)	Affiliation or Store Name.
	 * 	Total	(string)	The transaction total.
	 * 	Tax		(string)	The tax total.
	 * 	Shipping (string)	Shipping amount.
	 * 	City	(string)	-
	 * 	State	(string)	State or Province.
	 * 	Country	(string)	-
	 */
	$.trackTransaction = function(options) {
		if( oTypeOf(_gaq) == __undefined ) return;
		var opts = $.extend({}, options), i;
		
		// Make sure all parameters exist in the proper form
		if( oTypeOf(opts.Items) != 'object' || oTypeOf(opts.OrderID) != __string || oTypeOf(opts.Store) != __string || oTypeOf(opts.Total) != __string
			|| oTypeOf(opts.Tax) != __string || oTypeOf(opts.Shipping) != __string || oTypeOf(opts.City) != __string || oTypeOf(opts.State) != __string
			|| oTypeOf(opts.Country) != __string) return;
		
		_gaq.push(['_addTrans', opts.OrderID, opts.Store, opts.Total, opts.Tax, opts.Shipping, opts.City, opts.State, opts.Country]);
		
		// Add each item
		for( i=0;i<opts.Items.length;i++ ) {
			var item = opts.Items[i];
			
			// Make sure all parameters exist in the proper form
			if( oTypeOf(item.SKU) != __string || oTypeOf(item.Name) != __string || oTypeOf(item.Category) != __string
				|| oTypeOf(item.Price) != __string || oTypeOf(item.Quantity) != __string ) continue;
			
			_gaq.push(['_addItem', opts.OrderID, item.SKU, item.Name, item.Category, item.Price, item.Quantity]);
		}

		_gaq.push(['_trackTrans']);
	}
})(jQuery);

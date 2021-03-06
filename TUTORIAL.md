# Tutorial

## Intializing Google Analytics (GA) Async code

Simply call the following method to initialize the tracking code and make a pageview:

	$.googleanalytics(options);

Options:

<tt>UA</tt>: (REQUIRED) The UA number to track to.

<tt>Page</tt>: The page to record. Default: the current URL.

<tt>addSlash</tt>: Whether to prepend a slash if Page is missing one. Default: true.

<tt>setAllowLinker</tt>: Whether to allow cross-domain tracking. Default: false.

<tt>setLocalRemoteServerMode</tt>: Whether to track to GA as well as the local log file (for Urchin). Default: false.

### Example

	$.googleanalytics({UA: 'UA-123456-11', setAllowLinker: true});

## Tracking Pageviews

Call the following method at any time to record a pageview:

	$.trackPageview(page, options);

<tt>Page</tt>: The page to record. Default: the current URL.

Options:

<tt>addSlash</tt>: Whether to prepend a slash if Page is missing one. Default: true.

## Tagging links as downloads

Call the following method to attach `_trackPageview` methods to `<a>` elements:

	$(<selector>).gaTagDownloads(options);

Options:

<tt>Prefix</tt>: The prefix to prepend to all href values. Default: /downloads/

### Example

	<script type="text/javascript" src="jquery.googleanalytics.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			$.googleanalytics({UA: 'UA-123456-11'});
			$('a.mp3-download').gaTagDownloads();
		});
	</script>
	...
	<a href="/files/foo.mp3" class="mp3-download">foo.mp3</a>

When the link is clicked, a pageview will be recorded in GA as /downloads/files/foo.mp3

## Tag links as mailto links

Call the following method to attach `_trackPageview` methods to `<a>` elements:

	$(<selector>).gaTagMailto(options);

Options:

<tt>Prefix</tt>: The prefix to prepend to all href values. Default: /mailto/

### Example

	<script type="text/javascript" src="jquery.googleanalytics.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			$.googleanalytics({UA: 'UA-123456-11'});
			$('a.mail').gaTagMailto();
		});
	</script>
	...
	<a href="mailto:joe@foo.com" class="mail">Email Joe</a>

When the link is clicked, a pageview will be recorded in GA as /mailto/joe@foo.com

## Tag links/forms for cross domain

Before tagging links for forms, be sure to allow the linker functionality:

	$.googleanalytics({UA: 'UA-123456-11', setAllowLinker: true});

Then call the following method:

	$(<selector>).gaTagCrossDomain();

### Example

	<script type="text/javascript" src="jquery.googleanalytics.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			$.googleanalytics({UA: 'UA-123456-11', setAllowLinker: true});
			$('form').gaTagCrossDomain();
		});
	</script>
	...
	<form action="http://www.kirkmorales.com" method="POST">
		<input type="submit"></input>
	</form>

## Tracking Events

Call the following method to track an event in GA:

	$.trackEvent({Category: 'category', Action: 'action', ...});

Other Options:

<tt>Label</tt>

<tt>Value</tt>

## Tracking Ecommerce Transactions

With the standard Ecommerce code in GA, first a transaction needs to be created, then each item, and finally teh whole thing may be tracked. With this plugin, you can do it all with one command:

	$.trackTransaction(options);

Options:

<tt>OrderID</tt> The order ID to track.

<tt>Store</tt> Affiliation or Store Name.

<tt>Total</tt> The transaction total.

<tt>Tax</tt> The tax total.

<tt>Shipping</tt> Shipping amount.

<tt>City</tt>

<tt>State</tt> State or Province.

<tt>Country</tt>


<tt>Items</tt> A list of all items included in the transaction.

<tt>SKU</tt>

<tt>Name</tt>

<tt>Category</tt>

<tt>Price</tt>

<tt>Quantity</tt>


### Example

	<script type="text/javascript" src="jquery.googleanalytics.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			$.googleanalytics({UA: 'UA-123456-11', setAllowLinker: true});
			
			$.trackTransaction({OrderID: '12345', Store: 'Acme Clothing', Total: '11.99', Tax: '1.29', Shipping: '5', 
				City: 'San Jose', State: 'California', Country: 'USA', 
				Items: [{SKU: 'DD44', Name: 'T-Shirt', Category: 'Green Medium', Price: '11.99', Quantity: '1'},
					{SKU: 'DD45', Name: 'T-Shirt', Category: 'Green XLarge', Price: '12.99', Quantity: '4'}]
			});
		});
	</script>

## Using other GA functions

This plugin uses the standard global `_gaq` object, so any other method may be pushed onto the stack to be executed. For example:

	$.googleanalytics({UA: 'UA-123456-11', setAllowLinker: true});

is equivalent to:

	$.googleanalytics({UA: 'UA-123456-11'});
	_gaq.push(['_setAllowLinker', true]);

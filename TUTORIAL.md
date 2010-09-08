# Tutorial

## Intializing Google Analytics (GA) Async code

Simply call the following method to initialize the tracking code and make a pageview:

	$.googleanalytics(options);

Options:

`UA`: (REQUIRED) The UA number to track to.
`Page`: The page to record. Default: the current URL.
`addSlash`: Whether to prepend a slash if Page is missing one. Default: true.
`setAllowLinker`: Whether to allow cross-domain tracking. Default: false.
`setLocalRemoteServerMode`: Whether to track to GA as well as the local log file (for Urchin). Default: false.

### Example

	$.googleanalytics({UA: 'UA-123456-11', setAllowLinker: true});

## Tracking Pageviews

Call the following method at any time to record a pageview:

	$.trackPageview(page, options);

`Page`: The page to record. Default: the current URL.

Options:

`addSlash`: Whether to prepend a slash if Page is missing one. Default: true.

## Tagging links as downloads

Call the following method to attach `_trackPageview` methods to `<a>` elements:

	$(<selector>).gaTagDownloads(options);

Options:

`Prefix`: The prefix to prepend to all href values. Default: /downloads/

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

`Prefix`: The prefix to prepend to all href values. Default: /mailto/

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

`Label`
`Value`

## Tracking Ecommerce Transactions

With the standard Ecommerce code in GA, first a transaction needs to be created, then each item, and finally teh whole thing may be tracked. With this plugin, you can do it all with one command:

	$.trackTransaction(options);

Options:

`OrderID` The order ID to track.
`Store` Affiliation or Store Name.
`Total` The transaction total.
`Tax` The tax total.
`Shipping` Shipping amount.
`City`
`State` State or Province.
`Country`
`Items` A list of all items included in the transaction.
	`SKU`
	`Name`
	`Category`
	`Price`
	`Quantity`

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

# jQuery Plugin for Google Analytics

Use this jQuery plugin to easily integrate asynchronous Google Analytics code onto your web pages or to tag multiple links using a jQuery selector.

## Basic Usage

Include the jQuery plugin and call the `$.googleanalytics()` method to initialize:

	<script type="text/javascript" src="jquery.googleanalytics.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			// Initialize tracker and create a pageview
			$.googleanalytics({UA: 'UA-XXXXX-XX'});
		});
	</script>

View the full [Tutorial](http://github.com/knation/jquery-googleanalytics/blob/master/TUTORIAL.md) for more usage information. 

The above example is perfect for most simple implementations of the tracking code, replacing this standard GA code:

	<script type="text/javascript">
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-XXXXX-X']);
		_gaq.push(['_trackPageview']);

		(function() {
			var ga = document.createElement('script');     ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:'   == document.location.protocol ? 'https://ssl'   : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	</script>

## FAQ

**Q:** What version of the Google Analytics tracking code does this plugin work with?
**A:** The most recent asynchronous tracking code.

**Q:** Can I use this plugin with other GA Async code on my webpages?
**A:** Yes, this is completely compatible with other async code already on your site. Here's an example:

	<script type="text/javascript" src="jquery.googleanalytics.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			// Initialize tracker and create a pageview
			$.googleanalytics({UA: 'UA-XXXXX-XX'});

			// This makes ANOTHER pageview
			_gaq.push(['_trackPageview']);
		});
	</script>

## License

Copyright (C) 2010 Kirk Morales. Distributed under the MIT License.
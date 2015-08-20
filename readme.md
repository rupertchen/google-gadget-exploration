Installation
------------
First, build `gadget.xml` by running the following.

    make

Next, host `gadget.xml` somewhere publicly accessible.  Say, at the URL
`<gadgeturl>`.  Then, go to the following URL in your browser.

    http://www.google.com/calendar/render?gadgeturl=<gadgeturl>

Note that Google caches the gadget for up to an hour.  So if you want to
refresh it sooner than that, add a "cache-busting" URL query string
parameter.

Security
--------
You may need to add `https://www.google.com` to the list of authorized
JavaScript origins in your browser.

.PHONY: clean
.INTERMEDIATE: style.html script.html init.html

dist/gadget.xml: head.xml style.html script.html ui.html init.html foot.xml
	cat $^ > $@

style.html: style_open style.css style_close
	cat $^ > $@

script.html: script_open script.js script_close
	cat $^ > $@

init.html: script_open init.js script_close
	cat $^ > $@

clean:
	rm -f dist/gadget.xml style.html script.html init.html

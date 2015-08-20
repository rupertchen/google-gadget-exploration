.PHONY: clean

gadget.xml: head.xml script.html ui.html init.html foot.xml
	cat $^ > $@

script.html: script_open script.js script_close
	cat $^ > $@

init.html: script_open init.js script_close
	cat $^ > $@

clean:
	rm -f gadget.xml script.html init.html

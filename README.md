# Pinstripe

Puts pinned tabs in a sidebar. Open with Alt+Shift+P. 

![screenshot](https://addons.cdn.mozilla.net/user-media/previews/thumbs/257/257143.jpg)

Pin your tabs and they'll appear in the resizable sidebar. 

## userChrome.css


Firefox is limited on what you can do with sidebars, and by default enforces a very large minimum width. For optimal appearance you will need to set up your userChrome.css as outlined here: https://www.howtogeek.com/334716/how-to-customize-firefoxs-user-interface-with-userchrome.css/ with the following:

```css
#sidebar-header {
	display: none !important;
}

#sidebar-splitter {
	width: 1px !important;
	border: 0 !important;
}

#sidebar {
	min-width: 0em !important;
}


.tabbrowser-tab[pinned=true] {
	display: none;
}
```
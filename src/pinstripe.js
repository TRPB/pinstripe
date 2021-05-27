let tabAction = 0;
let contextMenu = 0;

async function reloadTabIcons() {
	let tabs = await browser.tabs.query({currentWindow: true, pinned: true});

	let ul = document.getElementById('tablist');
	while (ul.childNodes.length > 0) {
		ul.removeChild(ul.firstChild);
	}

	let dragElement = null;
	
	for (let i = 0; i < tabs.length; i++) {
		let li = document.createElement('li');

		if (tabs[i].mutedInfo.muted) {
			li.classList.add('muted');
		}

		if (tabs[i].active) {
			li.classList.add('active');
		}

		if (tabs[i].attention || tabs[i].title.charAt(0) == '(' || tabs[i].title.charAt(tabs[i].title.length-1) == ')') {
			li.classList.add('attention');
		}

		let img = document.createElement('img');
		img.src = tabs[i].favIconUrl;
				
		li.appendChild(img);
		li.setAttribute('data-id', tabs[i].id);
		li.setAttribute('draggable', true);
		li.addEventListener('click', function() {
			let activeTabs = document.getElementsByClassName('active');
			if (activeTabs[0]) {
				activeTabs[0].classList.remove('active');
			}
			this.classList.add('active')

			browser.tabs.update(parseInt(this.getAttribute('data-id')), {
				active: true
			});

		});

		li.addEventListener('contextmenu', function(event) {
			event.preventDefault();
			tabAction = parseInt(this.getAttribute('data-id'));
			contextMenu.style.left = '0.2em'
			contextMenu.style.top = event.clientY + 'px';
			contextMenu.classList.add('active');
		})

		li.addEventListener('dragstart', function(event) {
			dragElement = this;
		});

		li.addEventListener('dragover', function(event) {
			this.parentNode.insertBefore(dragElement, this);
			for (let i = 0; i < ul.childNodes.length; i++) {
				let tabId = parseInt(ul.childNodes[0].getAttribute('data-id'));

				browser.tabs.move(tabId, {index: i})
			}

		});

		ul.appendChild(li);
	}	
}
async function start() {
	reloadTabIcons();
	browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tabInfo) {
		if (changeInfo.title || changeInfo.active || changeInfo.pinned == true || changeInfo.muted || changeInfo.attention) {
			reloadTabIcons();
		}
	});

	contextMenu = document.getElementById('menu');

	document.getElementById('unpin').addEventListener('click', function() {
		browser.tabs.update(tabAction, {
				pinned: false
		});
		reloadTabIcons();
	});

	document.getElementById('close').addEventListener('click', function() {
		browser.tabs.update(tabAction);
		reloadTabIcons();
	});

	document.getElementById('mute').addEventListener('click', function() {
		browser.tabs.update(tabAction);
		reloadTabIcons();
	});


	document.addEventListener('click', function() {
		contextMenu.classList.remove('active');
	});
}


document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('DOMContentLoaded', function() {
	start();
});


var $panel = document.getElementById('js-panel');
var $header = document.getElementById('js-header');
var $content = document.getElementById('js-content');
var $summaryItems = Array.prototype.slice.call(document.querySelectorAll('#js-menu .href'));
var $menu = document.getElementById('js-menu');
var $menuContent = document.getElementById('js-menu-content');
var $menuBar = document.getElementById('js-summary-switch');

var utils = {
	debounce: function(func, wait) {
		var timeout;
		return function () {
			clearTimeout(timeout);
			timeout = setTimeout(func, wait);
		};
	}
};

// Add 'active' to summary item
function itemAddActive() {
	var locationHref = window.location.href;
	$summaryItems.map(function (item, index) {
		if (item.href === locationHref) {
			// add 'active' for present summary item.
			item.parentElement.classList.add('active');
		} else {
			item.parentElement.classList.remove('active');
		}
	});
}

// Add EventListener
function addEvents() {
	$panel.addEventListener('click', function (e) {
		itemAddActive();
		if (e.target.scrollTop > 0) {
			$header.classList.add('moved');
		} else {
			$header.classList.remove('moved');
		}
	});
	if ($menuContent) {
		$menuContent.addEventListener('click', function (e) {
			$menu.classList.remove('active');
			setTimeout(itemAddActive, 0);
		});
	}
	if ($menuBar) {
		$menuBar.addEventListener('click', function () {
			$menu.classList.toggle('active');
		});
	}
	if ($menu) {
		$menu.addEventListener('scroll', function(e) {
			sessionStorage.setItem('menuScrollTop', e.target.scrollTop);
		});
	}
	if ($content) {
		$content.addEventListener('scroll', function (e) {
			sessionStorage.setItem('contentScrollTop', e.target.scrollTop);
		});
	}
}

// initial components
function initComponents() {
	// nav
	var navigation = responsiveNav('.js-nav', {
		customToggle: '#js-nav-btn'
	});

	// 菜单恢复到记忆的高度
	if ($menu && sessionStorage.menuScrollTop) {
		$menu.scrollTop = sessionStorage.menuScrollTop;
	}
	// 刷新页面但不切换 pathname 的时候，内容区恢复到记忆的高度
	if ($content && sessionStorage.contentScrollTop && window.location.pathname == sessionStorage.locationPathname) {
		$content.scrollTop = sessionStorage.contentScrollTop;
	}
	sessionStorage.setItem('locationPathname', window.location.pathname);
}


initComponents();
addEvents();
itemAddActive();


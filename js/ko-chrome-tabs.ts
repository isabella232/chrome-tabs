/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
module koChromeTabs {
    ko.bindingHandlers["chromeTabs"] = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        }
    };

    ko.components.register('chrome-tabs', {
        viewModel: function(params) {            
            //this.value = params.value;
        },
        template:
        '<div class="chrome-tab">\
             <div class="chrome-tab-favicon" > </div>\
             <div class="chrome-tab-title" > </div>\
             <div class="chrome-tab-close" > </div>\
             <div class="chrome-tab-curves" >\
             <div class="chrome-tab-curves-left-shadow"> </div>\
             <div class="chrome-tab-curves-left-highlight" > </div>\
             <div class="chrome-tab-curves-left" > </div>\
             <div class="chrome-tab-curves-right-shadow" > </div>\
             <div class="chrome-tab-curves-right-highlight" > </div>\
             <div class="chrome-tab-curves-right" > </div>\
             </div>\
         </div>'
    });



	if (document.body.style['-webkit-mask-repeat'] !== void 0) {
		$('html').addClass('cssmasks');
	} else {
		$('html').addClass('no-cssmasks');
	}




	export class ChromeTabs {

		tabTemplate = '<div class="chrome-tab">\n    <div class="chrome-tab-favicon"></div>\n    <div class="chrome-tab-title"></div>\n    <div class="chrome-tab-close"></div>\n    <div class="chrome-tab-curves">\n        <div class="chrome-tab-curves-left-shadow"></div>\n        <div class="chrome-tab-curves-left-highlight"></div>\n        <div class="chrome-tab-curves-left"></div>\n        <div class="chrome-tab-curves-right-shadow"></div>\n        <div class="chrome-tab-curves-right-highlight"></div>\n        <div class="chrome-tab-curves-right"></div>\n    </div>\n</div>';


		defaultNewTabData = {
			title: 'New Tab',
			favicon: '',
			data: {}
		};

		animationStyle = document.createElement('style');

		consutrctor() {


		}


		public init(options) {
			var render;
			$.extend(options.$shell.data(), options);
			options.$shell.prepend(this.animationStyle);
			options.$shell.find('.chrome-tab').each(function() {
				return $(this).data().tabData = {
					data: {}
				};
			});
			render = () => {
				return this.render(options.$shell);
			};
			$(window).resize(render.bind(this));
			return render.call(this);
		}
		public render($shell) {
			this.fixTabSizes($shell);
			this.fixZIndexes($shell);
			this.setupEvents($shell);
			this.setupSortable($shell);
			return $shell.trigger('chromeTabRender');
		}
		public setupSortable($shell) {
			var $tabs;
			$tabs = $shell.find('.chrome-tabs');
			return $tabs.sortable({
				axis: 'x',
				tolerance: 'pointer',
				cancel: '.chrome-tab-close',
				start: (e, ui) => {
					ui.item.addClass('ui-sortable-draggable-item');
					$shell.addClass('chrome-tabs-sorting');
					this.setupTabClones($shell, ui.item);
					this.fixZIndexes($shell);
					if (!$(ui.item).hasClass('chrome-tab-current')) {
						return $tabs.sortable('option', 'zIndex', $(ui.item).data().zIndex);
					} else {
						return $tabs.sortable('option', 'zIndex', $tabs.length + 40);
					}
				},
				stop: (e, ui) => {
					$('.ui-sortable-draggable-item').removeClass('ui-sortable-draggable-item');
					$shell.removeClass('chrome-tabs-sorting');
					this.cleanUpTabClones($shell);
					return this.setCurrentTab($shell, $(ui.item));
				},
				change: (e, ui) => {
					var placeholderIndex;
					placeholderIndex = ui.placeholder.index();
					if (ui.helper.index() <= placeholderIndex) {
						placeholderIndex -= 1;
					}
					return this.animateSort($shell, placeholderIndex);
				}
			});
		}
		public animateSort($shell, newPlaceholderIndex) {
			var $clone, $placeholder, delta, placeholderIndex;
			$clone = $shell.find('.chrome-tabs.chrome-tabs-clone');
			$placeholder = $clone.find('.ui-sortable-placeholder');
			placeholderIndex = $placeholder.index();
			delta = newPlaceholderIndex - placeholderIndex;
			if (delta === -1) {
				if (newPlaceholderIndex - 1 < 0) {
					return $clone.prepend($placeholder);
				} else {
					return $($clone.find('.chrome-tab').get(newPlaceholderIndex - 1)).after($placeholder);
				}
			} else if (delta === 1) {
				return $($clone.find('.chrome-tab').get(newPlaceholderIndex)).after($placeholder);
			}
		}
		public setupTabClones($shell, uiItem) {
			var $clone, $lastClone, $tabsContainer;
			$lastClone = $shell.find('.chrome-tabs.chrome-tabs-clone');
			$tabsContainer = $shell.find('.chrome-tabs').first();
			$clone = $tabsContainer.clone().addClass('chrome-tabs-clone');
			$clone.find('.ui-sortable-helper, .ui-sortable-draggable-item').remove();
			$clone.find('.chrome-tab').css('position', '');
			if ($lastClone.length) {
				return $lastClone.replaceWith($clone);
			} else {
				return $tabsContainer.after($clone);
			}
		}
		public cleanUpTabClones($shell) {
			return $shell.find('.chrome-tabs.chrome-tabs-clone').remove();
		}
		public fixTabSizes($shell) {
			var $tabs, margin, width;
			$tabs = $shell.find('.chrome-tab');
			margin = (parseInt($tabs.first().css('marginLeft'), 10) + parseInt($tabs.first().css('marginRight'), 10)) || 0;
			width = $shell.width() - 50;
			width = (width / $tabs.length) - margin;
			width = Math.max($shell.data().minWidth, Math.min($shell.data().maxWidth, width));
			$tabs.css({
				width: width
			});
			return setTimeout(() => {
				return this.setupAnimationStyles.call(this, $shell);
			});
		}
		public setupAnimationStyles($shell) {
			var $tabs, offsetLeft, styleHTML;
			styleHTML = '';
			offsetLeft = $shell.find('.chrome-tabs').offset().left;
			$tabs = $shell.find('.chrome-tabs:not(.chrome-tabs-clone) .chrome-tab');
			$tabs.each(function(i) {
				var $tab, left;
				$tab = $(this);
				left = $tab.offset().left - offsetLeft - parseInt($tabs.first().css('marginLeft'), 10);
				return styleHTML += ".chrome-tabs-clone .chrome-tab:nth-child(" + (i + 1) + ") {\n    left: " + left + "px\n}";
			});
			return this.animationStyle.innerHTML = styleHTML;
		}
		public fixZIndexes($shell) {
			var $tabs;
			$tabs = $shell.find('.chrome-tab');
			return $tabs.each(function(i) {
				var $tab, zIndex;
				$tab = $(this);
				zIndex = $tabs.length - i;
				if ($tab.hasClass('chrome-tab-current')) {
					zIndex = $tabs.length + 40;
				}
				$tab.css({
					zIndex: zIndex
				});
				return $tab.data({
					zIndex: zIndex
				});
			});
		}
		public setupEvents($shell) {
			$shell.unbind('dblclick').bind('dblclick', () => {
				return this.addNewTab($shell, null);
			});
			return $shell.find('.chrome-tab').each((count, target) => {
				var $tab;
				$tab = $(target);
				$tab.unbind('click').click(() => {
					return this.setCurrentTab($shell, $tab);
				});
				return $tab.find('.chrome-tab-close').unbind('click').click(() => {
					return this.closeTab($shell, $tab);
				});
			});
		}
		public addNewTab($shell, newTabData) {
			var $newTab, tabData;
			$newTab = $(this.tabTemplate);
			$shell.find('.chrome-tabs').append($newTab);
			tabData = $.extend(true, {}, this.defaultNewTabData, newTabData);
			this.updateTab($shell, $newTab, tabData);
			return this.setCurrentTab($shell, $newTab);
		}
		public setCurrentTab($shell, $tab) {
			$shell.find('.chrome-tab-current').removeClass('chrome-tab-current');
			$tab.addClass('chrome-tab-current');
			return this.render($shell);
		}
		public closeTab($shell, $tab) {
			if ($tab.hasClass('chrome-tab-current')) {
				if ($tab.prev().length) {
					this.setCurrentTab($shell, $tab.prev());
				} else if ($tab.next().length) {
					this.setCurrentTab($shell, $tab.next());
				}
			}
			$tab.remove();
			return this.render($shell);
		}
		public updateTab($shell, $tab, tabData) {
			$tab.find('.chrome-tab-title').html(tabData.title);
			$tab.find('.chrome-tab-favicon').css({
				backgroundImage: "url('" + tabData.favicon + "')"
			});
			return $tab.data().tabData = tabData;
		}

	}

}
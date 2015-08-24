/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
module koChromeTabs {
    ko.bindingHandlers["chromeTabs"] = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            
        }
    };

    ko.components.register('chrome-tabs', {
        viewModel: function (params) {            
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
}
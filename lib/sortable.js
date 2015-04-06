/*
 * HTML5 Sortable Plugin
 */
(function ($) {
    var dragging, oldIndex;
    var placeholder, placeholderIndex, items;

    var getItemIndex = function (item) {
        for(var i = 0; i< items.length; i++) {
            if(items[i] == item) {
                return i;
            }
        }
        return null;
    };

    $.element.prototype.updateSortable = function () {

        var onOver = function (e) {
            if(e.currentTarget == dragging[0]){
                return;
            }
            e.dataTransfer.dropEffect = 'move';
            dragging.css('display', 'none');
            placeholder.css('display', '');
            var itemIndex = getItemIndex(e.currentTarget);

            if (itemIndex > placeholderIndex) {
                $.element(items[itemIndex]).after(placeholder);
                placeholderIndex = itemIndex;
            }
            else if (itemIndex < placeholderIndex)
            {
                var elem = $.element(items[itemIndex]);
                elem.parent()[0].insertBefore(placeholder[0], items[itemIndex]);
                placeholderIndex = itemIndex;
            }
            return false;
        };

        var elem = this;
        var options = {};
//		if (/^enable|disable|destroy$/.test(method)) {
//			var items = $.element(this).children($.element(this).data('items')).attr('draggable', method == 'enable');
//			if (method == 'destroy') {
//				items.add($.element(this)).removeData('connectWith items')
//					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
//			}
//			return;
//		}
        var isHandle, newIndex, placeholder;
        items = elem.children(options.items);

        items.find(options.handle).on('mousedown', function () {
            isHandle = true;
        }).on('mouseup', function () {
            isHandle = false;
        });
        elem.data('items', options.items);

        items.attr('draggable', 'true');
        items.on('dragstart', function (e) {
            if (options.handle && !isHandle) {
                return false;
            }
            isHandle = false;
            var dt = e.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('Text', '');
            //dt.setData('text/html', this.outerHTML);
            dragging = $.element(this).addClass('sortable-dragging');
            placeholder = $.element('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
            placeholder.css('display', 'none');
            placeholder.on('drop', function (e) {
                e.stopPropagation();
                placeholder.remove();
                newIndex = placeholderIndex;
                dragging.removeClass('sortable-dragging').css('display', '');
                dragging.parent().triggerHandler('sortupdate', {oldIndex: oldIndex, newIndex: newIndex});
                dragging = null;
                return false;
            });
            placeholder.on('dragover dragenter', function (e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            placeholderIndex = oldIndex = getItemIndex(this);
        });

        items.on('selectstart.h5s', function () {
            this.dragDrop && this.dragDrop();
            return false;
        });

        items.on('dragend', function (e) {
            if(dragging)
            {
                placeholder.remove();
                dragging.removeClass('sortable-dragging').css('display', '');
            }
        });

        items.on('dragover dragenter', onOver);
    };
    $.element.prototype.sortable = function (options) {
        options = $.extend({
            connectWith: false
        }, options);

        return $.element(this);
    };
    $.element.prototype.index = function () {
        var list = this.parent().children();
        for (var i = 0; i < list.length; ++i) {
            if (list[i] == this[0]) {
                return i;
            }
        }
        return null;
    };
})(angular);

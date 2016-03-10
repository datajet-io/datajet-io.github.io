$.widget("custom.catcomplete", $.ui.autocomplete, {
    _create: function () {
        this._super();
        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");

        String.prototype.trunc = function (a, d) {
            var c = this.length > a, b = c ? this.substr(0, a - 1) : this;
            return b = d && c ? b.substr(0, b.lastIndexOf(" ")) : b
        };
    },

    _renderItem: function (ul, item) {
        var label = "";
        var brand = (item.br) ? item.br + " " : "";
        var cat = (item.ca) ? item.ca + " " : "";
        var title = item.ti.trunc(40, true);
        var price = "R$ " + item.cp;
        var className = '';

        switch (item.ty) {
            case 0: // Category
                label = (brand) ? '<span class="dj-itemCategory">' + brand + ' <span class="dj-seperator">in</span> ' + title + '</span>' : '<span class="dj-itemCategory">' + title + ' <span class="dj-seperator">in</span> ' + cat + '</span>';
                break;
            case 1:  // Product
                var thumbnail = (item.th) ? '<span class="dj-itemThumbnail"><img src="' + imgUrl + '/m_' + item.th + '"></span>' : "";
                label = thumbnail + '<span class="dj-itemProduct"><strong class="dj-itemBrand">' + brand + '</strong><span class="dj-itemTitle">' + title + '</span><strong class="dj-itemPrice">' + price + '</strong></span>';
                className = 'dj-product';
                break;
            case 2:  // Search
                label = (cat) ? '<span class="dj-itemCategory">' + title + ' <span class="dj-seperator">in</span> ' + cat + '</span>' : '<span class="dj-itemCategory">' + title + '</span>';
                break;
        }

        label = '<a href="#">' + label + '</a>';

        return $("<li>")
            .addClass(className)
            .append(label)
            .appendTo(ul);
    },
    // styling of different sections
    _renderMenu: function (ul, items) {
        var that = this, currentType = -1;
        var categoryName = '';

        $.each(items, function (index, item) {
            if (item.ty != currentType) {
                switch (item.ty) {
                    case 0: // Category
                        categoryName = "Search Results";
                        break;
                    case 1:  // Product
                        categoryName = "Related Products";
                        break;
                    case 2:  // Search
                        categoryName = "Search for";
                        break;
                }
                ul.append("<li class='dj-section'>" + categoryName + "</li>");
                currentType = item.ty;
            }
            that._renderItemData(ul, item);
        });
    }
});

$(function () {
    $("#suggestions").catcomplete({
        delay: 0,
        appendTo: '#suggestionResults',
        select: function (event, ui) { // what happens when clicking on an suggestion
            event.preventDefault();
            window.location.href = "http://" + ui.item.li;
            return false;
        },
        messages: {
            noResults: "",
            results: function () {}
        },
        source: function (request, response) {
            suggest.get(request.term, function (suggestions) {
                if (!suggestions) {
                    suggestions = [
                        {
                            ty: 1,
                            ti: 'No matches found',
                            cat: response.term
                        }
                    ];
                    response(suggestions);
                } else {
                    var categories = [];
                    var searches = [];
                    var products = [];

                    $.each(suggestions, function (index, item) {
                        switch (item.ty) {
                            case 1:  // Product
                                if (products.length < 4) {
                                    products.push(item);
                                }
                                break;
                            case 0: // Category
                                if (categories.length < 5) {
                                    categories.push(item);
                                }
                                break;
                            case 2:  // Search
                                searches.push(item);
                                break;
                        }
                    });
                    var orderedSuggestions = categories.concat(products).concat(searches);
                    response(orderedSuggestions);
                }
            });
        }
    });
});

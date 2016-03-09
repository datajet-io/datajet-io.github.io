dataJetDemo = {
    data: {
        recentlyViewed: {},
        filters: []
    },

    settings: {
        recentlyViewedUrl: 'http://feed.REGION.datajet.io/1.1/recentlyviewed',
        moreLikeThisUrl: 'http://feed.REGION.datajet.io/1.1/morelikethis',
        bestSellersUrl: 'http://feed.REGION.datajet.io/1.1/bestsellers',
        trendingProductsUrl: 'http://feed.REGION.datajet.io/1.1/trendingProducts',
        popularCategoriesUrl: 'http://feed.REGION.datajet.io/1.1/popularcategories',
        searchUrl: 'https://hawk.REGION.datajet.io/1.0/product/',
        rankerUrl: 'https://ranker.datajet.io/0.1/score',
        imgUrl: 'http://seer.REGION.datajet.io/i'
    },

    customer: {
        pYJDcB: {
            name: 'Linio',
            feedKey: 'pYJDcBMdGR4tUM1OADt42LGvFSj7U5U',
            imgUrl: '//media.linio.com.mx',
            region: 'usw'
        },
        jYNzew: {
            name: 'Home24',
            feedKey: 'jYNzewm744UMzDRUssQw46QzJhfRoCc',
            imgUrl: '//media.linio.com.mx',
            region: 'euw'
        }
    },

    init: function() {
        if (this.getCustomer()) {
            this.showSuggester();
            this.showSearch();
            this.showProductDetailModal();
            this.showRecentlyViewedFeed();
            this.showTrendingProductsFeed();
            this.showPopularCategories();
        }
    },

    ucwords: function(str) {
        return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
            function($1){
                return $1.toUpperCase();
            });
    },

    shuffle: function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    buildUrl: function(uri, queryArgs) {
        var url = uri + '?';
        for (var name in queryArgs) {
            url += name + '=' + encodeURIComponent(queryArgs[name]) + '&';
        }
        url = url.slice(0, -1);
        return url;
    },

    getUrlArgs: function() {
        var request = {};
        var pairs = document.location.href.substring(document.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            if(!pairs[i])
                continue;
            var pair = pairs[i].split('=');
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return request;
    },

    setCookie: function (cname, cvalue, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },

    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    },

    getCustomer: function() {
        var demoId = this.getCookie('demoId');

        if (this.getUrlArgs()['key'] !== undefined) {
            if (this.customer[this.getUrlArgs()['key']] !== undefined) {
                this.setCookie('demoId', this.getUrlArgs()['key'], 100);
                demoId = this.getUrlArgs()['key'];
                valid = true;
            } else {
                this.setCookie('demoId','', 0);
                valid = false;
            }
        } else if (this.customer[demoId] !== undefined) {
            var valid = true;
        } else {
            this.setCookie('demoId','', 0);
            valid = false;
        }

        if (valid) {
            $('.header, .footer').removeClass('hidden');
            $('#logo').attr('src', 'img/' + demoId + '.png');
            return demoId;
        }
    },

    getUserCookie: function() {
        return this.getCookie('DJUCID');
    },

    getProductTemplate: function(data, limit, isSearch) {
        var that = this;
        var items = '<div class="item active">';

        $.each(data.items, function(i) {
            if (i != 0 && (i % limit) == 0)
                items += '</div><div class="item">';

            var imageUrl = 'img/placeholder.png';

            if (data.items[i].images)
                imageUrl = (isSearch) ? that.customer[that.getCustomer()].imgUrl + data.items[i].images[0].slug + '-product.jpg' : data.items[i].images[0];

            items += '<div class="product">';

            if (!isSearch) {
                items += '<a href="//' + data.items[i].url + '">';
            }

            items += '<img class="product-image" src="' + imageUrl + '" title="' + data.items[i].title + '" />' +
            '<div class="product-title"><strong>' + data.items[i].brand.name + '</strong> ' + data.items[i].title + '</div>';

            if (data.items[i].price) {
                if (data.items[i].price.current) {
                    items += '<div class="product-price">$' + data.items[i].price.current + '</div>';
                }

                if (data.items[i].price.previous) {
                    items += '<div class="product-price-old"><span>$' + data.items[i].price.previous + '</span> (' + Math.round(100 - (data.items[i].price.current * 100 / data.items[i].price.previous)) + '%)</div>';
                }
            }

            if (!isSearch) {
                items += '</a>';
            }

            items += '<a id="' + data.items[i].id.replace('mx:','') + '" href="#" data-toggle="modal" data-target="#modal">more like this</a>';
            items += '<div class="product-brand hide">' + data.items[i].brand.name + '</div>';
            items += '<div class="product-group-id hide">' + data.items[i].group_id + '</div>';
            items += '</div>';
        });

        items += '</div>';
        return items;
    },

    showSuggester: function() {
        window.suggest = Datajet.usw(this.customer[this.getCustomer()].feedKey);
        window.imgUrl = this.settings.imgUrl;
    },

    showProductDetailModal: function() {
        var that = this;

        $('#modal').on('shown.bs.modal', function (e) {
            var id = $(e.relatedTarget)[0].id;
            var title = $('#' + id).parent().find('.product-title').text();

            $('#modal .modal-title').text(title);

            var url = that.buildUrl(that.settings.moreLikeThisUrl.replace('REGION', this.customer[this.getCustomer()].region), {
                sku: id.replace('mx--', ''),
                key: that.customer[that.getCustomer()].feedKey
            });

            $.get(url, function(data) {
                if (data && data.items) {

                    var items = '<img class="modal-image" src="'+ $('#' + id).parent().find('.product-image').attr('src') +'" title="'+ $('#' + id).parent().find('.product-title').text() +'" />';

                    items += '<div class="modal-text"><div class="modal-brand">' + $('#' + id).parent().find('.product-brand').text() + '</div>' + title + '</div><div style="clear: both"></div>';
                    items += '<hr /><h4>Similar Products</h4>';

                    items += that.getProductTemplate(data);

                    $('#modal .modal-body').html(items, 3);
                } else {
                    $('#modal .modal-body').html('Sorry, we couldnt find any similar items');
                }
            });
        });

        $('#modal-category').on('shown.bs.modal', function (e) {
            var id = $(e.relatedTarget)[0].id;
            var title = $('#' + id).find('.product-title').attr('data-val');

            var url = that.buildUrl(that.settings.bestSellersUrl.replace('REGION', that.customer[that.getCustomer()].region), {
                size: 6,
                from: 'now-1d',
                category: title,
                key: that.customer[that.getCustomer()].feedKey
            });

            $.get(url, function(data) {
                if (data && data.items) {
                    var items = that.getProductTemplate(data);
                    $('#modal-category .modal-body').html(items, 3);
                    $('#modal-category .modal-title').text(that.ucwords(title));
                } else {
                    $('#modal-category .modal-body').html('Sorry, we couldnt find any similar items');
                }
            });
        });

        $('#modal, #modal-category').on('hidden.bs.modal', function () {
            var el = $(this);
            el.find('.modal-title').text('');
            el.find('.modal-body').text('')
        });
    },

    showSearch: function(filters) {
        var that = this;

        function search(keyword) {
            if (keyword !== undefined && keyword !== '') {
                var url = that.buildUrl(that.settings.searchUrl.replace('REGION', that.customer[that.getCustomer()].region), {
                    fields: 'id,title,price,images,brand',
                    dum: 'replace',
                    size: 18,
                    dum_count: 0,
                    q: keyword,
                    key: that.customer[that.getCustomer()].feedKey,
                    rq: 5,
                    gs: 5
                });

                url += '&facet=price&facet=color&facet=brand';

                for (var i = 0; i <= that.data.filters.length; i++) {
                    if (that.data.filters[i] !== undefined)
                        url += '&filter=brand:' + that.data.filters[i];
                }

                $('.search-results, .filter-brand ul, .filter-color ul').html('');

                $.get(url, function(data) {
                    if (data && data.items) {
                        var dum = (data.dum) ? ' matched with <strong>"' + data.dum.sq + '"</strong>, ' : '';

                        $('.info').html('Searched for <strong>"' + keyword + '"</strong>,' + dum + ' found <strong>'  + data.count + '</strong> products');
                        var items = that.getProductTemplate(data, 4, true);
                        $('.search-results').html(items);
                        $('.search, .search-header').removeClass('hidden');

                        function brandClick() {
                            var el = $(this).find('input');
                            if (el[0].checked) {
                                var index = that.data.filters.indexOf(el.val());
                                if (index > -1) {
                                    that.data.filters.splice(index, 1);
                                }
                            } else {
                                if (that.data.filters.indexOf(el.val()) == -1)
                                    that.data.filters.push(el.val());
                            }

                            search($('#suggestions').val());
                        }

                        $.each(data.facets.brand, function(i) {
                            var li = $('<li><input type="checkbox" value="' + data.facets.brand[i].id + '"><label for="brand-' + data.facets.brand[i].id + '">' + data.facets.brand[i].text + ' (' + data.facets.brand[i].count + ')</label></li>');
                            $('.filter-brand ul').append(li);

                            if (that.data.filters.indexOf(data.facets.brand[i].id) > -1) {
                                li.find('input').prop('checked', true);
                            }

                            li.click(brandClick);
                        });

                        $.each(data.facets.color, function(i) {
                            if (data.facets.color[i].text) {
                                $('.filter-color ul').append('<li><input type="checkbox" id="color-' + data.facets.color[i].text + '" value="' + data.facets.color[i].text + '"><label for="color-' + data.facets.color[i].text + '">' + data.facets.color[i].text + ' (' + data.facets.color[i].count + ')</label></li>')
                            }
                        });

                        $('#price-min').val(data.facets.price.min);
                        $('#price-max').val(data.facets.price.max);

                    } else {
                        $('.search-header').removeClass('hidden');
                        $('.info').text('Couldnt find any results');
                    }
                });
            }
        }

        $('#search-button, #reset-filters').click(function(e) {
            e.preventDefault();
            search($('#suggestions').val());
        });
    },

    showRecentlyViewedFeed: function() {
        var url = this.buildUrl(this.settings.recentlyViewedUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            size: 15,
            from: 'now-1d',
            key: this.customer[this.getCustomer()].feedKey,
            uuid: this.getUserCookie()
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items && data.items[0]) {
                that.data.recentlyViewed = data;
                that.showPopularInCategory();
                that.showYouMightBeInterestedFeed();

                var items = that.getProductTemplate(data, 5);

                $('.recently-viewed').removeClass('hide');
                $('#recently-viewed-carousel > .carousel-inner').append(items);
                $('#recently-viewed-carousel').carousel({interval: false});
            }
        });
    },

    showPopularInCategory: function() {
        if (this.data.recentlyViewed.items[0]) {
            var data = this.data.recentlyViewed.items[0].categories[0];
            var categoryTitle = data[data.length - 1].name;
        }

        var url = this.buildUrl(this.settings.bestSellersUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            size: 15,
            from: 'now-1d',
            key: this.customer[this.getCustomer()].feedKey,
            category: categoryTitle
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items) {
                var items = that.getProductTemplate(data, 5);

                $('.popular-category').removeClass('hide');
                $('.popular-category-title').text(that.ucwords(categoryTitle));
                $('#popular-category-carousel > .carousel-inner').append(items);
                $('#popular-category-carousel').carousel({interval: false});
            }
        });
    },

    showYouMightBeInterestedFeed: function() {
        var that = this;

        var itemArr = {};
        itemArr.items = [];

        for (var k = 0; (k<3); k++) {
            var url = that.buildUrl(that.settings.moreLikeThisUrl.replace('REGION', this.customer[this.getCustomer()].region), {
                sku: that.data.recentlyViewed.items[k].id,
                key: that.customer[that.getCustomer()].feedKey
            });

            $.get(url, function(data) {
                if (data && data.items) {
                    for (var i = 0; i<5; i++) {
                        if (itemArr.items.indexOf(data.items[i]) == -1)
                            itemArr.items.push(data.items[i]);
                    }
                }
            });
        }

        setTimeout(function() {
            itemArr.items = that.shuffle(itemArr.items);
            var items = that.getProductTemplate(itemArr, 5);
            $('#interested-in-carousel > .carousel-inner').append(items);
            $('.interested-in').removeClass('hide');
            $('#interested-in-carousel').carousel({interval: false});
        }, 1000);
    },

    showTrendingProductsFeed: function() {
        var url = this.buildUrl(this.settings.trendingProductsUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            size: 15,
            from: 'now-1d',
            key: this.customer[this.getCustomer()].feedKey
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items) {
                var ids = '';

                $.each(data.items, function(i) {
                    ids += data.items[i].group_id + ','
                });

                ids = ids.substring(0, ids.length - 1);

                var rankerUrl = that.buildUrl(that.settings.rankerUrl, {
                    product_id: ids,
                    key: that.customer[that.getCustomer()].feedKey,
                    uuid: that.getUserCookie()
                });

                var rankedData = {};
                rankedData.items = [];

                $.get(rankerUrl, function(dataRanked) {
                    $.each(dataRanked.items, function(i) {
                        $.each(data.items, function(j) {
                            if (data.items[j].group_id == dataRanked.items[i].id.replace('mx:', '')) {
                                rankedData.items.push(data.items[j]);
                            }
                        });
                    });

                    var items = that.getProductTemplate(rankedData, 5);

                    $('.trending-products').removeClass('hide');
                    $('#trending-products-carousel > .carousel-inner').append(items);
                    $('#trending-products-carousel').carousel({interval: false});
                    $('.customer').text(that.customer[that.getCustomer()].name)
                });
            }
        });
    },

    showPopularCategories: function() {
        var url = this.buildUrl(this.settings.popularCategoriesUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            size: 6,
            from: 'now-1d',
            key: this.customer[this.getCustomer()].feedKey
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items) {
                var items = '';

                $.each(data.items, function(i) {
                    items +=
                        '<div class="col-md-4">' +
                        '<a id="' + data.items[i].title.replace(' ','-').replace(' ','-') + '" href="#" class="product-link" data-toggle="modal" data-target="#modal-category">' +
                        '<div class="category" style="background-image: url(' + data.items[i].images[0] + ')">' +
                        '<div class="product-title" data-val="' + data.items[i].title + '">' + that.ucwords(data.items[i].title) + '</div>' +
                        '</div></a></div>';
                });

                $('.popular-categories').removeClass('hide');
                $('.popular-categories.content').append(items);
            }
        });
    }
};

$(document).ready(function() {
    dataJetDemo.init();
});

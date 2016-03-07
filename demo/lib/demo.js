dataJetDemo = {
    data: {
        recentlyViewed: {}
    },

    settings: {
        bid: '1561876629',
        ucid: 'ccf2578673102fd8',
        clientKey: 'A32E23F56z7iC8CB947n12878C3d4157',
        feedKey: 'pYJDcBMdGR4tUM1OADt42LGvFSj7U5U',
        recentlyViewedUrl: 'http://feed.usw.datajet.io/1.1/recentlyviewed',
        moreLikeThisUrl: 'http://feed.usw.datajet.io/1.1/morelikethis',
        bestSellersUrl: 'http://feed.usw.datajet.io/1.1/bestsellers',
        trendingProductsUrl: 'http://feed.usw.datajet.io/1.1/trendingProducts',
        popularCategoriesUrl: 'http://feed-test2.usw.datajet.io/1.1/popularcategories',
        searchUrl: 'https://hawk.usw.datajet.io/1.0/product/',
        rankerUrl: 'https://ranker.datajet.io/0.1/score',
        pondUrl: 'https://pond.datajet.io/log',
        imgUrl: 'http://seer.usw.datajet.io/i',
        hawkImgUrl: '//media.linio.com.mx'
    },

    init: function() {
        if (this.getCustomer()) {
            this.getUserCookie();
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

        if (demoId == 'pYJDcB') {
            var valid = true;
        } else if (this.getUrlArgs()['key'] == 'pYJDcB') {
            this.setCookie('demoId', this.getUrlArgs()['key'], 100);
            demoId = this.getUrlArgs()['key'];
            valid = true;
        } else {
            this.setCookie('demoId','', 0);
            valid = false;
        }

        if (valid) {
            $('.header, .footer').removeClass('hidden');
            $('#logo').attr('src', 'img/' + demoId + '.png');
            return true;
        }
    },

    getUserCookie: function() {

    },

    getProductTemplate: function(data, limit, isSearch) {
        var that = this;
        var items = '<div class="item active">';

        $.each(data.items, function(i) {
            if (i != 0 && (i % limit) == 0)
                items += '</div><div class="item">';

            var imageUrl = (isSearch) ? that.settings.hawkImgUrl + data.items[i].images[0].slug + '-product.jpg' : data.items[i].images[0];

            items +=
                '<a id="' + data.items[i].id.replace('mx:','') + '" class="product" data-toggle="modal" data-target="#modal">' +
                '<img class="product-image" src="' + imageUrl + '" title="' + data.items[i].title + '" />' +
                '<div class="product-title"><strong>' + data.items[i].brand.name + '</strong> ' + data.items[i].title + '</div>';

            if (data.items[i].price) {
                if (data.items[i].price.current) {
                    items += '<div class="product-price">$' + data.items[i].price.current + '</div>';
                }

                if (data.items[i].price.previous) {
                    items += '<div class="product-price-old"><span>$' + data.items[i].price.previous + '</span> (' + Math.round(100 - (data.items[i].price.current * 100 / data.items[i].price.previous)) + '%)</div>';
                }
            }

            items += '<div class="product-brand hide">' + data.items[i].brand.name + '</div>';
            items += '<div class="product-group-id hide">' + data.items[i].group_id + '</div>';

            items += '</a>';
        });

        items += '</div>';
        return items;
    },

    showSuggester: function() {
        window.suggest = Datajet.usw(this.settings.feedKey);
        window.imgUrl = this.settings.imgUrl;
    },

    showProductDetailModal: function() {
        var that = this;

        $('#modal').on('shown.bs.modal', function (e) {
            var id = $(e.relatedTarget)[0].id;
            var title = $('#' + id).find('.product-title').text();

            $('.modal-title').text(title);

            var payload = {
                "source": "fishApp",
                "consumer_id": that.settings.clientKey,
                "payload": {
                    "title": title,
                    "skuConfig": $('#' + id).find('.product-group-id').text(),
                    "sku": id,
                    "brand": $('#' + id).find('.product-brand').text()
                },
                "event": "view",
                "local_timestamp": new Date().getTime(),
                "client": {
                    "device": "Simulator",
                    "application": "rocketinternet.Discovery-Demo",
                    "platform": navigator.platform + ', ' + navigator.appVersion
                },
                "bid": that.settings.bid
            };

            var pondUrl = that.buildUrl(that.settings.pondUrl, {
                key: that.settings.clientKey,
                p: JSON.stringify(payload)
            });

            $.get(pondUrl);

            var url = that.buildUrl(that.settings.moreLikeThisUrl, {
                sku: id.replace('mx--', ''),
                key: that.settings.feedKey
            });

            $.get(url, function(data) {
                if (data && data.items) {

                    var items = '<img class="modal-image" src="'+ $('#' + id).find('.product-image').attr('src') +'" title="'+ $('#' + id).find('.product-title').text() +'" />';

                    items += '<div class="modal-text"><div class="modal-brand">' + $('#' + id).find('.product-brand').text() + '</div>' + title + '</div><div style="clear: both"></div>';
                    items += '<hr /><h4>Similar Products</h4>';

                    items += that.getProductTemplate(data);

                    $('.modal-body').html(items, 3);
                } else {
                    $('.modal-body').html('Sorry, we couldnt find any similar items');
                }
            });
        });

        $('#modal-category').on('shown.bs.modal', function (e) {
            var id = $(e.relatedTarget)[0].id;
            var title = $('#' + id).find('.product-title').attr('data-val');

            var url = that.buildUrl(that.settings.bestSellersUrl, {
                size: 5,
                from: 'now-1w',
                category: title,
                key: that.settings.feedKey
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
            $('.modal-title').text('');
            $('.modal-body').text('')
        });
    },

    showSearch: function(filters) {

        var that = this;

        $('#reset-filters').click(function(e) {
            e.preventDefault();
        });

        var urlArgs = this.getUrlArgs();

        if (urlArgs['q'] !== undefined && urlArgs['q'] !== '') {
            var url = this.buildUrl(this.settings.searchUrl, {
                fields: 'id,title,price,images,brand',
                dum: 'replace',
                size: 18,
                dum_count: 0,
                q: urlArgs['q'],
                key: this.settings.clientKey,
                rq: 5,
                gs: 5
            });

            url += '&facet=price&facet=color&facet=brand&';

            if (filters) {
                url += filters;
            }

            $('.search-results, .filter-brand ul, .filter-color ul').html('');

            $.get(url, function(data) {
                if (data && data.items) {
                    var dum = (data.dum) ? ' matched with <strong>"' + data.dum.sq + '"</strong>, ' : '';

                    $('.info').html('Searched for <strong>"' + urlArgs['q'] + '"</strong>,' + dum + ' found <strong>'  + data.count + '</strong> products');

                    var items = that.getProductTemplate(data, 4, true);
                    $('.search-results').html(items);

                    $('.search, .search-header').removeClass('hidden');

                    $.each(data.facets.brand, function(i) {
                        $('.filter-brand ul').append('<li><input type="checkbox" id="brand-' + data.facets.brand[i].id + '" value="' + data.facets.brand[i].id + '"><label for="brand-' + data.facets.brand[i].id + '">' + data.facets.brand[i].text + ' (' + data.facets.brand[i].count + ')</label></li>')
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
    },

    showRecentlyViewedFeed: function() {
        var url = this.buildUrl(this.settings.recentlyViewedUrl, {
            size: 15,
            from: 'now-1w',
            key: this.settings.feedKey,
            uuid: this.settings.bid
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

        var url = this.buildUrl(this.settings.bestSellersUrl, {
            size: 15,
            from: 'now-1w',
            key: this.settings.feedKey,
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

        for (var k = 0; (k<3 &&  k< that.data.recentlyViewed.items.length); k++) {
            var url = that.buildUrl(that.settings.moreLikeThisUrl, {
                sku: that.data.recentlyViewed.items[k].id,
                key: that.settings.feedKey
            });

            $.get(url, function(data) {
                if (data && data.items) {
                    for (var i = 0; i<5; i++) {
                        itemArr.items.push(data.items[i]);
                    }
                }

                if (itemArr.items.length == 15) {
                    var items = that.getProductTemplate(itemArr, 5);

                    $('#interested-in-carousel > .carousel-inner').append(items);
                    $('.interested-in').removeClass('hide');
                    $('#interested-in-carousel').carousel({interval: false});
                }
            });
        }
    },

    showTrendingProductsFeed: function() {
        var url = this.buildUrl(this.settings.trendingProductsUrl, {
            size: 15,
            from: 'now-1w',
            key: this.settings.feedKey
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
                    key: that.settings.feedKey,
                    uuid: that.settings.bid
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
                });
            }
        });
    },

    showPopularCategories: function() {
        var url = this.buildUrl(this.settings.popularCategoriesUrl, {
            size: 6,
            from: 'now-1d',
            key: this.settings.feedKey
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items) {
                var items = '';

                $.each(data.items, function(i) {
                    items +=
                        '<div class="col-md-4">' +
                        '<a id="' + data.items[i].title.replace(' ','-').replace(' ','-') + '" href="#" target="_blank" class="product-link" data-toggle="modal" data-target="#modal-category">' +
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

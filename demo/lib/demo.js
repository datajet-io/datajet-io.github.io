dataJetDemo = {
    data: {
        recentlyViewed: {},
        brandFilters: [],
        colorFilters: [],
        priceFilters: [],
        categoryFilters: []
    },

    settings: {
        recentlyViewedUrl: 'http://feed.REGION.datajet.io/1.1/recentlyviewed',
        moreLikeThisUrl: 'http://feed.REGION.datajet.io/1.1/morelikethis',
        bestSellersUrl: 'http://feed.REGION.datajet.io/1.1/bestsellers',
        trendingProductsUrl: 'http://feed.REGION.datajet.io/1.1/trendingproducts',
        popularCategoriesUrl: 'http://feed.REGION.datajet.io/1.1/popularcategories',
        popularInCategoryUrl: 'http://feed.REGION.datajet.io/1.1/popularincategory',
        youMightLikeThisUrl: 'http://feed.REGION.datajet.io/1.1/youmightlike',
        specialDealsUrl: 'http://feed.REGION.datajet.io/1.1/specialdeals',
        searchUrl: 'https://hawk.REGION.datajet.io/1.0/product/',
        rankerUrl: 'https://ranker.datajet.io/0.1/score',
        suggesterImgUrl: 'http://seer.REGION.datajet.io/i',
        dateRange: 'now-1w'
    },

    customer: {
        pYJDcB: {
            name: 'Linio',
            feedKey: 'pYJDcBMdGR4tUM1OADt42LGvFSj7U5U',
            imgUrl: '//media.linio.com.mx',
            region: 'use',
            currency: '$'
        },
        jYNzew: {
            name: 'Home24',
            feedKey: 'jYNzewm744UMzDRUssQw46QzJhfRoCc',
            imgUrl: '//media.linio.com.mx',
            region: 'euw',
            currency: '€'
        },
        eNU8ds: {
            name: 'Dafiti',
            feedKey: 'eNU8dsoL2vmD0XBxNLhaKHZbGxflaKE',
            imgUrl: '//media.linio.com.mx',
            region: 'sae',
            currency: 'R$'
        },
        lkmifs: {
            name: 'Zalora',
            feedKey: 'lkmifsd2X28mLGpj0sdzvhNhjpXmkI0',
            imgUrl: '//static.zalora.net',
            region: 'apse',
            currency: 'RP'
        },
        xOniZZ: {
            name: 'Namshi',
            feedKey: 'xOniZZ6EIiyjNsL0tASVC1MSVPRknQe',
            region: 'euw',
            currency: 'AED'
        },
        vcWHfS: {
            name: 'Iconic',
            feedKey: 'vcWHfS2aVTiuhr4QnoBBpYmNh1sjaSe',
            region: 'apse',
            currency: 'AUD'
        }
    },

    init: function() {
        if (this.getCustomer()) {
            this.showSuggester();
            this.showSearch();
            this.showProductDetailModal();
            this.showRecentlyViewedFeed();
            this.showPopularInCategory();
            this.showYouMightLikeFeed();
            this.showTrendingProductsFeed();
            this.showSpecialDealsFeed();
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
            $('body').addClass(demoId);
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

            if (data.items[i].images) {
                if (that.customer[that.getCustomer()].name == 'Linio') {
                    imageUrl = (isSearch) ? that.customer[that.getCustomer()].imgUrl + data.items[i].images[0].slug + '-product.jpg' : data.items[i].images[0];
                } else {
                    imageUrl = data.items[i].images[0];
                }
            }

            items += '<div class="product">';

            if (data.items[i].url)
                items += '<a href="http://' + data.items[i].url.replace('http:', '') + '">';

            items += '<div class="product-image"><img src="' + imageUrl + '" title="' + data.items[i].title + '" /></div>' +
                '<div class="product-title"><strong>' + data.items[i].brand.name + '</strong> ' + data.items[i].title + '</div>';

            if (data.items[i].price) {
                if (data.items[i].price.current) {
                    items += '<div class="product-price">'+ that.customer[that.getCustomer()].currency + data.items[i].price.current + '</div>';
                }

                if (data.items[i].price.previous) {
                    items += '<div class="product-price-old"><span>' + that.customer[that.getCustomer()].currency + data.items[i].price.previous + '</span> (' + Math.round(100 - (data.items[i].price.current * 100 / data.items[i].price.previous)) + '%)</div>';
                }
            }

            if (data.items[i].url)
                items += '</a>';

            items += '<a id="' + data.items[i].id.replace('mx:','') + '" href="#" data-toggle="modal" data-target="#modal">more like this</a>';
            items += '<div class="product-brand hide">' + data.items[i].brand.name + '</div>';
            items += '<div class="product-group-id hide">' + data.items[i].group_id + '</div>';
            items += '</div>';
        });

        items += '</div>';
        return items;
    },

    showSuggester: function() {
        var region = this.customer[this.getCustomer()].region;

        if (region == 'usw') {
            window.suggester = Datajet.usw(this.customer[this.getCustomer()].feedKey);
        } else if (region == 'sae') {
            window.suggester = Datajet.sae(this.customer[this.getCustomer()].feedKey);
        } else if (region == 'euw') {
            window.suggester = Datajet.euw(this.customer[this.getCustomer()].feedKey);
        }

        window.suggesterImgUrl = this.settings.suggesterImgUrl.replace('REGION', region);
    },

    ranker: function() {
        var ids = '';

        $.each(data.items, function(i) {
            ids += data.items[i].group_id + ','
        });

        ids = ids.substring(0, ids.length - 1);

        var rankerUrl = this.buildUrl(this.settings.rankerUrl, {
            product_id: ids,
            key: this.customer[this.getCustomer()].feedKey,
            uuid: this.getUserCookie()
        });

        var rankedData = {};
        rankedData.items = data.items;

        $.get(rankerUrl, function(dataRanked) {
            $.each(dataRanked.items, function(i) {
                $.each(data.items, function(j) {
                    if (data.items[j].group_id == dataRanked.items[i].id.replace('mx:', '')) {
                        rankedData.items.push(data.items[j]);
                    }
                });
            });

            return rankedData;
        });
    },

    showProductDetailModal: function() {
        var that = this;

        $('#modal').on('shown.bs.modal', function (e) {
            var id = $(e.relatedTarget)[0].id;
            var title = $('#' + id).parent().find('.product-title').text();

            $('#modal .modal-title').text(title);

            var url = that.buildUrl(that.settings.moreLikeThisUrl.replace('REGION', that.customer[that.getCustomer()].region), {
                sku: id.replace('mx--', ''),
                key: that.customer[that.getCustomer()].feedKey
            });

            $.get(url, function(data) {
                if (data && data.items) {

                    var items = '<img class="modal-image" src="'+ $('#' + id).parent().find('.product-image > img').attr('src') +'" title="'+ $('#' + id).parent().find('.product-title').text() +'" />';

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
                from: that.settings.dateRange,
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

    showSearch: function() {
        var that = this;

        if (that.customer[that.getCustomer()].name == 'Zalora') {
            $('#search-container').hide();
        }

        function search(keyword) {
            if (keyword !== undefined && keyword !== '') {
                var url = that.buildUrl(that.settings.searchUrl.replace('REGION', that.customer[that.getCustomer()].region), {
                    fields: 'id,title,price,images,brand,url',
                    dum: 'replace',
                    size: 18,
                    sort:'relevance',
                    dum_count: 0,
                    q: keyword,
                    key: that.customer[that.getCustomer()].feedKey,
                    rq: 5,
                    gs: 5,
                    category_dept: 3
                });

                url += '&facet=price&facet=color&facet=brand&facet=category';

                for (var i = 0; i <= that.data.brandFilters.length; i++) {
                    if (that.data.brandFilters[i] !== undefined)
                        url += '&filter=brand:' + encodeURIComponent(that.data.brandFilters[i]);
                }

                for (i = 0; i <= that.data.colorFilters.length; i++) {
                    if (that.data.colorFilters[i] !== undefined)
                        url += '&filter=color:' + that.data.colorFilters[i];
                }

                if (that.data.categoryFilters.length > 0)
                    url += '&filter=category:' + encodeURIComponent(that.data.categoryFilters[that.data.categoryFilters.length - 1]);

                if (that.data.priceFilters['min'])
                    url += '&filter=price_min:' + that.data.priceFilters['min'];

                if (that.data.priceFilters['max'])
                    url += '&filter=price_max:' + that.data.priceFilters['max'];

                $.get(url, function(data) {
                    if (data && data.items) {

                        var dum = (data.dum) ? ' matched with <strong>"' + data.dum.sq + '"</strong>, ' : '';

                        $('.info').html('Searched for <strong>"' + keyword + '"</strong>,' + dum + ' found <strong>'  + data.count + '</strong> products<div id="related-queries"></div>');

                        if (data.guided_search) {
                            var guidedSearch = '<ul>';

                            for (var i = 0; i <= data.guided_search.length; i++) {
                                if (data.guided_search[i] !== undefined)
                                    guidedSearch += '<li><a href="#">' + data.guided_search[i] + '</a></li>';
                            }

                            guidedSearch += '</ul>';

                            $('#guided-search').html(guidedSearch).find('a').click(function(e) {
                                e.preventDefault();
                                var newVal = $('#suggestions').val() + ' ' +  $(this).text();
                                $('#suggestions').val(newVal);
                                that.data.brandFilters = [];
                                search(newVal);
                            });
                        } else {
                            $('#guided-search').html('')
                        }

                        if (data.related_queries) {
                            var relatedQueries = 'Related Queries: ';

                            for (var i = 0; i <= data.related_queries.length; i++) {
                                if (data.related_queries[i] !== undefined)
                                    relatedQueries += '<a href="#">' + data.related_queries[i] + '</a>, ';
                            }

                            relatedQueries = relatedQueries.substring(0, relatedQueries.length - 2);

                            $('#related-queries').html(relatedQueries).find('a').click(function(e) {
                                e.preventDefault();
                                var newVal = $(this).text();
                                $('#suggestions').val(newVal);
                                that.data.brandFilters = [];
                                search(newVal);
                            });
                        }

                        var items = that.getProductTemplate(data, 4, true);

                        $('.search-results').html(items);
                        $('.search, .search-header').removeClass('hidden');

                        function brandClick() {
                            var el = $(this).parent().find('input');
                            if (el[0].checked) {
                                var index = that.data.brandFilters.indexOf(el.val());
                                if (index > -1) {
                                    that.data.brandFilters.splice(index, 1);
                                }
                            } else {
                                if (that.data.brandFilters.indexOf(el.val()) == -1)
                                    that.data.brandFilters.push(el.val());
                            }

                            search($('#suggestions').val());
                        }

                        if (data.facets.brand) {
                            var li = '';
                            $.each(data.facets.brand, function(i) {
                                var checked = '';
                                if (that.data.brandFilters.indexOf(data.facets.brand[i].id) > -1) {
                                    checked = ' checked="checked"';
                                }

                                li += '<li><input' + checked + ' type="checkbox" value="' + data.facets.brand[i].id + '" id="' + data.facets.brand[i].id + '"><label for="' + data.facets.brand[i].id + '">' + data.facets.brand[i].text + ' (' + data.facets.brand[i].count + ')</label></li>';
                            });

                            $('.filter-brand ul').html(li).find('label').click(brandClick);
                            $('.filter-brand-title').show();
                        }
                        else {
                            that.data.brandFilters = [];
                            $('.filter-brand ul').html('')
                        }

                        function categoryClick(e) {
                            e.preventDefault();
                            var el = $(this);

                            if (el.hasClass('checked')) {
                                if ($(this).attr('data-deep') == 3)
                                    that.data.categoryFilters.splice(-1,1);
                                else if ($(this).attr('data-deep') == 2)
                                    that.data.categoryFilters.splice(-1,2);
                                else if ($(this).attr('data-deep') == 1)
                                    that.data.categoryFilters.splice(-1,3);
                            } else {
                                if ($(this).attr('data-deep') == 1)
                                    that.data.categoryFilters.splice(-1,2);

                                that.data.categoryFilters[$(this).attr('data-deep') - 1] = el.attr('data-value');
                            }
                            search($('#suggestions').val());
                        }

                        if (data.facets.category) {

                            li = '';

                            $.each(data.facets.category, function(i) {
                                var checked = '';
                                var subCat = '';

                                if (that.data.categoryFilters[0] == data.facets.category[i].id) {
                                    checked = 'checked"';

                                    if (data.facets.category[i].items) {
                                        subCat = '<ul>';
                                        $.each(data.facets.category[i].items, function(j) {
                                            var subChecked = '';

                                            var subSubCat = '';
                                            if (that.data.categoryFilters[1] == data.facets.category[i].items[j].id) {
                                                subChecked = 'checked';

                                                if (data.facets.category[i].items[j].items) {
                                                    subSubCat = '<ul>';
                                                    $.each(data.facets.category[i].items[j].items, function(k) {
                                                        var subSubChecked = '';

                                                        if (that.data.categoryFilters[2] == data.facets.category[i].items[j].items[k].id) {
                                                            subSubChecked = 'checked';
                                                        }
                                                        subSubCat += '<li><a href="#" class="' + subSubChecked + '" data-value="' + data.facets.category[i].items[j].items[k].id + '" data-deep="' + data.facets.category[i].items[j].items[k].deep + '">' + data.facets.category[i].items[j].items[k].text + ' (' + data.facets.category[i].items[j].items[k].count + ')</a></li>';
                                                    });
                                                    subSubCat += '</ul>';
                                                }
                                            }
                                            subCat += '<li><a href="#" class="' + subChecked + '" data-value="' + data.facets.category[i].items[j].id + '" data-deep="' + data.facets.category[i].items[j].deep + '">' + data.facets.category[i].items[j].text + ' (' + data.facets.category[i].items[j].count + ')</a>' + subSubCat + '</li>';
                                        });
                                        subCat += '</ul>';
                                    }
                                }

                                li += '<li><a href="#" class="' + checked + '" data-value="' + data.facets.category[i].id + '" data-deep="' + data.facets.category[i].deep + '">' + data.facets.category[i].text + ' (' + data.facets.category[i].count + ')</a>' + subCat + '</li>';
                            });

                            $('.filter-category ul').html(li).find('a').click(categoryClick);
                            $('.filter-category-title').show();
                        }
                        else {
                            that.data.brandFilters = [];
                            $('.filter-brand ul').html('')
                        }

                        function colorClick() {
                            var el = $(this).find('input');
                            if (el[0].checked) {
                                var index = that.data.colorFilters.indexOf(el.val());
                                if (index > -1) {
                                    that.data.colorFilters.splice(index, 1);
                                }
                            } else {
                                if (that.data.colorFilters.indexOf(el.val()) == -1)
                                    that.data.colorFilters.push(el.val());
                            }

                            search($('#suggestions').val());
                        }

                        if (data.facets.color) {
                            li = '';
                            $.each(data.facets.color, function(i) {
                                var checked = '';
                                if (that.data.colorFilters.indexOf(data.facets.color[i].text) > -1) {
                                    checked = ' checked="checked"';
                                }

                                li += '<li><input' + checked + ' type="checkbox" value="' + data.facets.color[i].text + '"><label>' + data.facets.color[i].text + ' (' + data.facets.color[i].count + ')</label></li>';
                            });

                            $('.filter-color ul').html(li).find('li').click(colorClick);
                            $('.filter-color-title, .filter-color').show();

                        } else {
                            $('.filter-color-title, .filter-color').hide();
                        }

                        if (data.facets.price) {
                            $('#price-min, #price-max').off('keypress').on('keypress', function(e) {
                                if (e.keyCode == 13){
                                    that.data.priceFilters['min'] = $('#price-min').val();
                                    that.data.priceFilters['max'] = $('#price-max').val();
                                    search($('#suggestions').val());
                                }
                            });

                            $('#price-min-text').text('min: ' + data.facets.price.min);
                            $('#price-max-text').text('max: ' + data.facets.price.max);
                            $('.filter-price-title, .filter-price').show();
                        } else {
                            delete that.data.priceFilters['min'];
                            delete that.data.priceFilters['max'];
                            $('#price-min').val('');
                            $('#price-max').val('');
                        }

                    } else {
                        $('.search-header').removeClass('hidden');
                        $('.info').text('Couldnt find any results');
                        $('#guided-search').html('');
                        $('.search-results').html('');
                        that.data.brandFilters = [];
                        that.data.priceFilters = [];
                        $('.filter-brand ul').html('');
                        $('.filter-price-title, .filter-price').hide();
                        $('.filter-brand-title').hide();
                        $('#price-min').val('');
                        $('#price-max').val('');
                    }
                });
            }
        }

        $('#search-button').click(function(e) {
            e.preventDefault();
            search($('#suggestions').val());
        });
    },

    showRecentlyViewedFeed: function() {
        var that = this;

        var url = this.buildUrl(this.settings.recentlyViewedUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            size: 15,
            from: this.settings.dateRange,
            key: this.customer[this.getCustomer()].feedKey,
            uuid: this.getUserCookie()
        });

        $.get(url, function(data) {
            if (data && data.items && data.items.length > 0) {
                that.data.recentlyViewed = data;

                var items = that.getProductTemplate(data, 5);

                $('.recently-viewed').removeClass('hidden');
                $('#recently-viewed-carousel > .carousel-inner').append(items);
                $('#recently-viewed-carousel').carousel({interval: false});
            }
        });
    },

    showPopularInCategory: function() {
        var url = this.buildUrl(this.settings.popularInCategoryUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            from: this.settings.dateRange,
            key: this.customer[this.getCustomer()].feedKey,
            uuid: this.getUserCookie()
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items && data.items.length > 0) {
                var items = that.getProductTemplate(data, 5);

                $('.popular-category').removeClass('hidden');
                $('.popular-category-title').text(that.ucwords(data.items[0].categories[0][1].name));
                $('#popular-category-carousel > .carousel-inner').append(items);
                $('#popular-category-carousel').carousel({interval: false});
            }
        });
    },

    showYouMightLikeFeed: function() {
        var url = this.buildUrl(this.settings.youMightLikeThisUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            from: this.settings.dateRange,
            key: this.customer[this.getCustomer()].feedKey,
            uuid: this.getUserCookie()
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items && data.items.length > 0) {
                var items = that.getProductTemplate(data, 5);

                $('#interested-in-carousel > .carousel-inner').html(items);
                $('.interested-in').removeClass('hidden');
                $('#interested-in-carousel').carousel({interval: false});
            }
        });
    },


    showSpecialDealsFeed: function() {
        var url = this.buildUrl(this.settings.specialDealsUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            key: this.customer[this.getCustomer()].feedKey,
            uuid: this.getUserCookie()
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items && data.items.length > 0) {
                var items = that.getProductTemplate(data, 5);

                $('#special-deals-carousel > .carousel-inner').html(items);
                $('.special-deals').removeClass('hidden');
                $('#special-deals-carousel').carousel({interval: false});
            }
        });
    },

    showTrendingProductsFeed: function() {
        var url = this.buildUrl(this.settings.trendingProductsUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            size: 15,
            from: this.settings.dateRange,
            key: this.customer[this.getCustomer()].feedKey
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items && data.items.length > 0) {
                var items = that.getProductTemplate(data, 5);

                $('.trending-products').removeClass('hidden');
                $('#trending-products-carousel > .carousel-inner').append(items);
                $('#trending-products-carousel').carousel({interval: false});
                $('.customer').text(that.customer[that.getCustomer()].name)
            }
        });
    },

    showPopularCategories: function() {
        var url = this.buildUrl(this.settings.popularCategoriesUrl.replace('REGION', this.customer[this.getCustomer()].region), {
            size: 6,
            from: this.settings.dateRange,
            key: this.customer[this.getCustomer()].feedKey
        });

        var that = this;

        $.get(url, function(data) {
            if (data && data.items) {
                var items = '';

                $.each(data.items, function(i) {
                    items +=
                        '<div class="col-md-4">' +
                        '<a id="' + data.items[i].title.replace(/\s+/g, '-') + '" href="#" class="product-link" data-toggle="modal" data-target="#modal-category">' +
                        '<div class="category" style="background-image: url(' + data.items[i].images[0] + ')">' +
                        '<div class="product-title" data-val="' + data.items[i].title + '">' + that.ucwords(data.items[i].title) + '</div>' +
                        '</div></a></div>';
                });

                $('.popular-categories').removeClass('hidden');
                $('.popular-categories.content').append(items);
            }
        });
    }
};

$(document).ready(function() {
    dataJetDemo.init();
});

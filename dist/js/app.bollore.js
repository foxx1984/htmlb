'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    function Slider(id) {
        var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
            container: id + ' .slider__ul',
            items: id + ' .slider__item',
            startSlide: 0,
            speed: 5000,
            isAuto: true,
            next: id + ' .slider__next',
            prev: id + ' .slider__prev',
            modeTranslate: false
        };

        _classCallCheck(this, Slider);

        this.sliderInterval = null;
        this.options = obj;
        this.id = id;
        this.currentItem = this.getCurrent();
        this.itemsElem = document.querySelector('' + this.options.items);
        this.ulContainer = document.querySelector('' + this.options.container);
        this.next = document.querySelector('' + this.options.next);
        this.prev = document.querySelector('' + this.options.prev);

        this.delta = 60;
        this.marginLeft = -60; //* translate : -60vw ou merginleft  -40.5 ;
        this.marginDefautLeft = 0; //* translate : -60vw ou merginleft  -40.5 ;
        this.elemLast = document.querySelector(this.id + ' .slider__item:last-child');
        this.elemFirst = document.querySelector(this.id + ' .slider__item:first-child');

        this.init();
    }

    _createClass(Slider, [{
        key: 'getPositionItem',
        value: function getPositionItem() {
            var currentItem = this.getCurrent();

            //test first child
            var firstchild = document.querySelector(this.id + ' .slider__item:first-child');
            var lastchild = document.querySelector(this.id + ' .slider__item:last-child');

            //check current item not null
            if (currentItem != null) {

                //test first child ?
                if (currentItem.previousElementSibling == firstchild) {
                    this.elemFirst = firstchild;
                } else this.elemFirst = currentItem.previousElementSibling;

                //test last child ?
                if (currentItem.nextElementSibling == lastchild) {
                    this.elemLast = lastchild;
                } else this.elemLast = currentItem.nextElementSibling;
            }
        }
    }, {
        key: 'addItem',
        value: function addItem(elem, type) {
            var _this2 = this;

            var _token = type == 'next' ? this.elemFirst : this.elemLast;

            //Get Transform TranslateX
            var translateX = 0;

            //Mode Get translateX
            if (this.options.modeTranslate) {
                if (this.ulContainer.style['transform'] != null && this.ulContainer.style['transform'] != "") {
                    var _translateXString = this.ulContainer.style['transform'].replace('translateX(', '').replace('vw)', '').replace('calc(', '');

                    this.marginLeft = parseFloat(_translateXString);
                } else {
                    this.marginLeft = 0;
                }

                // //Get marginLeftg par defaut
                // if (this.ulContainer.style['marginLeft'] != null && this.ulContainer.style['marginLeft'] != "") {
                //     let _marginLeft = this.ulContainer.style['marginLeft'].replace('vw)', '').replace('calc(', '');

                //     this.marginLeft = parseFloat(_marginLeft);

                // } else {
                //     this.marginLeft = 0;
                // }

            }

            if (this.options.isPaginationNormal) {

                _token = type == 'next' ? this.elemLast : this.elemFirst;
            }

            var _item = _token;
            var _cloneItem = null;

            if (_item != null) {

                //bouton suivant
                if (type == 'next') {

                    _cloneItem = _item.cloneNode(true);

                    //mode translate
                    if (this.options.modeTranslate) {

                        this.marginLeft = -this.delta + this.marginLeft;

                        //set position element
                        this.getPositionItem();
                        var delta = this.posElement(this.elemLast, this.elemFirst, this.marginLeft, type);

                        this.setSlide(delta, 'translate');
                        //set item current
                        this.addCurent(elem);
                        setTimeout(function () {
                            _this2.setSlide(delta + _this2.delta, 'translate', 'transition:none;');
                            _this2.ulContainer.insertBefore( /*elem add*/_this2.elemFirst, /*context*/null);
                        }, 500);
                    } else {
                        //pagination normal
                        if (this.options.isPaginationNormal) {
                            _cloneItem = elem;
                            _item.after(_cloneItem);
                        } else {

                            _item.remove();
                            elem.after(_cloneItem);
                        }
                    }
                }

                //bouton précédent
                if (type == 'prev') {

                    //element dernier de la liste à copier
                    _cloneItem = _item.cloneNode(true);
                    if (this.options.modeTranslate) {
                        this.marginLeft = this.delta + this.marginLeft;

                        //set position element
                        this.getPositionItem();
                        var _delta = this.posElement(this.elemLast, this.elemFirst, this.marginLeft, type);

                        this.setSlide(_delta, 'translate');
                        //set item current
                        this.addCurent(elem);
                        setTimeout(function () {
                            _this2.setSlide(_delta - _this2.delta, 'translate', 'transition:none;');
                            _this2.ulContainer.insertBefore( /*elem add*/_this2.elemLast, /*context*/_this2.elemFirst);
                        }, 500);
                    } else {
                        if (this.options.isPaginationNormal) {
                            _cloneItem = elem;
                            _item.before(_cloneItem);
                            return;
                        } else {

                            _cloneItem = _item;
                            elem.before(_cloneItem);
                        }
                    }
                }
            }
        }
    }, {
        key: 'onNextClick',
        value: function onNextClick(args) {

            var _newItem = this.getItem('next');
            if (_newItem != null) {

                this.addItem(_newItem, 'next');
            }
        }
    }, {
        key: 'getItem',
        value: function getItem(type) {
            var _li = null;

            if (type == 'next') {
                if (this.currentItem != null) {
                    _li = this.currentItem.nextElementSibling;
                    if (this.options.isPaginationNormal) {
                        _li = document.querySelector(this.id + ' .slider__item:first-child');
                    }
                }
            }
            if (type == 'prev') {
                _li = this.currentItem.previousElementSibling;
                if (this.options.isPaginationNormal) {
                    _li = document.querySelector(this.id + ' .slider__item:last-child');
                }
            }
            return _li;
        }
    }, {
        key: 'onPrevClick',
        value: function onPrevClick(args) {

            var _newItem = this.getItem('prev');
            if (_newItem != null) {

                //slide prev
                this.addItem(_newItem, 'prev');
            }
        }
    }, {
        key: 'onPagination',
        value: function onPagination() {
            var _this3 = this;

            if (this.next != null) {
                this.next.addEventListener('click', function (args) {
                    if (_this3.sliderInterval != null) {
                        clearInterval(_this3.sliderInterval);
                        _this3.slideAuto();
                    }
                    _this3.onNextClick(args);
                });
            }
            if (this.prev != null) {
                this.prev.addEventListener('click', function (args) {
                    if (_this3.sliderInterval != null) {
                        clearInterval(_this3.sliderInterval);
                        _this3.slideAuto();
                    }
                    _this3.onPrevClick(args);
                });
            }
        }
    }, {
        key: 'getCurrent',
        value: function getCurrent() {
            var _items = document.querySelectorAll(this.id + ' .slider__item--current');
            return _items[0];
        }
    }, {
        key: 'addCurent',
        value: function addCurent(elem) {
            var _items = document.querySelectorAll(this.id + ' .slider__item--current');
            _items = [].slice.call(_items || []);
            for (var i = 0; i < _items.length; i++) {
                _items[i].classList.remove('slider__item--current');
            }
            elem.classList.add('slider__item--current');
            this.currentItem = elem;
        }
    }, {
        key: 'setMoveItem',
        value: function setMoveItem() {
            var _items = document.querySelectorAll('' + this.options.items);
            _items = [].slice.call(_items || []);
            if (_items != null && _items.length > 1) {

                var _elemClone1 = _items[0];
                if (!this.options.isPaginationNormal) {
                    _items[0].remove();
                    _items[1].after(_elemClone1);
                } else {
                    _elemClone1 = _items[_items.length - 1];
                }

                this.addCurent(_elemClone1);
            }
        }
    }, {
        key: 'slideAuto',
        value: function slideAuto() {
            var _this4 = this;

            if (this.options.isAuto) {
                this.sliderInterval = setInterval(function () {
                    _this4.onNextClick();
                }, this.options.speed);
            }
        }
    }, {
        key: 'setSlide',
        value: function setSlide(delta) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'margin';
            var transition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

            if (type == 'translate') {
                this.ulContainer.setAttribute('style', transition + 'transform:translateX(calc(' + delta + 'vw))');
                if (delta == 0) {
                    this.ulContainer.setAttribute('style', '' + transition);
                }
            } else if (type = 'margin') {
                this.ulContainer.setAttribute('style', transition + 'margin-left:calc(' + delta + 'vw)');
            } else {
                this.ulContainer.setAttribute('style', transition + 'margin-left:calc(' + delta + 'vw)');
            }
        }
    }, {
        key: 'getLastFirst',
        value: function getLastFirst() {}
    }, {
        key: 'posElement',
        value: function posElement(elemLast, elemFirst) {
            var mydelta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;


            var delta = 0;

            if (elemLast != null && elemFirst != null) {

                var elemCloneLast = elemLast.cloneNode(true);

                if (type == 'prev') {
                    if (mydelta == null) {
                        delta = this.marginDefautLeft - this.delta;
                    } else {
                        delta = mydelta;
                    }
                    return delta;
                }

                if (type == 'next') {
                    if (mydelta == null) {
                        delta = this.marginDefautLeft + this.delta;
                    } else {
                        delta = mydelta;
                    }
                    return delta;
                    // this.setSlide(delta, 'translate');
                    // this.ulContainer.insertBefore( /*elem add*/ elemCloneLast, /*context*/ elemFirst);
                }
                //this.setSlide(delta);
            }
        }
    }, {
        key: 'init',
        value: function init() {
            //Move item Show Middle slider--custom ou slider normal

            this.setMoveItem();

            //Set events pagination

            this.onPagination();

            //fix position item
            this.elemLast = document.querySelector(this.id + ' .slider__item:last-child');
            this.elemFirst = document.querySelector(this.id + ' .slider__item:first-child');

            // //activate en mode translate
            // if (this.options.modeTranslate) {

            //     this.posElement(this.elemLast, this.elemFirst);

            // }

            //this.slideAuto();

        }
    }]);

    return Slider;
}();

var Bollore = function () {
    function Bollore() {
        _classCallCheck(this, Bollore);

        try {

            this.init();
        } catch (e) {
            console.log(e);
        }
    }

    _createClass(Bollore, [{
        key: 'init',
        value: function init() {
            this.mediaDesktop = '1025px';
            this.elemAnim = document.querySelector('.header__blocSousNav');

            this.mediaTabletLarge = '1024px';
            this.mobile = '767px';
            this.closeMenuPrincipal = document.querySelector('.close');
            this.content = document.querySelector('.content');
            this.overlay = '<div class="overlay"></div>';
            this.scrollTopDocument = null;
            this._sliderElem = document.querySelectorAll('.slider');
            this._sliderElemArray = Array.prototype.slice.call(this._sliderElem);
            this._sliderElemArray2 = [].slice.call(this._sliderElem);
            this._slider = [];
            this.header = document.querySelector('.header');
            this.keyfigureitemsTmp = [];
            this.levelAction = [];
            this.isRunning = false;
            this.setInitDevice();
            this.setSlider();

            this.setResize();
            this.hoverPublication();

            //bloc home chiffre key
            this.animkeyfigure('.chiffre__bloc', '.chiffre__bloc .chiffre__keyFigure', '.GroupeChiffres', 500);

            //bloc chiffre cles /bloc chiffre red
            this.animkeyfigure('.chiffreKey__pushChiffre', '.chiffreKey__pushChiffre .chiffre__keyFigure', '.chiffreKey', 500);

            //bloc bourse
            this.animkeyfigure('.cours__footer', '.cours__footer .animcours', '.cours__footer', -700);

            //set scroll to the top doc on reload
            this.setScrolltop();

            //anim reglemente

            //hide button more if <= 3  
            this.scanAnimReglemente(3);
            this.animReglemente();
        }
    }, {
        key: 'setScrolltop',
        value: function setScrolltop() {

            window.scrollTo(0, 0);
            window.scroll(0, 0);
        }
    }, {
        key: 'animeKeyBourse',
        value: function animeKeyBourse() {}
    }, {
        key: 'scanAnimReglemente',
        value: function scanAnimReglemente(sueil) {
            var elemLinkPlus = document.querySelectorAll('.link__plus');
            if (elemLinkPlus != null && elemLinkPlus.length > 0) {

                elemLinkPlus.forEach(function (link, index, datas) {
                    var list = link.closest('.listeDocs');
                    var elemUl = list.querySelector('.listeDocs__bloc');
                    if (elemUl != null) {
                        var items = elemUl.querySelectorAll('.listeDocs__item');
                        if (items != null && items.length > 0) {

                            var height = 0;

                            var nbreLigne = Math.floor(items.length / 3);
                            height = items[0].offsetHeight * nbreLigne;
                            height += 200;

                            if (nbreLigne <= sueil) {
                                link.classList.add('link__plus--off');
                                elemUl.setAttribute('style', 'height:' + height + 'px;');
                            } else {}
                        }
                    }
                });
            }
        }
    }, {
        key: 'animReglemente',
        value: function animReglemente() {
            var elemLinkPlus = document.querySelectorAll('.link__plus');
            if (elemLinkPlus != null && elemLinkPlus.length > 0) {

                this.addEventListenerAll(elemLinkPlus, 'click', function (args) {
                    args.preventDefault();
                    args.currentTarget.classList.add('link__plus--off');

                    var elemParent = args.currentTarget.closest('.listeDocs');
                    if (elemParent != null) {
                        var elemUl = elemParent.querySelector('.listeDocs__bloc');
                        if (elemUl != null) {
                            var items = elemUl.querySelectorAll('.listeDocs__item');
                            var height = 0;
                            if (items != null && items.length > 0) {
                                var nbreLigne = Math.floor(items.length / 3);

                                height = items[0].offsetHeight * nbreLigne;
                                height += 220;
                            }
                            elemUl.setAttribute('style', 'height:' + height + 'px;');
                        }
                    }
                });
            }
        }
    }, {
        key: 'animkeyfigure',
        value: function animkeyfigure(parent, selectorKey, declencheur, sensibility) {
            var _this5 = this;

            var declenchement = document.querySelector(declencheur);
            var delta = sensibility;

            //check position to activate anim


            window.addEventListener('scroll', function (args) {
                if (!_this5.isRunning) {

                    var _parent = document.querySelector(parent);

                    if (_parent != null && !_parent.classList.contains('end')) {

                        var keyfigureitems = document.querySelectorAll(selectorKey);

                        var keyfigureitemsTmp = [].slice.call(keyfigureitems);

                        if (declenchement != null) {

                            var declenchementBound = declenchement.getBoundingClientRect();
                            if (declenchementBound != null) {
                                var scrolling = declenchementBound.top;

                                if (_this5.scrollTopDocument + delta > scrolling) {
                                    animItem.call(_this5, keyfigureitemsTmp, _parent);
                                }
                            }
                        }
                    }
                }
            });

            var animItem = function animItem(keyfigureitemsTmp, parent) {
                var _this6 = this;

                this.isRunning = true;

                if (keyfigureitemsTmp != null && keyfigureitemsTmp.length > 0) {

                    for (var i = 0; i < keyfigureitemsTmp.length; i++) {
                        var elem = keyfigureitemsTmp[i];

                        if (elem != null) {
                            elem.classList.remove('chiffre__keyFigure--off');
                            var chifreH3 = elem.querySelector('.chiffre__h3');
                            if (elem.classList.contains('animcours')) {
                                chifreH3 = elem;
                            }
                            if (chifreH3 != null) {
                                var decimal_places;
                                var decimal_factor;
                                var options;

                                (function () {

                                    var max = chifreH3.dataset["max"];
                                    var suffixe = chifreH3.dataset["suffixe"] == undefined ? "" : chifreH3.dataset["suffixe"];
                                    var prefixe = chifreH3.dataset["prefixe"] == undefined ? "" : chifreH3.dataset["prefixe"];
                                    var separator = $.animateNumber.numberStepFactories.separator(',');
                                    var index = 0;
                                    var _decimal_place = 1;
                                    if (max.indexOf('.') > -1) {
                                        index = max.indexOf('.') + 1;
                                        _decimal_place = parseInt(max.substr(index).length, 10);
                                    }
                                    decimal_places = _decimal_place;
                                    decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);

                                    if (max != null && max != "") {
                                        options = {
                                            number: max
                                        };


                                        if (max.indexOf('.') > -1) {
                                            options = {
                                                number: max * decimal_factor,
                                                numberStep: function numberStep(now, tween) {
                                                    var floored_number = Math.floor(now) / decimal_factor,
                                                        target = $(tween.elem);

                                                    if (decimal_places > 0) {
                                                        // force decimal places even if they are 0
                                                        floored_number = floored_number.toFixed(decimal_places);

                                                        // replace '.' separator with ','
                                                        floored_number = floored_number.toString().replace('.', ',');
                                                    }

                                                    target.text('' + prefixe + floored_number + ' ' + suffixe);
                                                }

                                            };
                                        }
                                        $(chifreH3).animateNumber(options);
                                    }
                                    keyfigureitemsTmp.splice(i, 1);
                                })();
                            }
                        }
                        break;
                    }

                    setTimeout(function () {
                        animItem.call(_this6, keyfigureitemsTmp, parent);
                    }, 300);
                } else {
                    this.isRunning = false;

                    parent.classList.add('end');
                }
            };
        }
    }, {
        key: 'hoverPublication',
        value: function hoverPublication() {
            var links = document.querySelectorAll('.--link');
            if (links != null && links.length > 0) {
                this.addEventListenerAll(links, 'mouseover', function (args) {

                    var link = args.currentTarget;
                    if (link != null) {
                        var post = null;
                        if (link.classList.contains('listeDocs__lien')) {
                            post = link.closest('.listeDocs__item');
                        } else post = link.closest('.post');

                        if (post != null) {
                            var postImg = null;
                            if (post.classList.contains('listeDocs__item')) {
                                postImg = post.querySelector('.listeDocs__visuel');
                            } else postImg = post.querySelector('.post__img');

                            if (postImg != null) {
                                if (postImg.classList.contains('listeDocs__visuel')) {
                                    postImg.classList.toggle('listeDocs__visuel--on');
                                } else postImg.classList.toggle('post__img--on');
                            }
                        }
                    }
                });

                this.addEventListenerAll(links, 'mouseout', function (args) {
                    var link = args.currentTarget;
                    if (link != null) {

                        var post = null;
                        if (link.classList.contains('listeDocs__lien')) {
                            post = link.closest('.listeDocs__item');
                        } else post = link.closest('.post');

                        if (post != null) {

                            var postImg = null;
                            if (post.classList.contains('listeDocs__item')) {
                                postImg = post.querySelector('.listeDocs__visuel');
                            } else postImg = post.querySelector('.post__img');

                            if (postImg != null) {
                                if (postImg.classList.contains('listeDocs__visuel')) {
                                    postImg.classList.toggle('listeDocs__visuel--on');
                                } else postImg.classList.toggle('post__img--on');
                            }
                        }
                    }
                });
            }
        }
    }, {
        key: 'setMenuOpen',
        value: function setMenuOpen(tag) {
            localStorage.setItem('menuOpen', tag);
        }
    }, {
        key: 'setMenu',
        value: function setMenu() {

            this.setMenuOpen('0');
            //Scrolling affiche menu en top
            this.setOnEventScrollTopMenuSticky();

            //2eme niveau
            this.setOnClickLevelMenu('menu__li', '.menu__ul--level1 .menu__li', {
                on: 'menu__li--on',
                off: 'menu__li--off',
                active: 'menu__li--active'

            }, {
                _selector: '.menu__ul--level1 .menu__li--on:not(.menu__li--active)',
                _li: {

                    on: 'menu__li--on',
                    off: 'menu__li--off'

                }
            });

            //3eme niveau
            this.setOnClickLevelMenu('secondMenu__li', '.secondMenu__li .secondMenu__title', {
                on: 'secondMenu__li--on',
                off: 'secondMenu__li--off',
                active: 'secondMenu__li--active'

            }, {
                _selector: '.secondMenu__ul--level1 .secondMenu__li:not(.secondMenu__li--active)',
                _li: {

                    on: 'secondMenu__li--on',
                    off: 'secondMenu__li--off'

                }
            });

            this.setOnClickMenuClose();
        }
    }, {
        key: 'setResize',
        value: function setResize() {
            this.setContentMenuResize();
            this.setBlocSliderFooter();
            this.setSearch();
            this.setBurger();
            this.setMenu();
            //this.setFixRefresh();

        }
    }, {
        key: 'setFixRefresh',
        value: function setFixRefresh() {
            var _bloc = document.querySelector('.header__bloc');
            if (_bloc != null) {

                if (window.matchMedia('(max-width: ' + this.mediaTabletLarge + ')').matches) {
                    _bloc.classList.remove('header__bloc--fix');
                } else {
                    setTimeout(function () {
                        _bloc.classList.remove('header__bloc--fix');
                        _bloc.classList.add('header__bloc--fix');
                        _bloc.classList.remove('header__bloc--fix');
                        console.log("Add fix menu");
                    }, 1500);
                }
            }
        }
    }, {
        key: 'menuWithBtnBack',
        value: function menuWithBtnBack(_ref) {
            var _this8 = this;

            var _ref$_level = _ref._level,
                _level = _ref$_level === undefined ? 1 : _ref$_level,
                _ref$_liBacknav = _ref._liBacknav,
                _liBacknav = _ref$_liBacknav === undefined ? [] : _ref$_liBacknav,
                _handler = _ref._handler,
                _ref$_liArray = _ref._liArray,
                _liArray = _ref$_liArray === undefined ? document.querySelectorAll('.menu__ul--level1 .menu__li') : _ref$_liArray;

            var _onclickBtnBack2 = function _onclickBtnBack(liBacknav, myHandler, myliArray, args) {
                var _this7 = this;

                var _prevent = true;
                var _target = args.target;
                if (_target.classList.contains('secondMenu__title') && _target.closest('.secondMenu__link') || _target.classList.contains('secondMenu__link')) {
                    _prevent = false;
                }

                if (!_prevent) {
                    return;
                }
                args.preventDefault();

                //on retire l'event _onclickBtnBack sur le lenu actif
                this.removeEventListenerAll(_liBacknav, 'click', _onclickBtnBack2,
                /*callback fonction à appeler après le remove listener*/
                function () {

                    //hide link all
                    var _nbreLevel = 0;
                    var _data = {};
                    for (var _level2 in _this7.levelAction) {
                        _this7.levelAction[_level2];
                        _nbreLevel++;
                        _data[_nbreLevel + ""] = _level2;
                    }

                    _this7.setBaseCloseMenu();
                    //Retour niveau 1er niveau
                    if (_level - 1 == 0) {

                        var _actionBack = _this7.levelAction[_data[_level + ""]];

                        // let _handler = _actionBack.handler.bind(this, _actionBack.liArray);
                        _this7.onClickMenuNav({

                            _liArray: _actionBack.liArray,
                            _handler: _actionBack.handler
                        });

                        _this7.showMenuNavAll();
                    } else {

                        var _actionBack2 = _this7.levelAction[_data[_level - 1 + ""]];
                        var _elemback = [];
                        _elemback.push(_actionBack2.target);

                        _this7.removeEventListenerAll(_elemback, 'click', _onclickBtnBack2, function () {
                            // let _handler = _actionBack.handler.bind(this, _actionBack.liArray);
                            _this7.onClickMenuNav({

                                _liArray: _actionBack2.liArray,
                                _handler: _actionBack2.handler
                            });

                            _this7.onClickMenuNav({

                                _liArray: myliArray,
                                _handler: myHandler
                            });

                            _actionBack2.target.click();
                        });
                    }
                });
            };

            _onclickBtnBack2 = _onclickBtnBack2.bind(this, _liBacknav, _handler, _liArray);

            if (window.matchMedia('(max-width: ' + this.mediaTabletLarge + ')').matches) {
                if (_liBacknav != null && _liBacknav.length > 0) {

                    //On retire  l'event click _handler   sur le li en cours

                    this.removeEventListenerAll(_liBacknav, 'click', _handler, function () {
                        //On ecoute le clic sur le li en cours avec la classe XXXXXX--active bouton retour
                        _this8.addEventListenerAll(_liBacknav, 'click', _onclickBtnBack2);
                    });
                }
            } else {
                this.removeEventListenerAll(_liBacknav, 'click', _onclickBtnBack2);
            }
        }
    }, {
        key: 'onClickMenuNav',
        value: function onClickMenuNav(_ref2) {
            var _ref2$_liArray = _ref2._liArray,
                _liArray = _ref2$_liArray === undefined ? document.querySelectorAll('.menu__ul--level1 .menu__li') : _ref2$_liArray,
                _handler = _ref2._handler;

            //Clic Menu Nav First en Mode tablette  / Mobile

            if (_liArray != null && _liArray.length > 0) this.addEventListenerAll(_liArray, 'click', _handler);
        }
    }, {
        key: 'removeSticky',
        value: function removeSticky() {

            this.header.classList.remove('sticky');
            //    remove overlay
            if (document.querySelector('.overlay') != null) {

                document.querySelector('.overlay').remove();
            }
        }
    }, {
        key: 'addOverlay',
        value: function addOverlay() {
            this.header.classList.add('sticky');
            if (this.content != null) {
                if (document.querySelector('.overlay') == null) {
                    this.content.insertAdjacentHTML('afterend', this.overlay);
                }
            }
        }
    }, {
        key: 'setBurger',
        value: function setBurger() {
            var _this9 = this;

            var _burger = document.querySelector('.burger');
            var _search = document.querySelector('.header__bloc--tablette .header__search');
            var _langue = document.querySelector('.header__bloc--tablette .header__langue');
            var _close = document.querySelector('.header__bloc--tablette .close');

            var _navSecond = document.querySelector('.header__middle');
            var _navFirst = document.querySelector('.header__menu');
            var _navItem = document.querySelectorAll('.secondMenu__item--off');

            if (_close != null) {
                _close.addEventListener('click', function (args) {
                    _search.classList.remove('header__search--off');
                    _burger.classList.remove('burger--off');
                    _close.classList.add('close--off');
                    _langue.classList.add('header__langue--off');
                    _navFirst.classList.add('header__menu--off');

                    _this9.removeSticky();

                    _this9.setBaseCloseMenu();
                    // _navSecond.classList.add('header__middle--off');

                    // let _liArray = document.querySelectorAll('.menu__li');

                    // Array.from(_liArray).forEach((elem, index) => {
                    //     elem.classList.remove('menu__li--active');
                    //     elem.classList.remove('menu__li--off');
                    // });

                    // this.closeMenu();

                });
            }

            if (_burger != null && _search != null && _langue != null) {
                // Click sur le burger
                var _handler = function _handler(args) {

                    args.preventDefault();

                    //clean menu nav1 et nav2
                    this.setBaseCloseMenu();
                    this.setMenuOpen('1');

                    // add sticky menu


                    //set overlay 
                    this.addOverlay();
                    // Affiche la nav level 1
                    this.showMenuNavAll();
                    if (_navFirst != null) {
                        _navFirst.classList.remove('header__menu--off');
                    }

                    _burger.classList.add('burger--off');
                    _close.classList.remove('close--off');

                    _search.classList.add('header__search--off');
                    _langue.classList.remove('header__langue--off');
                };
                _handler = _handler.bind(this);
                _burger.addEventListener('click', _handler);
            }
        }
    }, {
        key: 'setSearch',
        value: function setSearch() {
            var elemBtn = document.querySelector('.header__bloc--tablette .search__btn');
            var elemSearchInput = document.querySelector('.header__bloc--tablette .search__input');
            var _search = document.querySelector('.header__bloc--tablette .header__search');
            var _langue = document.querySelector('.header__bloc--tablette .header__langue');

            if (window.matchMedia('(max-width: ' + this.mediaTabletLarge + ')').matches) {

                if (elemBtn != null && _search != null && _langue != null) {

                    _langue.classList.add('header__langue--off');

                    elemBtn.setAttribute('type', 'button');
                    elemBtn.addEventListener('click', function (event) {
                        event.preventDefault();
                        if (elemSearchInput != null) {

                            if (!elemSearchInput.classList.contains('search__input--off')) {
                                elemBtn.form.submit();
                            }
                            elemSearchInput.classList.remove('search__input--off');
                        }
                    });
                }
            }
            //desktop
            else {
                    if (_search != null) {
                        _search.classList.remove('header__search--off');
                    }
                }
        }
    }, {
        key: 'setBlocSliderFooter',
        value: function setBlocSliderFooter() {
            // if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches)


            if (window.matchMedia('(max-width: ' + this.mediaTabletLarge + ')').matches) {
                var elemPushSlider = document.querySelectorAll('.slider__push');
                var elemSldierTitle = document.querySelectorAll('.slider__sTitle');

                if (elemPushSlider != null) {
                    for (var i = 0; i < elemPushSlider.length; i++) {
                        if (elemPushSlider[i] != null) {

                            var parent = this.closest(elemPushSlider[i], 'article');
                            if (parent != null) {
                                parent.insertAdjacentElement('afterend', elemPushSlider[i]);
                            }

                            //deplacement title
                            var elemSTitle = elemPushSlider[i].querySelector('.slider__sTitle');
                            var elemTxt = elemPushSlider[i].querySelector('.slider__txt');
                            if (elemSTitle != null && elemTxt != null) {
                                elemTxt.insertAdjacentElement('afterbegin', elemSTitle);
                            }
                        }
                    }
                }

                //remise bloc par defaut
            } else {

                var elemSldierImage = document.querySelectorAll('.slider__image');
                var elemSliderItem = document.querySelectorAll('.slider__item');
                if (elemSldierImage != null && elemSldierImage.length > 0 && elemSliderItem != null && elemSliderItem.length > 0) {
                    for (var elem in elemSldierImage) {
                        if (elemSldierImage[elem] != null) {

                            var _parent2 = this.closest(elemSldierImage[elem], 'article');
                            if (_parent2 != null) {
                                var _elemPushSlider = elemSliderItem[elem].querySelector('.slider__push');
                                if (_elemPushSlider != null) {
                                    elemSldierImage[elem].insertAdjacentElement('afterend', _elemPushSlider);

                                    var _elemSTitle = elemSliderItem[elem].querySelector('.slider__sTitle');
                                    var elemTitle2 = elemSliderItem[elem].querySelector('.slider__title2 ');
                                    if (_elemSTitle != null && elemTitle2 != null) {
                                        elemTitle2.insertAdjacentElement('afterbegin', _elemSTitle);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: 'setContentMenuResize',
        value: function setContentMenuResize() {

            var elemMenuTablet = document.querySelector('.header__bloc--tablette');
            var search_input = document.querySelector('.header__bloc--desktop .search__input');
            var elemLangue = document.querySelector('.header__bloc--desktop .header__langue');
            var elemNavFirst = document.querySelector('.header__bloc--desktop .header__menu');
            var elemHeadertop = document.querySelector('.header__top');
            var elemMenuContainer = document.querySelector('.header__menuContainer');

            if (window.matchMedia('(max-width: ' + this.mediaTabletLarge + ')').matches) {
                this.setBaseCloseMenu();

                if (elemMenuTablet != null && elemNavFirst != null) {

                    elemNavFirst = document.querySelector('.header__bloc--desktop .header__menu');

                    var elemHeaderLogo = document.querySelector('.header__bloc--desktop .header__logo');
                    var elemSearch = document.querySelector('.header__bloc--desktop .header__search');

                    if (elemHeaderLogo != null && elemSearch != null && search_input != null) {
                        var logoHtml = elemHeaderLogo.outerHTML;

                        search_input.classList.add('search__input--off');

                        var searchHtml = elemSearch.outerHTML;
                        var elemLangueHtml = elemLangue.outerHTML;

                        elemNavFirst.classList.add('header__menu--off');
                        var elemNavHtml = elemNavFirst.outerHTML;

                        if (elemHeadertop != null) {
                            elemHeadertop.insertAdjacentElement('beforeend', elemNavFirst);
                        }

                        var tplMenu = '\n                                <div class="gridCR --VgridBottom">\n                            \n                                    <div class="gridCR-col-50">\n                                        <span class="burger icon-burger "></span>\n                                        <div class="close close--off">\n                                             <div class="close__left"></div>\n                                             <div class="close__right"></div>\n                                         </div>\n                                    </div>\n                                    <div class="gridCR-col-50">\n                                    ' + logoHtml + '\n                                    </div>\n                                    <div class="gridCR-col-50">\n                                        ' + elemLangueHtml + '\n                                        ' + searchHtml + '\n                                    </div>\n                                  \n                                </div>\n                                \n                              \n                              \n                            ';

                        elemMenuTablet.innerHTML = tplMenu;

                        this.addOverlay();
                    }
                }
            } else {
                this.setBaseCloseMenu();
                elemNavFirst = document.querySelector('.header__menu');
                if (elemMenuTablet != null) {
                    elemMenuTablet.innerHTML = "";
                    if (search_input != null) {

                        search_input.classList.remove('search__input--off');
                    }
                    if (elemNavFirst != null && elemMenuContainer != null) {

                        elemNavFirst.classList.remove('header__menu--off');

                        elemMenuContainer.insertAdjacentElement('afterbegin', elemNavFirst);
                    }

                    this.removeSticky();
                }
            }
        }
    }, {
        key: 'setInitDevice',
        value: function setInitDevice() {

            var Device = {
                isPaysage: false,
                isMobile: false,
                isTablette: false,
                isDesktop: false,
                isTouch: false,
                isIOS: false,
                isChrome: false,
                resize: function resize(arg) {
                    Device.check();
                    _Bollore.setResize();
                },
                init: function init(_this) {
                    window.addEventListener('resize', this.resize.bind(_this));

                    Device.check();
                },
                check: function check() {

                    this.isTouch = 'ontouchstart' in window;
                    this.isPaysage = window.innerWidth > window.innerHeight;
                    this.isPortrait = window.innerWidth < window.innerHeight;
                    this.isMobile = window.innerWidth < 768;
                    this.isTablette = window.innerWidth >= 768 && window.innerWidth < 940;
                    this.isDesktop = window.innerWidth >= 940;
                    this.isIOS = navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("iPod") != -1;
                    this.isChrome = !!window.chrome;

                    document.querySelector('html').classList.toggle('mobile', this.isMobile);
                    document.querySelector('html').classList.toggle('tablet', this.isTablette);
                    document.querySelector('html').classList.toggle('desktop', this.isDesktop);
                }
            };

            Device.init(this);
        }
    }, {
        key: 'setSlider',
        value: function setSlider() {

            if (this._sliderElem.length > 0) {

                for (var j = 0; j < this._sliderElem.length; j++) {

                    var elem = this._sliderElem[j];

                    var _joinData = elem.className.split(' ').join('.');
                    var _classSlider = '.' + _joinData;
                    var isPaginationNormal = elem.classList.contains('slider--pagination');
                    var _objInstance = {
                        isPaginationNormal: isPaginationNormal,
                        container: _classSlider + ' .slider__ul',
                        items: _classSlider + ' .slider__item',
                        startSlide: 0,
                        isAuto: true,
                        speed: 5000,
                        next: _classSlider + ' .slider__next',
                        prev: _classSlider + ' .slider__prev',
                        modeTranslate: false
                    };

                    _objInstance.modeTranslate = document.querySelector('.content--home .slider__ul') != null ? !_objInstance.modeTranslate : false;

                    var _mySlider = new Slider(_classSlider, _objInstance);

                    this._slider.push(_mySlider);
                }
            }
        }
    }, {
        key: 'setOnEventScrollTopMenuSticky',
        value: function setOnEventScrollTopMenuSticky() {
            var _this10 = this;

            this.scrollTopDocument = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;

            window.addEventListener('scroll', function (args) {

                args.preventDefault();
                var _burger = document.querySelector('.burger');
                _this10.scrollTopDocument = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
                var _token = document.querySelector('.content');

                var tokenOffsetheight = _token.offsetHeight;

                if (_token != null && _this10.header != null) {
                    var _tokenTop = _this10.getOffset(_token).top;
                    if (_this10.scrollTopDocument > _tokenTop) {
                        if (!_this10.header.classList.contains('sticky')) {
                            _this10.header.classList.add('sticky');
                        }
                    } else {
                        //burger open
                        if (_burger != null && !_burger.classList.contains('burger--off')) {
                            _this10.removeSticky();
                        } else {
                            if (!window.matchMedia('(max-width: ' + _this10.mediaTabletLarge + ')').matches) {
                                _this10.removeSticky();
                            }
                        }
                    }
                }
            });
            if (window.matchMedia('(max-width: ' + this.mediaTabletLarge + ')').matches) {

                this.removeSticky();
            } else {}
        }
    }, {
        key: 'getOffset',
        value: function getOffset(el) {

            var rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var obj = {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
            return obj;

            // const box = el.getBoundingClientRect();

            // return {
            //     top: box.top + window.pageYOffset - document.documentElement.clientTop,
            //     left: box.left + window.pageXOffset - document.documentElement.clientLeft
            // }
        }
    }, {
        key: 'setOnClickMenuClose',
        value: function setOnClickMenuClose() {
            var _this11 = this;

            var _close = this.closeMenuPrincipal;
            _close.addEventListener('click', function (args) {
                args.preventDefault();

                _this11.hideBlocSousNav();

                setTimeout(function () {
                    _this11.setBaseCloseMenu();
                }, 200);
            });
        }
    }, {
        key: 'hideBlocSousNav',
        value: function hideBlocSousNav() {
            this.elemAnim.classList.remove('header__blocSousNav--on');
        }
    }, {
        key: 'setBaseCloseMenu',
        value: function setBaseCloseMenu() {

            this.setMenuOpen(0);

            this.closeMenu();
            this.closeFooter();
            this.hideFirstMenu();

            this.hideSecondMenu();
            this.hideThirdMenu();
        }
    }, {
        key: 'showLevel',
        value: function showLevel(_target, _ref3) {
            var _ref3$off = _ref3.off,
                off = _ref3$off === undefined ? '' : _ref3$off,
                _ref3$on = _ref3.on,
                on = _ref3$on === undefined ? '' : _ref3$on,
                _ref3$active = _ref3.active,
                active = _ref3$active === undefined ? '' : _ref3$active;

            _target.classList.remove(off);
            _target.classList.add(on);
            _target.classList.add(active);
        }
    }, {
        key: 'setOnClickLevelMenu',
        value: function setOnClickLevelMenu() {
            var _elm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'menu__li';

            var _selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.menu__ul--level1 .menu__li';

            var _li = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {

                on: 'menu__li--on',
                off: 'menu__li--off',
                active: 'menu__li--active'

            };

            var _hoverhide = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
                _selector: '.menu__ul--level1 .menu__li--on:not(.menu__li--active)',
                _li: {

                    on: 'menu__li--on',
                    off: 'menu__li--off'

                }
            };

            var _arrayMenuLevel1 = [];
            var _level3 = false;
            var _liArray = [];
            var _objMenu = {};
            //Check Animation

            var AnimateFunctionSlideMenu = function AnimateFunctionSlideMenu(target) {
                console.log(target);

                //Mode Desktop
                if (window.matchMedia('(min-width: ' + this.mediaDesktop + ')').matches) {
                    if (target.classList.contains('menu__li')) {

                        //remove class
                        this.elemAnim.classList.remove('header__blocSousNav--on');

                        //Get elemAnim
                        var elemHeightMiddle = 0;
                        var elemHeightBottom = 0;

                        //calcul element height
                        if (document.querySelector('.header__middle') != null) {
                            elemHeightMiddle = parseFloat(document.querySelector('.header__middle').offsetHeight);
                        }
                        if (document.querySelector('.header__bottom') != null) {
                            elemHeightBottom = parseFloat(document.querySelector('.header__bottom').offsetHeight);
                        }
                        var elemAnimHeight = elemHeightMiddle + elemHeightBottom;

                        //Transition endend height

                        //check elem if exist
                        if (this.elemAnim != null) {
                            // this.elemAnim.style.maxHeight = `${elemAnimHeight}px`;
                            this.elemAnim.classList.add('header__blocSousNav--on');
                        }
                    }
                }
            };

            var _handler2 = function _handler(_liArray, args) {
                var _this12 = this;

                var _target = args.currentTarget;
                var _prevent = true;
                var _targetElem = args.target;

                //Check Animation
                AnimateFunctionSlideMenu.call(this, _target);

                if (_targetElem != null) {

                    if (_targetElem.classList.contains('secondMenu__li')) {

                        var _result = _targetElem.querySelector(':first-child');
                        if (_result.classList.contains('secondMenu__link')) {
                            _prevent = false;
                            _result.click();
                        }
                    } else if (_targetElem.classList.contains('menu__li')) {

                        var _result2 = _targetElem.querySelector(':first-child');
                        if (_result2.classList.contains('menu__link')) {
                            _prevent = false;
                            _result2.click();
                        }
                    } else if (_targetElem.classList.contains('menu__link') || _targetElem.classList.contains('menu__title') && _targetElem.closest('.menu__link')) {
                        _prevent = false;
                    } else if (_targetElem.classList.contains('secondMenu__title') && _targetElem.closest('.secondMenu__link') || _targetElem.classList.contains('secondMenu__link')) {
                        _prevent = false;
                    }
                }

                if (!_prevent) {
                    return;
                }
                args.preventDefault();

                var _smenu = _target.dataset.menu;
                var _link = _target.dataset.footerHref;
                var _txt = _target.dataset.footerTxt;
                var _level = 1;

                this.setBaseCloseMenu();
                this.setMenuOpen('1');

                this.showLevel(_target, _li);
                _objMenu = {
                    target: _target,
                    liArray: _liArray,
                    handler: _handler2
                };

                // mode level 1 et level 2
                if (_smenu != null) {
                    _level = 1;

                    if (this.levelAction[_target.className] == null) {

                        this.levelAction[_target.className] = _objMenu;
                    }

                    var _obj = {
                        id: _smenu,
                        href: _link,
                        lbl: _txt
                    };
                    this.hideHoverMenu(_hoverhide._selector, _hoverhide._li);
                    setTimeout(function () {
                        _this12.showMenuSecond(_obj);
                    }, 110);
                }
                // mode level 3
                if (_level3) {
                    _level = 2;
                    if (this.levelAction[_target.className] == null) {

                        this.levelAction[_target.className] = _objMenu;
                    }
                    this.hideHoverMenu(_hoverhide._selector, _hoverhide._li);
                    this.showMenuThird(args.currentTarget);
                }

                var _liBacknav = [];
                _liBacknav.push(_target);

                //Bouton Back set handler

                this.menuWithBtnBack({
                    _level: _level,

                    _liBacknav: _liBacknav,
                    _handler: _handler2,
                    _liArray: _liArray
                });
            };

            //Tablette
            if (window.matchMedia('(max-width: ' + this.mediaTabletLarge + ')').matches) {

                if (_selector.indexOf('.secondMenu__li .secondMenu__title') > -1) {
                    _level3 = true;
                    var _arrayMenuLevel2title = document.querySelectorAll(_selector);

                    Array.from(_arrayMenuLevel2title).forEach(function (elem, index) {
                        var _secondeMenuLi = elem.closest('.secondMenu__li');
                        _arrayMenuLevel1.push(_secondeMenuLi);
                    });
                } else {
                    _arrayMenuLevel1 = document.querySelectorAll(_selector);
                }
                _liArray = _arrayMenuLevel1;
                _handler2 = _handler2.bind(this, _liArray);
                this.onClickMenuNav({
                    _liArray: _liArray,
                    _handler: _handler2
                });
            }
            //Desktop
            else {
                    if (_elm.indexOf('menu__li') > -1) {
                        _liArray = document.querySelectorAll(_selector);
                        _handler2 = _handler2.bind(this, _liArray);
                        this.onClickMenuNav({
                            _liArray: _liArray,
                            _handler: _handler2
                        });
                    }
                }
            //   this.setMenuNav(_elm);
        }
    }, {
        key: 'hideHoverMenu',
        value: function hideHoverMenu() {
            var _selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.menu__ul--level1 .menu__li--on:not(.menu__li--active)';

            var _li = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {

                on: '',
                off: ''

            };

            var _items = document.querySelectorAll(_selector);

            _items = [].slice.call(_items || []);
            for (var i = 0; i < _items.length; i++) {
                _items[i].classList.remove(_li.off);
                _items[i].classList.add(_li.off);
                _items[i].classList.remove(_li.on);
            }
        }
    }, {
        key: 'showFooter',
        value: function showFooter(_obj) {
            if (_obj.href != undefined && _obj.lbl != undefined) {
                document.querySelector('.header__bottom').classList.remove('header__bottom--off');
                document.querySelector('.menuFooter--link').setAttribute('href', _obj.href);
                document.querySelector('.menuFooter__span').innerHTML = _obj.lbl;
            }
        }
    }, {
        key: 'closeFooter',
        value: function closeFooter() {
            var _footer = document.querySelector('.header__bottom');
            if (_footer != null && !_footer.classList.contains('header__bottom--off')) {
                _footer.classList.add('header__bottom--off');
            }
        }
    }, {
        key: 'closeMenu',
        value: function closeMenu() {
            if (document.querySelector('.header__middle') != null) document.querySelector('.header__middle').classList.add('header__middle--off');
            if (document.querySelector('.header__bottom') != null) document.querySelector('.header__bottom').classList.add('header__bottom--off');
        }
    }, {
        key: 'showMenuNavAll',
        value: function showMenuNavAll() {
            var _elems = document.querySelectorAll('.menu__li:not(.menu__li--active)');
            if (_elems != null && _elems.length > 0) {
                var elem = null;
                Array.from(_elems).forEach(function (elem, index) {
                    if (elem.classList.contains('menu__li--off')) {
                        elem.classList.remove('menu__li--off');
                        elem.classList.add('menu__li--on');
                    }
                });
            }

            this.levelAction = {};
        }
    }, {
        key: 'showMenuSecondHideAll',
        value: function showMenuSecondHideAll() {
            var _elems = document.querySelectorAll('.secondMenu__item');
            if (_elems != null && _elems.length > 0) {
                var elem = null;
                Array.from(_elems).forEach(function (elem, index) {
                    if (!elem.classList.contains('secondMenu__item--off')) {
                        elem.classList.add('secondMenu__item--off');
                    }
                });
            }
        }
    }, {
        key: 'showMenuThird',
        value: function showMenuThird(args) {

            var _menuThird = args.querySelector('.secondMenu__ul--level2');

            _menuThird.classList.add('secondMenu__ul--on');
            this.showMiddleMenu();
            args.closest('.secondMenu__item').classList.remove('secondMenu__item--off');
        }
    }, {
        key: 'showMiddleMenu',
        value: function showMiddleMenu() {
            document.querySelector('.header__middle').classList.remove('header__middle--off');
        }
    }, {
        key: 'showMenuSecond',
        value: function showMenuSecond(token) {

            var _smenu = document.querySelector('.secondMenu__item[data-menu=\'' + token.id + '\']');
            if (_smenu != null) {
                this.showMiddleMenu();
                _smenu.classList.remove('secondMenu__item--off');
            }

            this.showFooter(token);
        }
    }, {
        key: 'hideFirstMenu',
        value: function hideFirstMenu() {
            var _arrayMenu = document.querySelectorAll('.menu__li');
            var ul = null;
            _arrayMenu = [].slice.call(_arrayMenu || []);
            for (var i = 0; i < _arrayMenu.length; i++) {
                _arrayMenu[i].classList.remove('menu__li--active');
                _arrayMenu[i].classList.remove('menu__li--off');
                _arrayMenu[i].classList.add('menu__li--off');
                _arrayMenu[i].classList.remove('menu__li--on');
            }
        }
    }, {
        key: 'hideThirdMenu',
        value: function hideThirdMenu() {
            var _arrayMenu = document.querySelectorAll('.secondMenu__li');
            var ul = null;
            _arrayMenu = [].slice.call(_arrayMenu || []);
            for (var i = 0; i < _arrayMenu.length; i++) {
                _arrayMenu[i].classList.remove('secondMenu__li--active');
                _arrayMenu[i].classList.remove('secondMenu__li--off');
                _arrayMenu[i].classList.remove('secondMenu__li--on');
                _arrayMenu[i].classList.remove('secondMenu__item--on');
            }
            var _arrayMenuUl = document.querySelectorAll('.secondMenu__ul,.secondMenu__ul--level2');
            for (var _i = 0; _i < _arrayMenuUl.length; _i++) {
                _arrayMenuUl[_i].classList.remove('secondMenu__ul--on');
                _arrayMenuUl[_i].classList.remove('secondMenu__ul--active');
            }
        }
    }, {
        key: 'hideSecondMenu',
        value: function hideSecondMenu() {
            var _arrayMenu = document.querySelectorAll('.secondMenu__item');
            var ul = null;
            _arrayMenu = [].slice.call(_arrayMenu || []);
            for (var i = 0; i < _arrayMenu.length; i++) {
                _arrayMenu[i].classList.remove('secondMenu__item--active');
                _arrayMenu[i].classList.remove('secondMenu__item--off');
                _arrayMenu[i].classList.add('secondMenu__item--off');
                _arrayMenu[i].classList.remove('secondMenu__item--on');
            }
        }
    }, {
        key: 'closest',
        value: function closest(el, selector) {
            var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

            while (el) {
                if (matchesSelector != null && _typeof(matchesSelector.call) != undefined && matchesSelector.call(el, selector)) {
                    return el;
                } else {
                    el = el.parentElement;
                }
            }
            return null;
        }
    }, {
        key: 'addEventListenerAll',
        value: function addEventListenerAll(selectors, event, callback) {
            try {
                var selector = null;
                // var mycallback = function (args) {
                //     callback(args);
                // }
                Array.from(selectors).forEach(function (selector, index) {

                    selector.addEventListener(event, callback, false);
                });
            } catch (e) {
                console.log(e);
            }
        }
    }, {
        key: 'removeEventListenerAll',
        value: function removeEventListenerAll(selectors, event, callback, endCallBack) {
            try {
                var selector = null;
                var itemsCount = 0;
                Array.from(selectors).forEach(function (selector, index) {

                    selector.removeEventListener(event, callback, false);
                    itemsCount++;
                    if (selectors.length == itemsCount) {
                        if (endCallBack != undefined) {
                            endCallBack();
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    }]);

    return Bollore;
}();

document.addEventListener('DOMContentLoaded', function () {
    window._Bollore = new Bollore();
});

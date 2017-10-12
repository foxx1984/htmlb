class Slider {
    constructor(id, obj = {
        container: id + ' .slider__ul',
        items: id + ' .slider__item',
        startSlide: 0,
        speed: 5000,
        isAuto: true,
        next: id + ' .slider__next',
        prev: id + ' .slider__prev',
        modeTranslate: false
    }) {
        this.sliderInterval = null;
        this.options = obj;
        this.id = id;
        this.currentItem = this.getCurrent();
        this.itemsElem = document.querySelector(`${this.options.items}`);
        this.ulContainer = document.querySelector(`${this.options.container}`);
        this.next = document.querySelector(`${this.options.next}`);
        this.prev = document.querySelector(`${this.options.prev}`);

        this.delta = 60;
        this.marginLeft = -60 //* translate : -60vw ou merginleft  -40.5 ;
        this.marginDefautLeft = 0; //* translate : -60vw ou merginleft  -40.5 ;
        this.elemLast = document.querySelector(`${this.id} .slider__item:last-child`);
        this.elemFirst = document.querySelector(`${this.id} .slider__item:first-child`);


        this.init();



    }

    addItem(elem, type) {

        let _token = type == 'next' ? this.elemFirst : this.elemLast;

        //Get Transform TranslateX
        let translateX = 0;




        //Mode Get translateX
        if (this.options.modeTranslate) {
            if (this.ulContainer.style['transform'] != null && this.ulContainer.style['transform'] != "") {
                let _translateXString = this.ulContainer.style['transform'].replace('translateX(', '').replace('vw)', '').replace('calc(', '');

                this.marginLeft = parseFloat(_translateXString);

            } else {
                this.marginLeft = 0;
            }

            //Get marginLeftg par defaut
            if (this.ulContainer.style['marginLeft'] != null && this.ulContainer.style['marginLeft'] != "") {
                let _marginLeft = this.ulContainer.style['marginLeft'].replace('vw)', '').replace('calc(', '');

                this.marginLeft = parseFloat(_marginLeft);

            } else {
                this.marginLeft = 0;
            }



        }


        if (this.options.isPaginationNormal) {

            _token = type == 'next' ? this.elemLast : this.elemFirst;
        }


        let _item = _token;
        let _cloneItem = null;


        if (_item != null) {




            //bouton suivant
            if (type == 'next') {

                _cloneItem = _item.cloneNode(true);

                //mode translate
                if (this.options.modeTranslate) {
                    // translateX = -delta + translateX;
                    // this.ulContainer.style['transform'] = `translateX(${translateX}vw)`;

                    this.marginLeft = -this.delta + this.marginLeft;


                    this.setSlide(this.marginLeft, 'translate')

                    translateX = 0;
                    let slideItems = this.ulContainer.querySelectorAll('.slider__item');

                    if (slideItems.length > 3) {
                        //First remove first
                        let precNode = elem.previousElementSibling.previousElementSibling;
                        if (precNode != null) {
                            let cloneNode = precNode.cloneNode(true);
                            //check node value
                            if (cloneNode)
                                this.ulContainer.appendChild(cloneNode, null);

                        }


                    } else {


                        this.ulContainer.appendChild(_cloneItem, null);
                    }

                    return;

                }
                //pagination normal
                if (this.options.isPaginationNormal) {
                    _cloneItem = elem;
                    _item.after(_cloneItem);
                } else {


                    _item.remove();
                    elem.after(_cloneItem);



                }


            }

            //bouton précédent
            if (type == 'prev') {

                //element dernier de la liste à copier
                _cloneItem = _item.cloneNode(true);
                if (this.options.modeTranslate) {
                    // translateX = delta + translateX;
                    // this.ulContainer.style['transform'] = `translateX(${translateX}vw)`;

                    this.marginLeft = this.delta + this.marginLeft;

                    //add element before elem current
                    // this.ulContainer.insertBefore( /*elem add*/ _cloneItem, /*context*/ elem);

                    this.posElement(this.elemLast, this.elemFirst, this.marginLeft, type);
                    // this.posElement( this.marginLeft);
                    //  this.setSlide(this.marginLeft)
                    return;

                }
                if (this.options.isPaginationNormal) {
                    _cloneItem = elem;
                    _item.before(_cloneItem);
                    return;
                } else {

                    //mode translate
                    if (this.options.modeTranslate) {

                        let slideItems = this.ulContainer.querySelectorAll('.slider__item');
                        if (slideItems.length > 3) {
                            //First remove first
                            let nextElem = elem.nextElementSibling.nextElementSibling;
                            if (nextElem != null) {
                                let cloneNode = nextElem.cloneNode(true);

                                //check node value
                                if (cloneNode != null)
                                    this.ulContainer.appendChild(cloneNode, null);

                            }


                        } else {

                        }

                    } else {


                        _cloneItem = _item;
                        elem.before(_cloneItem);
                    }
                }

            }
        }


    }
    onNextClick(args) {


        let _marginLeft = this.itemsElem.style.marginLeft == undefined ? 0 : this.itemsElem.style.marginLeft;
        let _width = this.itemsElem.offsetWidth + this.itemsElem.style.marginLeft;
        // _ul.style.marginLeft = `calc(-46.5vw - (${_width}px +  3.4vw))`;
        // this.ulContainer.style.marginLeft = '-40.5vw';
        let _newItem = this.getItem('next');
        if (_newItem != null) {


            this.addCurent(_newItem);
            this.addItem(_newItem, 'next');
        }


    }
    getPositionItem() {
        let elemCurrent = this.getCurrent();
        this.elemLast = document.querySelector(`${this.id} .slider__item:last-child`);
        this.elemFirst = document.querySelector(`${this.id} .slider__item:first-child`);


    }
    getItem(type) {
        let _li = null;

        if (type == 'next') {
            if (this.currentItem != null) {
                _li = this.currentItem.nextElementSibling;
                if (this.options.isPaginationNormal) {
                    _li = document.querySelector(`${this.id} .slider__item:first-child`);
                }

            }




        }
        if (type == 'prev') {
            _li = this.currentItem.previousElementSibling;
            if (this.options.isPaginationNormal) {
                _li = document.querySelector(`${this.id} .slider__item:last-child`);

            }

        }
        return _li;

    }
    onPrevClick(args) {

        //this.ulContainer.style.marginLeft = '-40.5vw';
        let _newItem = this.getItem('prev');
        if (_newItem != null) {


            this.addCurent(_newItem);

            this.addItem(_newItem, 'prev');
        }


    }

    onPagination() {

        if (this.next != null) {
            this.next.addEventListener('click', (args) => {
                if (this.sliderInterval != null) {
                    clearInterval(this.sliderInterval);
                    this.slideAuto();
                }
                this.onNextClick(args);

            });
        }
        if (this.prev != null) {
            this.prev.addEventListener('click', (args) => {
                if (this.sliderInterval != null) {
                    clearInterval(this.sliderInterval);
                    this.slideAuto();
                }
                this.onPrevClick(args);

            });
        }



    }
    getCurrent() {
        let _items = document.querySelectorAll(`${this.id} .slider__item--current`);
        return _items[0];
    }
    addCurent(elem) {
        let _items = document.querySelectorAll(`${this.id} .slider__item--current`);
        _items = [].slice.call(_items || []);
        for (let i = 0; i < _items.length; i++) {
            _items[i].classList.remove('slider__item--current');

        }
        elem.classList.add('slider__item--current');
        this.currentItem = elem;

    }
    setMoveItem() {
        let _items = document.querySelectorAll(`${this.options.items}`);
        _items = [].slice.call(_items || []);
        if (_items != null && _items.length > 1) {

            let _elemClone1 = _items[0];
            if (!this.options.isPaginationNormal) {
                _items[0].remove();
                _items[1].after(_elemClone1);
            } else {
                _elemClone1 = _items[_items.length - 1];
            }



            this.addCurent(_elemClone1);



        }
    }
    slideAuto() {
        if (this.options.isAuto) {
            this.sliderInterval = setInterval(() => {
                this.onNextClick();

            }, this.options.speed);
        }




    }
    setSlide(delta, type = 'margin') {
        if (type == 'translate') {
            this.ulContainer.style['transform'] = `translateX(calc(${delta}vw))`;

        } else if (type = 'margin') {
            this.ulContainer.style['marginLeft'] = `calc(${delta}vw)`;
        } else {
            this.ulContainer.style['marginLeft'] = `calc(${delta}vw)`;

        }
    }
    getLastFirst() {

    }
    posElement(elemLast, elemFirst, mydelta = null, type = null) {

        let delta = 0;

        if (elemLast != null && elemFirst != null) {

            let elemCloneLast = elemLast.cloneNode(true);


            if (type == 'prev') {
                if (mydelta == null) {
                    delta = this.marginDefautLeft - this.delta;

                } else {
                    delta = mydelta;

                }

                this.setSlide(delta, 'translate');

                this.ulContainer.addEventListener('transitionend', (args) => {
                    console.log(args);

                });
                setTimeout(() => {
                    this.setSlide(delta - this.delta, 'translate');
                    this.ulContainer.insertBefore( /*elem add*/ elemCloneLast, /*context*/ elemFirst);

                }, 500);

            }


            if (type == 'next') {
                if (mydelta == null) {
                    delta = this.marginDefautLeft + this.delta;

                } else {
                    delta = mydelta;

                }

                this.setSlide(delta, 'translate');
                this.ulContainer.insertBefore( /*elem add*/ elemCloneLast, /*context*/ elemFirst);

            }
            //this.setSlide(delta);
        }




    }
    init() {
        //Move item Show Middle slider--custom ou slider normal

        this.setMoveItem();

        //Set events pagination

        this.onPagination();

        //fix position item
        this.elemLast = document.querySelector(`${this.id} .slider__item:last-child`);
        this.elemFirst = document.querySelector(`${this.id} .slider__item:first-child`);


        // //activate en mode translate
        // if (this.options.modeTranslate) {

        //     this.posElement(this.elemLast, this.elemFirst);

        // }

        //this.slideAuto();


    }

}
class Bollore {
    constructor() {

        try {

            this.init();

        } catch (e) {
            console.log(e);


        }

    }



    init() {
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
        this.levelAction = [];

        this.setInitDevice();
        this.setSlider();

        this.setResize();
        this.hoverPublication();



    }
    hoverPublication() {
        var links = document.querySelectorAll('.--link');
        if (links != null && links.length > 0) {
            this.addEventListenerAll(links, 'mouseover', (args) => {

                let link = args.currentTarget;
                if (link != null) {
                    let post = link.closest('.post');
                    if (post != null) {

                        let postImg = post.querySelector('.post__img');
                        if (postImg != null) {
                            postImg.classList.toggle('post__img--on')
                        }


                    }



                }

            });

            this.addEventListenerAll(links, 'mouseout', (args) => {
                let link = args.currentTarget;
                if (link != null) {
                    let post = link.closest('.post');
                    if (post != null) {

                        let postImg = post.querySelector('.post__img');
                        if (postImg != null) {
                            postImg.classList.toggle('post__img--on')
                        }


                    }



                }
            });

        }

    }
    setMenuOpen(tag) {
        localStorage.setItem('menuOpen', tag);
    }
    setMenu() {

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
    setResize() {
        this.setContentMenuResize();
        this.setBlocSliderFooter();
        this.setSearch();
        this.setBurger();
        this.setMenu();
        //this.setFixRefresh();



    }
    setFixRefresh() {
        let _bloc = document.querySelector('.header__bloc');
        if (_bloc != null) {

            if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {
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
    menuWithBtnBack({

        _level = 1,
        _liBacknav = [],
        _handler,
        _liArray = document.querySelectorAll('.menu__ul--level1 .menu__li')
    }) {
        let _onclickBtnBack = function (liBacknav, myHandler, myliArray, args) {

            let _prevent = true;
            let _target = args.target;
            if ((_target.classList.contains('secondMenu__title') && _target.closest('.secondMenu__link')) || _target.classList.contains('secondMenu__link')) {
                _prevent = false;
            }

            if (!_prevent) {
                return;
            }
            args.preventDefault();

            //on retire l'event _onclickBtnBack sur le lenu actif
            this.removeEventListenerAll(_liBacknav, 'click', _onclickBtnBack,
                /*callback fonction à appeler après le remove listener*/
                () => {

                    //hide link all
                    let _nbreLevel = 0;
                    let _data = {};
                    for (let _level in this.levelAction) {
                        this.levelAction[_level];
                        _nbreLevel++;
                        _data[_nbreLevel + ""] = _level;

                    }

                    this.setBaseCloseMenu();
                    //Retour niveau 1er niveau
                    if (_level - 1 == 0) {

                        let _actionBack = this.levelAction[_data[_level + ""]];


                        // let _handler = _actionBack.handler.bind(this, _actionBack.liArray);
                        this.onClickMenuNav({

                            _liArray: _actionBack.liArray,
                            _handler: _actionBack.handler
                        });

                        this.showMenuNavAll();

                    } else {


                        let _actionBack = this.levelAction[_data[_level - 1 + ""]];
                        let _elemback = [];
                        _elemback.push(_actionBack.target);



                        this.removeEventListenerAll(_elemback, 'click', _onclickBtnBack, () => {
                            // let _handler = _actionBack.handler.bind(this, _actionBack.liArray);
                            this.onClickMenuNav({

                                _liArray: _actionBack.liArray,
                                _handler: _actionBack.handler
                            });


                            this.onClickMenuNav({

                                _liArray: myliArray,
                                _handler: myHandler
                            });


                            _actionBack.target.click();

                        });





                    }




                });





        }

        _onclickBtnBack = _onclickBtnBack.bind(this, _liBacknav, _handler, _liArray);

        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {
            if (_liBacknav != null && _liBacknav.length > 0) {


                //On retire  l'event click _handler   sur le li en cours

                this.removeEventListenerAll(_liBacknav, 'click', _handler, () => {
                    //On ecoute le clic sur le li en cours avec la classe XXXXXX--active bouton retour
                    this.addEventListenerAll(_liBacknav, 'click', _onclickBtnBack);
                });



            }

        } else {
            this.removeEventListenerAll(_liBacknav, 'click', _onclickBtnBack);
        }

    }
    onClickMenuNav({
        _liArray = document.querySelectorAll('.menu__ul--level1 .menu__li'),
        _handler
    }) {
        //Clic Menu Nav First en Mode tablette  / Mobile

        if (_liArray != null && _liArray.length > 0)

            this.addEventListenerAll(_liArray, 'click', _handler);




    }
    removeSticky() {

        this.header.classList.remove('sticky');
        //    remove overlay
        if (document.querySelector('.overlay') != null) {


            document.querySelector('.overlay').remove();

        }
    }
    addOverlay() {
        this.header.classList.add('sticky');
        if (this.content != null) {
            if (document.querySelector('.overlay') == null) {
                this.content.insertAdjacentHTML('afterend', this.overlay);
            }

        }
    }
    setBurger() {
        let _burger = document.querySelector('.burger');
        let _search = document.querySelector('.header__bloc--tablette .header__search');
        let _langue = document.querySelector('.header__bloc--tablette .header__langue');
        let _close = document.querySelector('.header__bloc--tablette .close');

        let _navSecond = document.querySelector('.header__middle');
        let _navFirst = document.querySelector('.header__menu');
        let _navItem = document.querySelectorAll('.secondMenu__item--off');


        if (_close != null) {
            _close.addEventListener('click', (args) => {
                _search.classList.remove('header__search--off');
                _burger.classList.remove('burger--off');
                _close.classList.add('close--off');
                _langue.classList.add('header__langue--off');
                _navFirst.classList.add('header__menu--off');


                this.removeSticky();


                this.setBaseCloseMenu();
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
            let _handler = function (args) {

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




            }
            _handler = _handler.bind(this);
            _burger.addEventListener('click', _handler);
        }
    }
    setSearch() {
        let elemBtn = document.querySelector('.header__bloc--tablette .search__btn');
        let elemSearchInput = document.querySelector('.header__bloc--tablette .search__input');
        let _search = document.querySelector('.header__bloc--tablette .header__search');
        let _langue = document.querySelector('.header__bloc--tablette .header__langue');



        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {

            if (elemBtn != null && _search != null && _langue != null) {



                _langue.classList.add('header__langue--off');

                elemBtn.setAttribute('type', 'button');
                elemBtn.addEventListener('click', (event) => {
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
    setBlocSliderFooter() {
        // if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches)


        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {
            let elemPushSlider = document.querySelectorAll('.slider__push');
            let elemSldierTitle = document.querySelectorAll('.slider__sTitle');

            if (elemPushSlider != null) {
                for (let i = 0; i < elemPushSlider.length; i++) {
                    if (elemPushSlider[i] != null) {

                        let parent = this.closest(elemPushSlider[i], 'article');
                        if (parent != null) {
                            parent.insertAdjacentElement('afterend', elemPushSlider[i]);
                        }

                        //deplacement title
                        let elemSTitle = elemPushSlider[i].querySelector('.slider__sTitle');
                        let elemTxt = elemPushSlider[i].querySelector('.slider__txt')
                        if (elemSTitle != null && elemTxt != null) {
                            elemTxt.insertAdjacentElement('afterbegin', elemSTitle);
                        }

                    }

                }



            }

            //remise bloc par defaut
        } else {

            let elemSldierImage = document.querySelectorAll('.slider__image');
            let elemSliderItem = document.querySelectorAll('.slider__item');
            if (elemSldierImage != null && elemSldierImage.length > 0 && elemSliderItem != null && elemSliderItem.length > 0) {
                for (let elem in elemSldierImage) {
                    if (elemSldierImage[elem] != null) {

                        let parent = this.closest(elemSldierImage[elem], 'article');
                        if (parent != null) {
                            let elemPushSlider = elemSliderItem[elem].querySelector('.slider__push');
                            if (elemPushSlider != null) {
                                elemSldierImage[elem].insertAdjacentElement('afterend', elemPushSlider);

                                let elemSTitle = elemSliderItem[elem].querySelector('.slider__sTitle');
                                let elemTitle2 = elemSliderItem[elem].querySelector('.slider__title2 ');
                                if (elemSTitle != null && elemTitle2 != null) {
                                    elemTitle2.insertAdjacentElement('afterbegin', elemSTitle);

                                }
                            }

                        }

                    }
                }

            }

        }

    }
    setContentMenuResize() {

        let elemMenuTablet = document.querySelector('.header__bloc--tablette');
        let search_input = document.querySelector('.header__bloc--desktop .search__input');
        let elemLangue = document.querySelector('.header__bloc--desktop .header__langue');
        let elemNavFirst = document.querySelector('.header__bloc--desktop .header__menu');
        let elemHeadertop = document.querySelector('.header__top');
        let elemMenuContainer = document.querySelector('.header__menuContainer');

        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {
            this.setBaseCloseMenu();



            if (elemMenuTablet != null && elemNavFirst != null) {



                elemNavFirst = document.querySelector('.header__bloc--desktop .header__menu');

                let elemHeaderLogo = document.querySelector('.header__bloc--desktop .header__logo');
                let elemSearch = document.querySelector('.header__bloc--desktop .header__search');

                if (elemHeaderLogo != null && elemSearch != null && search_input != null) {
                    let logoHtml = elemHeaderLogo.outerHTML;

                    search_input.classList.add('search__input--off');

                    let searchHtml = elemSearch.outerHTML;
                    let elemLangueHtml = elemLangue.outerHTML;

                    elemNavFirst.classList.add('header__menu--off');
                    let elemNavHtml = elemNavFirst.outerHTML;

                    if (elemHeadertop != null) {
                        elemHeadertop.insertAdjacentElement('beforeend', elemNavFirst);

                    }

                    let tplMenu =
                        `
                                <div class="gridCR --VgridBottom">
                            
                                    <div class="gridCR-col-50">
                                        <span class="burger icon-burger "></span>
                                        <div class="close close--off">
                                             <div class="close__left"></div>
                                             <div class="close__right"></div>
                                         </div>
                                    </div>
                                    <div class="gridCR-col-50">
                                    ${logoHtml}
                                    </div>
                                    <div class="gridCR-col-50">
                                        ${elemLangueHtml}
                                        ${searchHtml}
                                    </div>
                                  
                                </div>
                                
                              
                              
                            `;

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
    setInitDevice() {

        let Device = {
            isPaysage: false,
            isMobile: false,
            isTablette: false,
            isDesktop: false,
            isTouch: false,
            isIOS: false,
            isChrome: false,
            resize: function (arg) {
                Device.check();
                _Bollore.setResize();

            },
            init: function (_this) {
                window.addEventListener('resize', this.resize.bind(_this));

                Device.check();
            },
            check: function () {

                this.isTouch = ('ontouchstart' in window);
                this.isPaysage = (window.innerWidth > window.innerHeight);
                this.isPortrait = (window.innerWidth < window.innerHeight);
                this.isMobile = (window.innerWidth < 768);
                this.isTablette = (window.innerWidth >= 768 && window.innerWidth < 940);
                this.isDesktop = (window.innerWidth >= 940);
                this.isIOS = (navigator.userAgent.indexOf("iPad") != -1) || (navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("iPod") != -1);
                this.isChrome = !!window.chrome;


                document.querySelector('html').classList.toggle('mobile', this.isMobile);
                document.querySelector('html').classList.toggle('tablet', this.isTablette);
                document.querySelector('html').classList.toggle('desktop', this.isDesktop);



            }
        }

        Device.init(this);

    }
    setSlider() {

        if (this._sliderElem.length > 0) {






            for (var j = 0; j < this._sliderElem.length; j++) {

                let elem = this._sliderElem[j];

                let _joinData = elem.className.split(' ').join('.');
                let _classSlider = `.${_joinData}`;
                let isPaginationNormal = elem.classList.contains('slider--pagination');
                let _objInstance = {
                    isPaginationNormal: isPaginationNormal,
                    container: `${_classSlider} .slider__ul`,
                    items: `${_classSlider} .slider__item`,
                    startSlide: 0,
                    isAuto: true,
                    speed: 5000,
                    next: `${_classSlider} .slider__next`,
                    prev: `${_classSlider} .slider__prev`,
                    modeTranslate: false
                };

                _objInstance.modeTranslate = document.querySelector('.content--home .slider__ul') != null ? !_objInstance.modeTranslate : false;



                let _mySlider = new Slider(_classSlider, _objInstance);

                this._slider.push(_mySlider);

            }

        }


    }
    setOnEventScrollTopMenuSticky() {
        this.scrollTopDocument = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;



        window.addEventListener('scroll', (args) => {

            args.preventDefault();
            let _burger = document.querySelector('.burger');
            this.scrollTopDocument = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            let _token = document.querySelector('.content');

            if (_token != null && this.header != null) {
                let _tokenTop = this.getOffset(_token);
                if (_tokenTop.top > 0 && this.scrollTopDocument > _tokenTop.top) {
                    if (!this.header.classList.contains('sticky')) {
                        this.header.classList.add('sticky');
                    }



                } else {
                    //burger open
                    if (_burger != null && !_burger.classList.contains('burger--off')) {
                        this.removeSticky();

                    } else {
                        if (!window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {
                            this.removeSticky();

                        }
                    }


                }
            }

        });
        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {


            this.removeSticky();



        } else

        {


        }

    }
    getOffset(el) {
        const box = el.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset - document.documentElement.clientTop,
            left: box.left + window.pageXOffset - document.documentElement.clientLeft
        }
    }
    setOnClickMenuClose() {
        let _close = this.closeMenuPrincipal;
        _close.addEventListener('click', (args) => {
            args.preventDefault();

            this.hideBlocSousNav();

            setTimeout(() => {
                this.setBaseCloseMenu();
            }, 200);


        });
    }
    hideBlocSousNav() {
        this.elemAnim.classList.remove('header__blocSousNav--on');
    }
    setBaseCloseMenu() {


        this.setMenuOpen(0);

        this.closeMenu();
        this.closeFooter();
        this.hideFirstMenu();

        this.hideSecondMenu();
        this.hideThirdMenu();

    }
    showLevel(_target, {
        off = '',
        on = '',
        active = ''
    }) {
        _target.classList.remove(off);
        _target.classList.add(on);
        _target.classList.add(active);
    }
    setOnClickLevelMenu(_elm = 'menu__li', _selector = '.menu__ul--level1 .menu__li', _li = {


            on: 'menu__li--on',
            off: 'menu__li--off',
            active: 'menu__li--active'

        },
        _hoverhide = {
            _selector: '.menu__ul--level1 .menu__li--on:not(.menu__li--active)',
            _li: {

                on: 'menu__li--on',
                off: 'menu__li--off'

            }
        }) {




        let _arrayMenuLevel1 = [];
        let _level3 = false;
        let _liArray = [];
        let _objMenu = {

        };
        //Check Animation

        let AnimateFunctionSlideMenu = function (target) {
            console.log(target);

            //Mode Desktop
            if (window.matchMedia(`(min-width: ${this.mediaDesktop})`).matches) {
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
        }

        let _handler = function (_liArray, args) {

            let _target = args.currentTarget;
            let _prevent = true;
            let _targetElem = args.target;


            //Check Animation
            AnimateFunctionSlideMenu.call(this, _target);



            if (_targetElem != null) {


                if (_targetElem.classList.contains('secondMenu__li')) {

                    let _result = _targetElem.querySelector(':first-child');
                    if (_result.classList.contains('secondMenu__link')) {
                        _prevent = false;
                        _result.click();
                    }


                } else if (_targetElem.classList.contains('menu__li')) {

                    let _result = _targetElem.querySelector(':first-child');
                    if (_result.classList.contains('menu__link')) {
                        _prevent = false;
                        _result.click();
                    }


                } else if (_targetElem.classList.contains('menu__link') || (_targetElem.classList.contains('menu__title') && _targetElem.closest('.menu__link'))) {
                    _prevent = false;
                } else if ((_targetElem.classList.contains('secondMenu__title') && _targetElem.closest('.secondMenu__link')) || _targetElem.classList.contains('secondMenu__link')) {
                    _prevent = false;
                }
            }

            if (!_prevent) {
                return;
            }
            args.preventDefault();



            let _smenu = _target.dataset.menu;
            let _link = _target.dataset.footerHref;
            let _txt = _target.dataset.footerTxt;
            let _level = 1;



            this.setBaseCloseMenu();
            this.setMenuOpen('1');

            this.showLevel(_target, _li);
            _objMenu = {
                target: _target,
                liArray: _liArray,
                handler: _handler
            }

            // mode level 1 et level 2
            if (_smenu != null) {
                _level = 1;

                if (this.levelAction[_target.className] == null) {

                    this.levelAction[_target.className] = _objMenu;

                }


                let _obj = {
                    id: _smenu,
                    href: _link,
                    lbl: _txt
                }
                this.hideHoverMenu(_hoverhide._selector, _hoverhide._li);
                setTimeout(() => {
                    this.showMenuSecond(_obj);
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


            let _liBacknav = [];
            _liBacknav.push(_target);

            //Bouton Back set handler

            this.menuWithBtnBack({
                _level,

                _liBacknav,
                _handler,
                _liArray
            });

        }

        //Tablette
        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {



            if (_selector.indexOf('.secondMenu__li .secondMenu__title') > -1) {
                _level3 = true;
                let _arrayMenuLevel2title = document.querySelectorAll(_selector);

                Array.from(_arrayMenuLevel2title).forEach((elem, index) => {
                    let _secondeMenuLi = elem.closest('.secondMenu__li');
                    _arrayMenuLevel1.push(_secondeMenuLi);




                });

            } else {
                _arrayMenuLevel1 = document.querySelectorAll(_selector);

            }
            _liArray = _arrayMenuLevel1;
            _handler = _handler.bind(this, _liArray);
            this.onClickMenuNav({
                _liArray,
                _handler
            });




        }
        //Desktop
        else {
            if (_elm.indexOf('menu__li') > -1) {
                _liArray = document.querySelectorAll(_selector);
                _handler = _handler.bind(this, _liArray);
                this.onClickMenuNav({
                    _liArray,
                    _handler
                });
            }


        }
        //   this.setMenuNav(_elm);

    }



    hideHoverMenu(_selector = '.menu__ul--level1 .menu__li--on:not(.menu__li--active)', _li = {

        on: '',
        off: ''

    }) {



        let _items = document.querySelectorAll(_selector);

        _items = [].slice.call(_items || []);
        for (let i = 0; i < _items.length; i++) {
            _items[i].classList.remove(_li.off);
            _items[i].classList.add(_li.off);
            _items[i].classList.remove(_li.on);

        }
    }
    showFooter(_obj) {
        if (_obj.href != undefined && _obj.lbl != undefined) {
            document.querySelector('.header__bottom').classList.remove('header__bottom--off');
            document.querySelector('.menuFooter--link').setAttribute('href', _obj.href);
            document.querySelector('.menuFooter__span').innerHTML = _obj.lbl;
        }



    }
    closeFooter() {
        let _footer = document.querySelector('.header__bottom');
        if (_footer != null && !_footer.classList.contains('header__bottom--off')) {
            _footer.classList.add('header__bottom--off');

        }



    }
    closeMenu() {
        if (document.querySelector('.header__middle') != null)
            document.querySelector('.header__middle').classList.add('header__middle--off');
        if (document.querySelector('.header__bottom') != null)
            document.querySelector('.header__bottom').classList.add('header__bottom--off');





    }
    showMenuNavAll() {
        let _elems = document.querySelectorAll('.menu__li:not(.menu__li--active)');
        if (_elems != null && _elems.length > 0) {
            let elem = null;
            Array.from(_elems).forEach((elem, index) => {
                if (elem.classList.contains('menu__li--off')) {
                    elem.classList.remove('menu__li--off');
                    elem.classList.add('menu__li--on');
                }

            });
        }

        this.levelAction = {};


    }
    showMenuSecondHideAll() {
        let _elems = document.querySelectorAll(`.secondMenu__item`);
        if (_elems != null && _elems.length > 0) {
            let elem = null;
            Array.from(_elems).forEach((elem, index) => {
                if (!elem.classList.contains('secondMenu__item--off')) {
                    elem.classList.add('secondMenu__item--off');

                }

            });

        }
    }
    showMenuThird(args) {

        let _menuThird = args.querySelector('.secondMenu__ul--level2');

        _menuThird.classList.add('secondMenu__ul--on');
        this.showMiddleMenu();
        args.closest('.secondMenu__item').classList.remove('secondMenu__item--off');



    }
    showMiddleMenu() {
        document.querySelector('.header__middle').classList.remove('header__middle--off');
    }
    showMenuSecond(token) {

        let _smenu = document.querySelector(`.secondMenu__item[data-menu='${token.id}']`);
        if (_smenu != null) {
            this.showMiddleMenu();
            _smenu.classList.remove('secondMenu__item--off');


        }


        this.showFooter(token);




    }
    hideFirstMenu() {
        let _arrayMenu = document.querySelectorAll('.menu__li');
        let ul = null;
        _arrayMenu = [].slice.call(_arrayMenu || []);
        for (let i = 0; i < _arrayMenu.length; i++) {
            _arrayMenu[i].classList.remove('menu__li--active');
            _arrayMenu[i].classList.remove('menu__li--off');
            _arrayMenu[i].classList.add('menu__li--off');
            _arrayMenu[i].classList.remove('menu__li--on');
        }
    }
    hideThirdMenu() {
        let _arrayMenu = document.querySelectorAll('.secondMenu__li');
        let ul = null;
        _arrayMenu = [].slice.call(_arrayMenu || []);
        for (let i = 0; i < _arrayMenu.length; i++) {
            _arrayMenu[i].classList.remove('secondMenu__li--active');
            _arrayMenu[i].classList.remove('secondMenu__li--off');
            _arrayMenu[i].classList.remove('secondMenu__li--on');
            _arrayMenu[i].classList.remove('secondMenu__item--on');

        }
        let _arrayMenuUl = document.querySelectorAll('.secondMenu__ul,.secondMenu__ul--level2');
        for (let i = 0; i < _arrayMenuUl.length; i++) {
            _arrayMenuUl[i].classList.remove('secondMenu__ul--on');
            _arrayMenuUl[i].classList.remove('secondMenu__ul--active');


        }

    }
    hideSecondMenu() {
        let _arrayMenu = document.querySelectorAll('.secondMenu__item');
        let ul = null;
        _arrayMenu = [].slice.call(_arrayMenu || []);
        for (let i = 0; i < _arrayMenu.length; i++) {
            _arrayMenu[i].classList.remove('secondMenu__item--active');
            _arrayMenu[i].classList.remove('secondMenu__item--off');
            _arrayMenu[i].classList.add('secondMenu__item--off');
            _arrayMenu[i].classList.remove('secondMenu__item--on');
        }
    }
    closest(el, selector) {
        const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

        while (el) {
            if (matchesSelector != null && typeof (matchesSelector.call) != undefined && matchesSelector.call(el, selector)) {
                return el;
            } else {
                el = el.parentElement;
            }
        }
        return null;
    }
    addEventListenerAll(selectors, event, callback) {
        try {
            let selector = null;
            // var mycallback = function (args) {
            //     callback(args);
            // }
            Array.from(selectors).forEach((selector, index) => {

                selector.addEventListener(event, callback, false);
            });
        } catch (e) {
            console.log(e);
        }
    }
    removeEventListenerAll(selectors, event, callback, endCallBack) {
        try {
            let selector = null;
            let itemsCount = 0;
            Array.from(selectors).forEach((selector, index) => {


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

}


document.addEventListener('DOMContentLoaded', function () {
    window._Bollore = new Bollore();
});
class Slider {
    constructor(id, obj = {
        container: '.slider__ul',
        items: '.slider__item',
        startSlide: 0,
        speed: 400,
        next: '.slider__next',
        prev: '.slider__prev'
    }) {
        this.options = obj;
        this.id = id;
        this.currentItem = null;
        this.itemsElem = document.querySelector(`${this.options.items}`);
        this.ulContainer = document.querySelector(`${this.options.container}`);
        this.next = document.querySelector(`${this.options.next}`);
        this.prev = document.querySelector(`${this.options.prev}`);
        this.init();


    }
    addItem(elem, type) {
        let _token = type == 'next' ? '.slider__item:first-child' : '.slider__item:last-child';
        let _first = document.querySelector(_token);
        if (_first != null) {
            let _cloneFirst = _first;
            _first.remove();
            if (type == 'next') {
                elem.after(_cloneFirst);
            }
            if (type == 'prev') {
                elem.before(_cloneFirst);
            }
        }


    }
    onNextClick(args) {


        let _marginLeft = this.itemsElem.style.marginLeft == undefined ? 0 : this.itemsElem.style.marginLeft;
        let _width = this.itemsElem.offsetWidth + this.itemsElem.style.marginLeft;
        // _ul.style.marginLeft = `calc(-46.5vw - (${_width}px +  3.4vw))`;
        // this.ulContainer.style.marginLeft = '-40.5vw';
        let _newItem = this.getItem('next');
        this.addCurent(_newItem);
        this.addItem(_newItem, 'next');


    }
    getItem(type) {
        let _li = null;

        if (type == 'next') {
            if (this.currentItem != null)
                _li = this.currentItem.nextElementSibling;


        }
        if (type == 'prev') {
            _li = this.currentItem.previousElementSibling;

        }
        return _li;

    }
    onPrevClick(args) {

        //this.ulContainer.style.marginLeft = '-40.5vw';
        let _newItem = this.getItem('prev');
        this.addCurent(_newItem);

        this.addItem(_newItem, 'prev');


    }

    onPagination() {

        if (this.next != null) {
            this.next.addEventListener('click', (args) => {
                this.onNextClick(args);

            });
        }
        if (this.prev != null) {
            this.prev.addEventListener('click', (args) => {
                this.onPrevClick(args);

            });
        }



    }
    addCurent(elem) {
        let _items = document.querySelectorAll(`.slider__item--current`);
        _items = [].slice.call(_items || []);
        for (let i = 0; i < _items.length; i++) {
            _items[i].classList.remove('slider__item--current');

        }
        elem.classList.add('slider__item--current');
        this.currentItem = elem;

    }
    init() {

        this._sliderElem = this.id;
        let _items = document.querySelectorAll(`${this.options.container} ${this.options.items}`);
        _items = [].slice.call(_items || []);
        if (_items != null && _items.length > 1) {

            let _elemClone1 = _items[0];

            _items[0].remove();
            _items[1].after(_elemClone1);
            this.addCurent(_elemClone1);



        }
        this.onPagination();


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
        this.mediaTabletLarge = '1024px';
        this.content = document.querySelector('.content');
        this.overlay = '<div class="overlay"></div>';
        this.scrollTopDocument = null;
        this._sliderElem = document.querySelector('.slider__content');
        this._slider = null;
        this.header = document.querySelector('.header');

        this.setInitDevice();
        this.setSlider();
        this.setOnClickMenuEvent();
        this.setOnClickMenuClose();
        this.setResize();



    }
    setResize() {
        this.setContentMenuResize();
        this.setBlocSliderFooter();
        this.setSearch();
        this.setBurger();
        this.setMenuNavFirst();
        this.setOnEventScrollTopMenuSticky();
    }
    MenuWithBtnBack({
        _liArray,
      
        _liBacknav = document.querySelectorAll('.menu__li--active')
    }) {
        let _onclickBtnBack = function (args) {
            args.preventDefault();
             
            //on retire l'event _onclickBtnBack sur le lenu actif
            this.removeEventListenerAll(_liBacknav, 'click', _onclickBtnBack,()=> {
                // On affiche le menu par defaut
                this.showMenuNavAll();
                // on cache le second menu
                this.showMenuSecondHideAll();
                args.currentTarget.classList.remove('menu__li--active');
                // on bind  sur le menu de niveau 1 l'event _onClickNav sur tous les menus de niveau 1
                this.onClickMenuNav();
            });

           



        }
        _onclickBtnBack = _onclickBtnBack.bind(this);

        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {
            if (_liBacknav != null && _liBacknav.length > 0) {

                if (_liArray != null && _liArray.length > 0) {
                    //On retire  l'event _onClickNav   sur tous les li de niveau 1

                    this.removeEventListenerAll(_liArray, 'click', this._onClickNav,() => {
                        //On ecoute le clic sur les li menu__li--active bouton retour
                        this.addEventListenerAll(_liBacknav, 'click', _onclickBtnBack);
                    });


                }



            }

        } else {
            this.removeEventListenerAll(_liBacknav, 'click', _onclickBtnBack);
        }

    }
    onClickMenuNav(_liArray = document.querySelectorAll('.menu__li')) {
        //Clic Menu Nav First en Mode tablette  / Mobile

        if (_liArray != null && _liArray.length > 0)

            this.addEventListenerAll(_liArray, 'click', this._onClickNav);




    }
    setMenuNavFirst(_liArray = document.querySelectorAll('.menu__li')) {

        //clic sur un lien niveau 1
        this._onClickNav = function (args) {
            args.preventDefault();

            //récupère tous les LI non sélectionnés à cacher
            let _liElems = document.querySelectorAll('.menu__li:not(.menu__li--on)');
            let _elemOn = args.currentTarget;

            if (_liElems != null) {
                let elem = null;
                Array.from(_liElems).forEach((elem, index) => {
                    elem.classList.add('menu__li--off');
                });

            }

            _elemOn.classList.add('menu__li--active');

            //Affiche le menu avec le bouton retour
            this.MenuWithBtnBack({
               
                _liArray
            });


        };
        this._onClickNav = this._onClickNav.bind(this);


        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {

            this.onClickMenuNav(_liArray);




        } else {
            if (_liArray != null && _liArray.length > 0) {
                this.removeEventListenerAll(_liArray, 'click', this._onClickNav );
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

                // add sticky menu
                // this.header.classList.remove('sticky');
                //    remove overlay
                if (document.querySelector('.overlay') != null) {


                    document.querySelector('.overlay').remove();

                }
                _navSecond.classList.add('header__middle--off');

                let _liArray = document.querySelectorAll('.menu__li');

                Array.from(_liArray).forEach((elem, index) => {
                    elem.classList.remove('menu__li--active');
                    elem.classList.remove('menu__li--off');
                });


            });
        }

        if (_burger != null && _search != null && _langue != null) {
            // Click sur le burger
            _burger.addEventListener('click', (event) => {

                // add sticky menu
                this.header.classList.add('sticky');

                //set overlay 
                if (this.content != null) {
                    this.content.insertAdjacentHTML('afterend', this.overlay);
                }
                // Affiche la nav level 1

                if (_navFirst != null) {
                    _navFirst.classList.remove('header__menu--off');
                }



                _burger.classList.add('burger--off');
                _close.classList.remove('close--off');

                _search.classList.add('header__search--off');
                _langue.classList.remove('header__langue--off');




            });
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

                }

            }
        } else {
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

                if (document.querySelector('.overlay') != null) {


                    document.querySelector('.overlay').remove();

                }

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
            resize: function (_this, arg) {
                Device.check();
                _this.setResize();

            },
            init: function (_this) {
                window.addEventListener('resize', this.resize.bind(null, _this));

                Device.check();
            },
            check: function () {

                Device.isTouch = ('ontouchstart' in window);
                Device.isPaysage = (window.innerWidth > window.innerHeight);
                Device.isPortrait = (window.innerWidth < window.innerHeight);
                Device.isMobile = (window.innerWidth < 768);
                Device.isTablette = (window.innerWidth >= 768 && window.innerWidth < 940);
                Device.isDesktop = (window.innerWidth >= 940);
                Device.isIOS = (navigator.userAgent.indexOf("iPad") != -1) || (navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("iPod") != -1);
                Device.isChrome = !!window.chrome;


                document.querySelector('html').classList.toggle('mobile', Device.isMobile);
                document.querySelector('html').classList.toggle('tablet', Device.isTablette);
                document.querySelector('html').classList.toggle('desktop', Device.isDesktop);



            }
        }

        Device.init(this);

    }
    setSlider() {
        let _obj = {
            container: '.slider__ul',
            items: '.slider__item',
            startSlide: 0,
            speed: 400,
            next: '.slider__next',
            prev: '.slider__prev'

        }
        this._slider = new Slider(this._sliderElem, _obj);
        // this._slider = new Swipe(this._sliderElem, {
        //     startSlide: 0,
        //     speed: 400,
        //     auto: 3000,
        //     continuous: true,
        //     disableScroll: false,
        //     stopPropagation: false,
        //     callback: function (index, elem) {
        //         console.log(`callback : ${elem}`);

        //     },
        //     transitionEnd: function (index, elem) {
        //         console.log(`transitionEnd : ${elem}`);
        //     }
        // });
    }
    setOnEventScrollTopMenuSticky() {
        this.scrollTopDocument = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if (window.matchMedia(`(max-width: ${this.mediaTabletLarge})`).matches) {
            this.header.classList.remove('sticky');
            this.header.classList.add('sticky');
        } else

        {

            window.addEventListener('scroll', (arg) => {
                this.scrollTopDocument = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
                let _token = document.querySelector('.slider__head');

                if (_token != null && this.header != null) {
                    let _tokenTop = this.getOffset(_token);
                    if (_tokenTop.top > 0 && this.scrollTopDocument > _tokenTop.top) {
                        if (!this.header.classList.contains('sticky')) {
                            this.header.classList.add('sticky');
                        }



                    } else {
                        this.header.classList.remove('sticky');


                    }
                }

            });
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
        let _close = document.querySelector('.close');
        _close.addEventListener('click', (arg) => {

            this.closeMenu();
            this.hideHoverMenuItem();
        });
    }
    setOnClickMenuEvent() {
        let _arrayMenuLevel1 = document.querySelectorAll('.menu__ul--level1 .menu__li');

        this.addEventListenerAll(_arrayMenuLevel1, 'click', (args) => {
            args.stopPropagation();
            this.cleanHideMenu();
            let _target = args.currentTarget;

            let _smenu = _target.dataset.menu;
            let _link = _target.dataset.footerHref;
            let _txt = _target.dataset.footerTxt;
            this.hideHoverMenuItem();
            this.closeMenu();
            _target.classList.add('menu__li--on');
            if (_smenu != null) {

                let _obj = {
                    id: _smenu,
                    href: _link,
                    lbl: _txt
                }

                this.showMenuSecond(_obj);
            }



        });
    }
    hideHoverMenuItem() {



        let _items = document.querySelectorAll('.menu__ul--level1 .menu__li--on');
        let _li = null;
        _items = [].slice.call(_items || []);
        for (let i = 0; i < _items.length; i++) {

            _items[i].classList.remove('menu__li--on');

        }
    }
    showFooter(_obj) {
        if (_obj.href != undefined && _obj.lbl != undefined) {
            document.querySelector('.header__bottom').classList.remove('header__bottom--off');
            document.querySelector('.menuFooter--link').setAttribute('href', _obj.href);
            document.querySelector('.menuFooter__span').innerHTML = _obj.lbl;
        }



    }
    closeMenu() {
        document.querySelector('.header__middle').classList.add('header__middle--off');
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
    showMenuSecond(token) {

        let _smenu = document.querySelector(`.secondMenu__item[data-menu='${token.id}']`);
        if (_smenu != null) {
            document.querySelector('.header__middle').classList.remove('header__middle--off');
            _smenu.classList.remove('secondMenu__item--off');


        }


        this.showFooter(token);




    }
    cleanHideMenu() {
        let _arrayMenu = document.querySelectorAll('.secondMenu__item');
        let ul = null;
        _arrayMenu = [].slice.call(_arrayMenu || []);
        for (let i = 0; i < _arrayMenu.length; i++) {

            _arrayMenu[i].classList.remove('secondMenu__item--off');
            _arrayMenu[i].classList.add('secondMenu__item--off');
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
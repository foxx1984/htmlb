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
        this.ulContainer.style.marginLeft = '-40.5vw';
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

       this.ulContainer.style.marginLeft = '-40.5vw';
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

        }

    }



    init() {

        this.scrollTopDocument = null;
        this._sliderElem = document.querySelector('.slider__content');
        this._slider = null;
        //  this.setOnEventScrollTopMenuSticky();
        this.setSlider();
        this.setOnClickMenuEvent();
        this.setOnClickMenuClose();

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
        window.addEventListener('scroll', (arg) => {
            this.scrollTopDocument = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            let _logo = document.querySelector('.header__logo');
            let _headertop = document.querySelector('.header__top');
            if (_logo != null && _headertop != null) {
                let _logoTGop = this.getOffset(_logo);
                if (_logoTGop.top > 0 && this.scrollTopDocument > _logoTGop.top) {

                    _headertop.classList.add('header__bloc--sticky');


                } else {
                    _headertop.classList.remove('header__bloc--sticky');

                }
            }

        })

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
            if (matchesSelector.call(el, selector)) {
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
            Array.from(selectors).forEach((selector, index) => {

                selector.addEventListener(event, callback);
            });
        } catch (e) {
            console.log(e);
        }
    }

}


document.addEventListener('DOMContentLoaded', function () {
    window._Bollore = new Bollore();
});
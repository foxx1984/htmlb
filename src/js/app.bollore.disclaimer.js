class SliderRCA {
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
    getPositionItem() {
        let currentItem = this.getCurrent();

        //test first child
        let firstchild = document.querySelector(`${this.id} .slider__item:first-child`);
        let lastchild = document.querySelector(`${this.id} .slider__item:last-child`);

        //check current item not null
        if (currentItem != null) {

            //test first child ?
            if (currentItem.previousElementSibling == firstchild) {
                this.elemFirst = firstchild;
            } else
                this.elemFirst = currentItem.previousElementSibling;


            //test last child ?
            if (currentItem.nextElementSibling == lastchild) {
                this.elemLast = lastchild;
            } else
                this.elemLast = currentItem.nextElementSibling;


        }
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


        let _item = _token;
        let _cloneItem = null;


        if (_item != null) {




            //bouton suivant
            if (type == 'next') {

                _cloneItem = _item.cloneNode(true);

                //mode translate
                if (this.options.modeTranslate) {

                    this.marginLeft = -this.delta + this.marginLeft;


                    //set position element
                    this.getPositionItem();
                    let delta = this.posElement(this.elemLast, this.elemFirst, this.marginLeft, type);

                    this.setSlide(delta, 'translate');
                    //set item current
                    this.addCurent(elem);
                    setTimeout(() => {
                        this.setSlide(delta + this.delta, 'translate', 'transition:none;');
                        this.ulContainer.insertBefore( /*elem add*/ this.elemFirst, /*context*/ null);

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
                    let delta = this.posElement(this.elemLast, this.elemFirst, this.marginLeft, type);

                    this.setSlide(delta, 'translate');
                    //set item current
                    this.addCurent(elem);
                    setTimeout(() => {
                        this.setSlide(delta - this.delta, 'translate', 'transition:none;');
                        this.ulContainer.insertBefore( /*elem add*/ this.elemLast, /*context*/ this.elemFirst);

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
    onNextClick(args) {



        let _newItem = this.getItem('next');
        if (_newItem != null) {



            this.addItem(_newItem, 'next');

        }


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

        let _newItem = this.getItem('prev');
        if (_newItem != null) {



            //slide prev
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
    setSlide(delta, type = 'margin', transition = '') {
        if (type == 'translate') {
            this.ulContainer.setAttribute('style', `${transition}transform:translateX(calc(${delta}vw))`);
            if (delta == 0) {
                this.ulContainer.setAttribute('style', `${transition}`);

            }

        } else if (type = 'margin') {
            this.ulContainer.setAttribute('style', `${transition}margin-left:calc(${delta}vw)`);
        } else {
            this.ulContainer.setAttribute('style', `${transition}margin-left:calc(${delta}vw)`);

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
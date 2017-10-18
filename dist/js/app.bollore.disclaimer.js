class Disclairmer {

    constructor() {
      
        this.elemClosePopin = null;
        this.overlay = null;
        this.content = document.querySelector('.content');
        this.popinDisclaimer = null;

        this.init();

    }
    initClosePopin(){
        this.elemClosePopin = document.querySelector('.closePopin');
        this.overlay = document.querySelector('.overlayDislaimer');
        this.popinDisclaimer = document.querySelector('.popin--disclaimer');
       if(this.elemClosePopin !=null){

        this.elemClosePopin.addEventListener('click',(args)=>{

            args.preventDefault();
            this.closePopin();

        })

       }
    }
    closePopin() {
        if (this.overlay != null) {


            this.overlay.remove();
        }

        if( this.popinDisclaimer!=null){
            this.popinDisclaimer.remove();
        }
    }
    openUrl() {

        var parsedUrl = new URL(window.location.href);
        let popinId = parsedUrl.searchParams.get("popin-id") + "";
        let headerTxt = parsedUrl.searchParams.get("headerTxt") + "";
        let url = parsedUrl.searchParams.get("url") + "";
        let txt = parsedUrl.searchParams.get("txt") + "";
        let btnTxt = parsedUrl.searchParams.get("btnTxt") + "";
        if (popinId != "" && headerTxt != "" && txt != "") {
            open(true, popinId, headerTxt, txt,btnTxturl,url);
        }
    }
    open(flag, popinId, headerTxt, txt,btnTxt,url) {

        if (flag) {
            //chceck si overlay else remove and add

            this.closePopin();
            if (this.content != null) {
             
                this.content.insertAdjacentHTML('afterend',`
                <div class="overlayDislaimer">
                </div>
                <div class='popin popin--disclaimer'>
                    <div class="closePopin">
                        <div class="close__left closeElement"></div>
                        <div class="close__right closeElement"></div>
                    </div>
                    <article class="popin__wrapper">
                        <header><h1 class="popin__title"><span class="popin__spanTitle --titleHead"> ${headerTxt}</span></h1></header>
                        <div class="popin__content">
                            <div class="popin_wysiwyg">
                            ${txt}
                            </div>
                        </div>
                        <footer>
                            <a class="popin__link linkG--blue" href="#"> <span class="linkT linkTxtAnim">${btnTxt}</span></a>
                        </footer>
                    </article>
                </div>
                `);


            }

        }
    }
    init() {
        this.setRules();
       
    }

    setRules() {

        let rules = document.querySelectorAll('.slider__link');

        //check if data
        if (rules != null && rules.length > 0) {
            this.addEventListenerAll(rules, 'click', (args) => {
                args.preventDefault();
              
                let popinId = args.currentTarget.dataset['popinId'] + "";
                let headerTxt = args.currentTarget.dataset['header'] + "";
                let txt = args.currentTarget.dataset['txt'] + "";
                let url = args.currentTarget.dataset['url'] + "";
                let btnTxt = args.currentTarget.dataset['btnTxt'] + "";
                if (popinId != "" && headerTxt != "" && txt != "" && url!="" && btnTxt !="") {

                    this.open(true, popinId, headerTxt, txt,btnTxt,url);
                    this.initClosePopin();

                }

            });
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

let disclaimer = new Disclairmer();
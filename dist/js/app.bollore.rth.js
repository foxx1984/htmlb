document.addEventListener('DOMContentLoaded', function () {
    Faq.init();
    mapMonde.init();
    sliderDocument.init();
});

var Faq = {
    bloc: null,
    listeLink: null,
    listeBlock: null,

    init: function () {
        Faq.bloc = document.querySelector(".pageFaq");
        Faq.listeLink = document.querySelectorAll(".faqLink");

        if (Faq.listeLink.length > 0) {
            Faq.listeBlock = document.querySelectorAll(".faqBlock");

            for (var i = 0; i < Faq.listeLink.length; i++) {
                Faq.listeLink[i].dataset.index = i;
                Faq.listeLink[i].addEventListener("click", function (e) {
                    e.preventDefault();
                    Faq.showElem(this);
                });
                if (i == 0) {
                    Faq.showElem(Faq.listeLink[i]);
                }
            }
        }
    },

    showElem: function (elem) {
        var index = elem.dataset.index;

        for (var i = 0; i < Faq.listeBlock.length; i++) {
            if (i == index && !Faq.listeBlock[i].classList.contains("commonText--selected")) {
                Faq.listeBlock[i].classList.add("commonText--selected");
                Faq.listeLink[i].parentNode.classList.add("secondTitle--type2--selected");
            }
            else {
                Faq.listeBlock[i].classList.remove("commonText--selected");
                Faq.listeLink[i].parentNode.classList.remove("secondTitle--type2--selected");
            }
        }
    }
}

var mapMonde = {
    listeBlock: null,

    init: function () {
        mapMonde.listeBlock = document.querySelectorAll(".mapMonde__item");

        if (mapMonde.listeBlock.length == 4) {
            mapMonde.listeBlock[1].classList.add("mapFull");
            mapMonde.listeBlock[3].innerHTML = "<div class='mapTablet'>" + mapMonde.listeBlock[1].innerHTML + "</div>" + mapMonde.listeBlock[3].innerHTML;
        }
    }
}

var sliderDocument = {
    listeBlock: null,

    init: function () {
        sliderDocument.listeBlock = document.querySelectorAll(".listeDocs__slideshowmobile");

        for (var i = 0; i < sliderDocument.listeBlock.length; i++) {
            sliderDocument.listeBlock[i].classNameSlideItem = sliderDocument.listeBlock[i].dataset.slideitem;
            sliderDocument.listeBlock[i].listItems = sliderDocument.listeBlock[i].querySelectorAll("." + sliderDocument.listeBlock[i].dataset.slideitem);
            sliderDocument.listeBlock[i].currentItem = -1;
            sliderDocument.generateButton(sliderDocument.listeBlock[i], "--prev", -1);
            sliderDocument.generateButton(sliderDocument.listeBlock[i], "--next", 1);
            sliderDocument.showPage(sliderDocument.listeBlock[i], 1);
        }
    },

    generateButton: function (box, modifier, sens) {
        var btn = document.createElement("a");
        btn.classList.add("slideshowmobile__btn");
        btn.classList.add("icon-fleche-1");
        btn.classList.add("slideshowmobile__btn" + modifier);
        btn.addEventListener("click", function () {
            sliderDocument.showPage(box, sens);
        })
        box.appendChild(btn);
    },

    showPage: function (box, sens) {
        box.currentItem = (box.currentItem + sens + box.listItems.length) % box.listItems.length;
        for (var i = 0; i < box.listItems.length; i++) {
            if (i == box.currentItem)
                box.listItems[i].classList.add(box.classNameSlideItem + "--current");
            else
                box.listItems[i].classList.remove(box.classNameSlideItem + "--current");
        }
    }
}
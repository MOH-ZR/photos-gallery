'use strict';

$(document).ready(function() {
    let allHorns1 = [];
    let allHorns = [];
    let keywords = [];
    const Horn = function(horn) {
        this.title = horn.title;
        this.description = horn.description;
        this.keyword = horn.keyword;
        this.image_url = horn.image_url;
        this.horns = horn.horns;
    }
    Horn.prototype.renderHorn = function() {
        let template = $("#horn-template").html();
        let html = Mustache.render(template, this);
        $("main").append(html);
    };

    // ajax setting 
    const ajaxSettings = {
        method: 'get',
        dataType: 'json',
    };

    // show the selected page
    $("button").on('click', function() {
        readData($(this).attr('id'));
    });

    // filter the content based on the selected keyword
    $('select').on('change', () => {
        let selectedKeyword = $(this).find(':selected').val();
        if (selectedKeyword == 'filter') {
            allHorns = allHorns1;
        } else {
            filterHorns(selectedKeyword);
        }
        renderPage();
    });

    // resort the horns based on change 
    $('input[type=radio][name="sort"]').on('change', function() {
        renderPage();
    });

    readData('1');
    // filter horns
    function filterHorns(keyword) {
        const tempArr = [];
        allHorns1.forEach((horn) => {
            if (horn.keyword === keyword) {
                tempArr.push(horn);
            }
        })
        allHorns = tempArr;
    }
    // get the filtered keywords
    function getKeywords() {
        allHorns.forEach((horn) => {
            if (!keywords.includes(horn.keyword)) {
                keywords.push(horn.keyword);
            }
        });
        renderKeyWords();
    }

    // sort horns
    function sortHorns() {
        const basedOn = $('input[name="sort"]:checked').val();
        if (basedOn === 'title') {
            allHorns.sort((horn1, horn2) => {
                if (horn1.title < horn2.title) {
                    return -1;
                }
                if (horn1.title > horn2.title) {
                    return 1;
                }
                return 0;
            });
        } else if (basedOn === 'number') {
            allHorns.sort((horn1, horn2) => {
                return horn2.horns - horn1.horns;
            });
        }
    }
    // render the selected page
    function renderPage() {
        $('section').remove();
        sortHorns();
        allHorns.forEach(horn => horn.renderHorn());
    }

    // render keywords
    function renderKeyWords() {
        $('select').text("");
        $('select').append('<option value=filter>Filter by Keyword</option>')
        keywords.forEach(keyword => $('select').append(`<option value=${keyword}>${keyword}</option>`));
    }

    // read data from Ajax
    function readData(pageNumber) {
        allHorns = [];
        keywords = [];
        allHorns1 = [];
        $.ajax(`data/page-${pageNumber}.json`, ajaxSettings).then((data) => {
            data.forEach((horn) => {
                const newHorn = new Horn(horn);
                allHorns.push(newHorn);
                allHorns1.push(newHorn);
            });
            getKeywords();
            renderPage();
        });
    }
});
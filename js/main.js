var Atlassin = (function($){

    //Global data structure
    var videoData = [];

    function getSessionData() {
        $.when($.get('./json/sessions.json').done((data)=> {
            videoData = buildVideoData(data);
            buildNavMenuTabs(videoData);
        }));
    }
    /**
     * Builds a custom data structure for nav, tab and
     * Description data
     */
    function buildVideoData(data) {
        if(!data){
            return false;
        }

        data.Items.forEach((item)=> {

            if(item.Speakers != undefined){
                var speakerName = item.Speakers[0].FirstName + " " + item.Speakers[0].LastName
            }
            videoData.push({
                'track': item.Track.Title,
                'title': item.Title,
                'desc': item.Description,
                'speaker': speakerName
            })
        });
        return videoData;
    }
    /**
     * Builds Nav tab menu
     */

    function buildNavMenuTabs(data) {
        if (data.length < 1) {
            return false
        }
        //Only setting the first 6 tabs
        data.forEach((tab, i) => {
            if(i < 6){
                $('nav ul').append("<li>" + tab.track + "</li>")
            }
        });
        //add evenet listener
        $('nav li').click(function(e){
            var tab = e.target;
            displayTab(tab);
            syncTabToLeftTabHeading(tab)
        });

        //onLoad display first tab
        buildLeftTabMenu(data);
        var firstTab = $('nav ul li')[0];
        displayTab(firstTab);
        renderArticle(data[0]);
        $('.title_author li:first-child').addClass('left_tab_selected');
    }

    function displayTab(tab) {
        $('.tab_selected').removeClass();
        var t = $(tab);
        t.addClass('tab_selected');
        syncTabToLeftTabHeading(t);
    }
    /**
     * Builds left tab menu
     */
    function buildLeftTabMenu(data) {
        var tab = $('.left_tab');
        var list = tab.children()[1];

        if (list.nodeName == "UL") {
            var sideTab = $(list);
            //Only render 7 left tabs
            data.forEach((item, i )=>{
                if(i < 7){
                    sideTab.append("<li><span class='tab_title'>" + item.title + "</span><span class='speaker'> " + item.speaker + "</span></li>");
                }
            });

          sideTab.click(function(e){
              if(e.target.className !== "tab_title"){
                  return false;
              }

              $('.title_author li.left_tab_selected').removeClass();
              var title = e.target.innerText;
              var obj = findObjectByTitle(title);
              e.target.parentElement.className ='left_tab_selected';
              renderArticle(obj);
          });
        }
    }

    function syncTabToLeftTabHeading(tab){
        var detail = $(tab).text();
        $('.left_tab h3').text(detail);
    }

    function renderArticle(obj) {
        $('.article_desc h1').text(obj.title);
        $('article').text(obj.desc);
        $('.author').text(obj.speaker);

    }

    /**
     * Helper functions
     */

    function findObjectByTitle(title){
        var obj = {};
        videoData.forEach((item)=> {
            if(item.title == title){
                obj = Object.assign({},item);
            }
        });
        return obj;
    }
    return {
        'getSessionData':getSessionData
    }
})($);
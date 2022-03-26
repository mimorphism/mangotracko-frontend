console.log('MangoTracko');
const mangoesElement = document.querySelector('.mangoes');
const mangoChild = document.querySelector('.row.active-with-click');
const LAST_DATE_READ = "LAST READ: <br>";
const LAST_CHAPTER_READ = "LAST CHAPTER: <br>";
const API_URL = 'http://192.168.1.3:8080';
const popup = document.querySelector('.popup-ongoingmango-options');
var DateTime = luxon.DateTime;
var header = document.querySelector('.header');
const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';


let loading = false;
let skip = 0;
let finished = false;

 
// function hide() {
//     console.log("Bitch")
//   popup.classList.add('hide');
//  }


function searchMango(event){

    var link = GOOGLE_SEARCH_URL + 'read ' + event.currentTarget.mangoTitleParam + " " + ((event.currentTarget.lastChapterParam) + (Number(1)));
    window.open(link,'_blank');
}

function displayOptionsPopup(visible)
{
    var popup = document.querySelector('.popup-ongoingmango-options');
    var blocker = document.querySelector('.blocker');

    if(visible)
    {
        popup.style.display = 'block';
        blocker.style.display = 'block';
    }
    else
    {
        popup.style.display = 'none';
        blocker.style.display = 'none';
    }
    
}

function initOngoingMangoOptions(event)
{
    displayOptionsPopup(true);
    var mangoTitle = event.currentTarget.mangoTitleParam;
    document.getElementById('update-btn').href="addMango.html?title="+mangoTitle;
    var finish = document.getElementById('finish-btn').href="finishMango.html?title="+mangoTitle;
    
}

listAllMangoes();

function listAllMangoes() {
    let mangoTitle = '';
    let img = '';
    let author = '';
    let ongoingMangoInfo = '';
    let lastChapterRead = '';
    

    axios.get(API_URL + '/ongoingMangoes')
        .then(response => {
            console.log(response);
            for(var i = 0;i < response.data.length; i++)
            {
                mangoTitle = response.data[i].mangoTitle;
                lastChapterRead = response.data[i].ongoingMango.lastChapterRead;

                ongoingMangoInfo =  LAST_DATE_READ + DateTime.fromISO(response.data[i].ongoingMango.lastReadTime).toFormat('EEE d LLL yyyy h:mm a')
                + '<br><br>' + LAST_CHAPTER_READ + lastChapterRead;
                img = response.data[i].img;
                author = response.data[i].author;
                localStorage.setItem(mangoTitle, JSON.stringify(response.data[i].ongoingMango));
                mangoChild.insertAdjacentHTML('beforeend', 
                `<div class="col-md-3">
                <article class="material-card Grey">
                    <div class="mc-content">
                        <div class="img-container">
                            <img class="img-responsive" id="${mangoTitle}" src=${img}>
                        </div>
                        <h2 class="contentH2">
                        <a href="#" id="${mangoTitle}-options"><span>${mangoTitle}</span></a>
                        <strong>
                            <i class="fa fa-fw fa-star"></i>
                            ${author}
                        </strong>
                    </h2>
                        <div class="mc-description">
                            <strong>${ongoingMangoInfo}</strong>
                        </div>
                    </div>
                    <a class="mc-btn-action">
                        <i class="fa fa-bars"></i>
                    </a>
                </article>
            </div>`);
            document.getElementById(mangoTitle).addEventListener("click", searchMango);
            document.getElementById(mangoTitle + "-options").addEventListener("click", initOngoingMangoOptions);
            document.getElementById(mangoTitle).mangoTitleParam = mangoTitle;
            document.getElementById(mangoTitle + "-options").mangoTitleParam = mangoTitle;
            document.getElementById(mangoTitle).lastChapterParam = parseInt(lastChapterRead);
            


            }



            $(function() {
                $('.material-card').materialCard({
                    icon_close: 'fa-chevron-left',
                    icon_open: 'fa-bars',
                    icon_spin: 'fa-spin-fast',
                    card_activator: 'click'
                });
                // window.setTimeout(function() {
                //     $('.material-card:eq(0)').materialCard('open');
                // }, 2000);
            
            });
            
        })
        .catch(err => console.error(err.message));
}




window.addEventListener('scroll', function(){
    // var header = document.querySelector('.test');
    header.classList.toggle('sticky', window.scrollY > 0);
 });


 $(document).ready(function(){
    $(".blocker").click(function(){
        // console.log("Bitch")
      displayOptionsPopup(false);
    });
  });

  $(function(){
    $("#mango-header").load("header.html"); 
  });

  
 $(function(){
    $("#nav").load("navigation.html"); 
  });

var resBox = document.getElementById('resBox');
var puppy = document.getElementById('puppy').lastElementChild;
var input = document.getElementById('input');
input.value = "";

var elemList = null;
var clean = [];
var lock = 1;

var inputGet; 


var foc = 0;

var checkLock = 1;


var baseURL = 'https://4rkiel.github.io/';



function clickHandler (evt){

    input.focus();

}



function keyHandler (evt){

    var e = event || evt;
    var charCode = e.which || e.keyCode;

    var child = resBox.children;

    if (charCode == 9 ) {

        e.preventDefault();
        e.stopPropagation();

        if (foc != -1){

            child[foc].classList.remove('focus');

            foc = (foc+1) % child.length;

            child[foc].classList.add('focus');

        }

        input.focus();


    } else if (charCode == 13){
 
        e.preventDefault();
        e.stopPropagation();
       
        var url = child[foc].children[0].href;
        window.location.href = url;

    }

}


function searchList (){

    resBox.innerHTML = '';

    var word = input.value.toUpperCase();

    if (word == ''){
    
        foc = -1;

        return;
    }


    var cnt = 0;

    for (var k=0 ; k < clean.length ; k++){

        var name = clean[k].name.toUpperCase();
        if (name.indexOf(word) !== -1){

            cnt ++;

            var clone = puppy.cloneNode(true);
            var child = clone.children;

            child[0].innerHTML = clean[k].name;
            child[0].href = baseURL + clean[k].name;

            child[1].innerHTML = clean[k].desc;

            for(var h=1; h < clean[k].topics.length ; h++){
                var topic = document.createElement('pre');
                topic.innerHTML = clean[k].topics[h];
                
                child[2].appendChild(topic);

            }

            resBox.appendChild(clone);

        }
    }
    
    if (cnt != 0){

        foc = 0;
        resBox.children[foc].classList.add('focus');
    }

}


function prepEnd (){

    logEnd -- ;
    if (logEnd == 0){

        for (var k=0 ; k < elemList.length ; k++){

            for (var h=0 ; h < clean.length ; h++){

                if (k == clean[h].key){
                    
                    clean[h].name = elemList[k].name;
                    clean[h].desc = elemList[k].description;

                    break;
                }
            }

        }

        var hide = document.getElementById('hidder');
        hide.classList.add('hidded');

        input.focus();

        inputGet = input.addEventListener("input", searchList, false);
    }
}


function reposList() {

    var list = JSON.parse(this.responseText);
    elemList = list;    

    logEnd = elemList.length;
    for(var k=0 ; k < elemList.length ; k++){

        (function(k){

            var request = new XMLHttpRequest();

            request.onload = (function(k){
                return function (){ 
                    var resTopics = JSON.parse(this.responseText);

                    if (resTopics.names.length > 0 || resTopics.names[0] == 'psy-tool'){

                            clean.push({
                                key: k,
                                topics: resTopics.names
                            });
                        }


                        prepEnd(); 
                    }

                })(k);


            request.open(
                    'get', 
                    'https://api.github.com/repos/4rkiel/'+elemList[k].name+'/topics', 
                    true
            );
            request.setRequestHeader('Accept', 'application/vnd.github.mercy-preview+json');
            request.send();

        })(k);
    }

}

var request = new XMLHttpRequest();
request.onload = reposList;
request.open('get', 'https://api.github.com/users/4rkiel/repos', true);
request.send();


var keyGet = document.addEventListener("keydown", keyHandler, false);
var clickGet = document.addEventListener("click", clickHandler, false);



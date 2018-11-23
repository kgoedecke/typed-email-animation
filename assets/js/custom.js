  var timeout1, timeout2;


  var typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 15,
    backDelay: 700,
    autoInsertCss: true,
    onComplete: function(self) { 
    	document.getElementById("main-window").classList.toggle('fade-out-slide-out');
    	timeout1 = setTimeout(function () {
            document.getElementById("main-window-answer").classList.toggle('fade-out');
            timeout2 = setTimeout(function () {
            	document.getElementById("preview").classList.toggle('fade-out');
            	// setTimeout(function () {
            	// 	document.getElementById("preview").classList.add('fade-out');
            	// }, 2000);
            }, 2000);
    }, 2000);
    	
     },
  });

  document.getElementById("replay").onclick = function() {
    if (timeout1) {
      clearTimeout(timeout1);  
    }
    if (timeout2) {
      clearTimeout(timeout2);  
    }
  
  	document.getElementById("main-window-answer").classList('fade-out');
  	document.getElementById("main-window").classList.remove('fade-out-slide-out');

  };


  document.getElementById("show-pdf-preview").onclick = function() {
    document.getElementById("preview").classList.toggle('fade-out');
    document.getElementById("preview").onclick = function() {
      event.stopPropagation();
    }
  }



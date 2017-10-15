
  var typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 20,
    backDelay: 700,
    autoInsertCss: true,
    onComplete: function(self) { 
    // 	document.getElementById("main-window").classList.add('fade-out-slide-out');
    // 	setTimeout(function () {
    //         document.getElementById("main-window-answer").classList.remove('fade-out');
    //         setTimeout(function () {
    //         	document.getElementById("preview").classList.remove('fade-out');
    //         	setTimeout(function () {
    //         		document.getElementById("preview").classList.add('fade-out');
    //         	}, 2000);
    //         }, 2000);
    // }, 2000);
    	
     },
  });

  document.getElementById("replay").onclick = function() {
  	document.getElementById("main-window-answer").classList.add('fade-out');
  	document.getElementById("main-window").classList.remove('fade-out-slide-out');
  	typed.reset(true);
  };




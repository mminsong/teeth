window.addEventListener("load", function(){
	let header=document.getElementById("header");
	let tab=header.querySelector(".tab");
	let menu=header.querySelector(".total");
	let menuList=menu.querySelectorAll("li");

	tab.addEventListener("click", function(e){
		e.preventDefault();

		if(e.currentTarget.classList.contains("active") == false){
			e.currentTarget.classList.add("active");
			document.body.classList.add("fixed");

			gsap.fromTo(menu, {display: "block", opacity: 0}, {opacity: 1, duration: 0.3});
		}
		else{
			e.currentTarget.classList.remove("active");
			document.body.classList.remove("fixed");

			gsap.to(menu, {opacity: 0, duration: 0.3, onComplete: function(){
				menu.removeAttribute("style");
			}});
		}
	});

	let mainSlider=document.querySelector("#start .main_slider");
	let controller=mainSlider.querySelector(".controller");
	let [num, progressbar, direction]=controller.children;
	let bar=progressbar.firstElementChild;
	let [prevBtn, nextBtn]=direction.children;
	let tween, current, total;

	function swiperButtonInteraction(n){
		switch(n){
			case 0 :
				prevBtn.classList.remove("visible");
				nextBtn.classList.add("visible");
				break;
			case total-1 :
				prevBtn.classList.add("visible");
				nextBtn.classList.remove("visible");
				break;
			default :
				prevBtn.classList.add("visible");
				nextBtn.classList.add("visible");
				break;
		}
	}

	const mainSwiper=new Swiper(".mainSwiper", {
		speed: 1200,
		loop: true,
		/*
		autoplay: {
			delay: 8000,
			disableOnInteraction: false
		},
		*/
		on: {
			init(){
				current=this.realIndex;
				total=this.slides.length;

				num.innerHTML=`${current+1} / ${total}`;

				swiperButtonInteraction(current);

				tween=gsap.to(bar, {width: "100%", duration: 8});
			},
			slideChange(){
				current=this.realIndex;

				num.innerHTML=`${current+1} / ${total}`;

				swiperButtonInteraction(current);

				tween.pause();
				tween.seek(0);

				setTimeout(function(){
					tween.play();
				}, 10);
			}
		}
	});

	prevBtn.addEventListener("click", function(e){
		e.preventDefault();
		mainSwiper.slidePrev();
	});

	nextBtn.addEventListener("click", function(e){
		e.preventDefault();
		mainSwiper.slideNext();
	});

	let n=0;
	let prevN;

	let sectionList=document.querySelectorAll("section");

	function scrollInteraction(t){
		if(t < sectionList[1].offsetTop){
			n=0;
		}
		else if(t < sectionList[2].offsetTop){
			n=1;
		}
		else if(t < sectionList[3].offsetTop){
			n=2;
		}
		else{
			n=3;
		}

		if(n == prevN) return;

		prevN=n;

		for(let i=0; i<menuList.length; i++){
			if(i == n){
				menuList[i].classList.add("active");
			}
			else{
				menuList[i].classList.remove("active");
			}
		}
	}

	const trigger=new ScrollTrigger.default({
		trigger: {
			once: true,
			toggle: {
				class: {
					in: "active",
					out: "inactive"
				}
			},
			offset: {
				viewport: {
					x: 0,
					y: 0.25
				}
			}
		},
		scroll: {
			element: this.window,
			callback: offset => scrollInteraction(offset.y)
		}
	});

	trigger.add("#start, #page1, #page2, #page3 .title, #page3 .work > ul > li");

	for(let i=0; i<menuList.length; i++){
		menuList[i].addEventListener("click", function(e){
			e.preventDefault();

			tab.classList.remove("active");
			document.body.classList.remove("fixed");

			let pos=sectionList[i].offsetTop;

			gsap.to(menu, {opacity: 0, duration: 0.3, onComplete: function(){
				menu.removeAttribute("style");
				gsap.to(window, {scrollTo: pos, duration: 0.5});
			}});
		});
	}
});
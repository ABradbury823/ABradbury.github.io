const template = document.createElement("template");
template.innerHTML = `
<style>
    .container {
        padding: 1rem 0;
        color: #eee;
    }

    .slider-wrapper {
        position: relative;
        max-width: 35rem;
        margin: 0 auto;
    }

    .slider {
        display: flex;
        align-items: center;
        aspect-ratio: 16/9;
        overflow: hidden;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        border: 1px solid rgb(40,40,40);
        user-select: none;
        box-shadow: 3px 3px 10px #111;
        z-index: 1;
    }

    .slider-nav {
        display: flex;
        column-gap: 1rem;
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
    }

    .slider-dot {
        width: .5rem;
        height: .5rem;
        border-radius: 50%;
        border: 1px solid #555555;
        background-color: #ffffff;
        opacity: .5;
        transition: opacity ease 250ms;
        cursor: pointer;
        z-index: 3;
    }

    .slider-dot:hover {
        opacity: 1;
    }

    .slider-arrows {
        display: flex;
        justify-content: space-between;
        margin-top: .25rem;
        position: absolute;
        bottom: 0%;
        width: 100%;
        height: 100%;
    }

    .left-arrow, .right-arrow {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 3rem;
        height: 100%;
        background-color: #000;
        opacity: 0;
        transition: opacity ease 250ms;
        cursor: pointer;
        text-align: center;
        font-size: 2.75rem;
        font-weight: bold;
        color: #777;
        user-select: none;
        z-index: 2;
    }

    .left-arrow:hover, .right-arrow:hover {
        opacity: .5;
    }
</style>
<section class="container">
    <div class="slider-wrapper">
        <div>
            <slot name="slider-images" class="slider">
                <!-- List of images go here --!>
            </slot>
            <div class="slider-arrows">
                <span class="left-arrow"><span>&#10092;</span></span>
                <span class="right-arrow"><span>&#10093;</span></span>
            </div>
        </div>
        <div class="slider-nav">
            <!-- Slider dots to show location --!>
        </div>
    </div>
</section>
`;

class ImageSlider extends HTMLElement {
    static defaultImage = "https://via.placeholder.com/100x100";

    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.leftBtn = this.shadowRoot.querySelector(".left-arrow");
        this.rightBtn = this.shadowRoot.querySelector(".right-arrow");
        this.slider = this.shadowRoot.querySelector("slot");
        this.sliderNav = this.shadowRoot.querySelector(".slider-nav");

        //this.imageData = this.dataset.images.split(",") ?? [];
        this.mediaElements = this.slider.assignedNodes();
        
        //go through images and make slider dot
        for (let i = 0; i < this.mediaElements.length; i ++) {
            let newDot = document.createElement("span");
            newDot.classList.add("slider-dot");
            
            this.sliderNav.appendChild(newDot);
        }
        this.totalElements = this.mediaElements.length ?? 0;

        this.currentImage = this.mediaElements[0] ?? null;
        this.currentIndex = 0;

        //hooking up button events
        const leftWrapper = e => this.changeImage(this.currentIndex - 1);
        const rightWrapper = e => this.changeImage(this.currentIndex + 1);

        this.leftBtn.onclick = leftWrapper;
        this.rightBtn.onclick = rightWrapper;

        //hooking up slider dots event
        this.sliderDots = Array.from(this.shadowRoot.querySelectorAll(".slider-nav span")) ?? [];
        this.sliderDots[0].style = "opacity: 1;";
        for(let i = 0; i < this.totalElements; i++) {
            const dotWrapper = e => this.changeImage(i);
            this.sliderDots[i].onclick = dotWrapper;
        }

        this.render();
    }

    disconnectedCallback() {
        this.leftBtn.onclick = null;
        this.rightBtn.onclick = null;
    }

    render() {
        for(let i = 0; i < this.totalElements; i++) {
            //change opacity of appropriate slider dot
            i == this.currentIndex ? this.sliderDots[i].style = "opacity: 1" : this.sliderDots[i].style = "opacity: .5";

            //change image being displayed
            i == this.currentIndex ? this.mediaElements[i].hidden = false : this.mediaElements[i].hidden = true; 
        }
        
    }

    changeImage(index) {
        if(this.currentIndex == index) return;

        this.currentIndex = index;

        //sanitize index
        if(this.currentIndex < 0) this.currentIndex = this.totalElements - 1;
        else if(this.currentIndex >= this.totalElements) this.currentIndex = 0;

        this.currentImage = this.mediaElements[this.currentIndex];

        this.render();
    }


} //end class

customElements.define("image-slider", ImageSlider)

//Dynamic image slider HTML
//     <section class="container">
//         <div class="slider-wrapper">
//             <div class="slider">
//                 <img id="slide1" src="media/personal-eyes.PNG" alt="Title screen of Personal Eyes">

//                 PLACEHOLDER IMAGE
//                 <img id="slide2" src="media/cropbuster.jpg" alt="">
                        
//                 PLACEHOLDER IMAGE
//                 <img id="slide3" src="media/siege-the-castle.PNG" alt="">
//             </div>
//         <div class="slider-nav">
//             <span class="slider-dot"></span>
//             <span class="slider-dot"></span>
//             <span class="slider-dot"></span>
//         </div>
//         <div class="slider-arrows">
//             <span class="left-arrow">&lt;</span>
//             <span class="right-arrow">&gt;</span>
//         </div>
//     </div>
// </section>
const template = document.createElement("template");
template.innerHTML = `
<style>

.container{
    display: flex;
    flex-direction: column;
}

.project{
    border-radius: 10px;
}

.project-btn{
    margin: 1rem;
    width: 150px;
    height: 45px;
    font-family: 'Lexend', Verdana, Geneva, Tahoma, sans-serif;
    font-size: 1.33rem;
    font-variant-caps: all-small-caps;
    font-weight: bolder;
    color: #eee;
    background-color: rgb(214, 71, 71);
    border-radius: 2px;
    border: 3px solid rgb(55,55,55);
    align-self: center;
    cursor: pointer;
}

.project-btn:hover { background-color: rgb(150, 25, 25); }
.project-btn:active { background-color: rgb(150, 25, 25); }

hr{
    border-top:1px solid #727272;
}

.project-description{
    margin: 1rem 0;
    line-height: 1.5rem;
    display: inline-block;
    max-width: 40rem;
}
</style>

<div class="container">
    <div class="project">
        <hr>
        <slot name="proj-desc" class="project-description">
            <!-- Project description goes here --!>
        </slot>
        <hr>
    </div>
    <button class="project-btn">Show More</button>
</div>
`;

class ProjDesc extends HTMLElement {
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    connectedCallback(){
        this.content = this.shadowRoot.querySelector(".project");
        this.button = this.shadowRoot.querySelector(".project-btn");

        this.content.hidden = false;

        //button event
        this.button.onclick = e => this.toggleVisible();

        this.render();
    }

    disconnectedCallback(){
        this.button.onclick = null;
    }

    render(){
        this.content.hidden ? this.button.textContent = "Show More" : this.button.textContent = "Show Less";
    }

    toggleVisible(){
        this.content.hidden = !this.content.hidden;
        this.render();
    }

} //end class

customElements.define("proj-desc", ProjDesc);

//project description HTML
/* <div class="project" id="first-project">
    <hr>
    <p class="project-description">
        [INSERT TEXT HERE]
    </p>
    <hr>
</div>
<button class="project-btn" id="btn">Show More</button> */
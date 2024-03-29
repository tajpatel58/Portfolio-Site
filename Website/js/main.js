/*===== Show Menu =====*/
const navMenu = document.getElementById('nav-menu'),
    toggleMenu = document.getElementById('nav-toggle'),
    closeMenu = document.getElementById('nav-close')

    // SHOW
toggleMenu.addEventListener('click', ()=>{
    navMenu.classList.toggle('show')
})

// HIDDEN
closeMenu.addEventListener('click', ()=>{
    navMenu.classList.remove('show')
})

/*===== ACTIVE AND REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    navMenu.classList.remove('show')
}

navLink.forEach(n => n.addEventListener('click', linkAction))

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]')

window.addEventListener('scroll', scrollActive)

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        let sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*='+ sectionId + ']').classList.add('active')
        }else{
            document.querySelector('.nav__menu a[href*='+ sectionId + ']').classList.remove('active')
        }
    })
}

/*=================================== Dark Light Theme ================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)

    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon)
})


/*=================================== CHATBOX JS ================*/
class Chatbox{
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'), 
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            closeButton: document.querySelector('.chatbox__close')
        }

        this.state = false;
        this.messages = [];
        this.counter = 0
    }


    display() {
        const {openButton, chatBox, sendButton, closeButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        }) 
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if(this.counter == 0) {
            let first_msg = {name : 'Taj', message : "You can ask me questions like: <br> -What technologies do you know? <br> -What did you do at Darktrace? <br> -What are your hobbies? <br><br>and more! :)"}
            this.messages.push(first_msg)
            this.updateChatText(chatbox)
        }

        this.counter += 1
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = {name : "User", message : text1}
        this.messages.push(msg1);
        //'https://us-central1-aiplatform.googleapis.com/v1/projects/Website-Chatbot/locations/us-central1/endpoints/2781034342552436736:predict'
        //'https://chatbot-oenm5752hq-uc.a.run.app'
        // http://localhost:9090/predictions/chatbot
        // this one works: http://34.71.154.134:8080 VM Instance IP.
        // http://34.160.33.246:80 load balancer http IP. 
        // https://35.244.138.95:443 <= Lod balancer IP HTTPS
        fetch('https://tajpatel-portfolio.co.uk/predictions/chatbot', {
            method: 'POST',
            body : JSON.stringify({message : text1}),
            mode : 'cors',
            headers : {'Content-Type' : 'application/json'},
        })
        .then(function(response) {
            if(response.ok) {
            console.log(response.ok)
            const r = response.text()
            let msg2 = { name : 'Taj', message : r };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''
            } else {
            console.log(response.status)
            let errors_msg = {name : 'Taj', message : 'Due to Google Compute Engine costs, this model is temporarily unavailable. If you would like to <br> test this model, please drop me an email at: <br> tajpatel58@gmail.com. Thanks'}
            this.messages.push(errors_msg)
            this.updateChatText(chatbox)
            textField.value = ''
            }

            }).catch((error) => {
            console.error('Error: ', error);
            let errors_msg = {name : 'Taj', message : 'Due to Google Compute Engine costs, this model is temporarily unavailable. If you would like to <br> test this model, please drop me an email at: <br> tajpatel58@gmail.com. Thanks'}
            this.messages.push(errors_msg)
            this.updateChatText(chatbox)
            textField.value = ''
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, ){
            if(item.name === "Taj")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            } else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        }); 
        
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


particlesJS.load('particles-js', './Website/js/particles.json', function() {
    console.log('callback - particles.js config loaded');
  });

const chatbox = new Chatbox();
chatbox.display();

/*=================================== FEEDBACK FORM JS ================*/
class FormChatboxInteractables{
    constructor() {
        // bool variables:
        this.chatBoxState = false;
        this.feedbackSent = false;
        this.feedbackState = false;
        this.successBoxState = false;

        // boxes:
        this.feedbackForm =  document.querySelector('.sign-up__content');
        this.chatbox = document.querySelector('.chatbox__support');
        this.successBox = document.querySelector('.successbox__support')

        // close buttons:
        this.feedbackCloseButton = document.getElementById('feedback__close');
        this.chatBoxCloseButton = document.querySelector('.chatbox__close');
        this.successBoxCloseButton = document.querySelector('.successbox__close')

        // open buttons:
        this.feedbackOpenButton =  document.querySelector('.feedback_open_close_button');
        this.chatBoxOpenButton = document.querySelector('.chatbox__button'); 

        // buttons:
        this.submitButton = document.getElementById('sign-up-button');
        this.messageBox = document.getElementById('message')

    }

    addClickers() {
        this.chatBoxOpenButton.addEventListener('click', () => this.chatBoxToggleState())
        this.feedbackOpenButton.addEventListener('click', () => this.feedbackToggleState())
        this.feedbackCloseButton.addEventListener('click', () => this.feedbackClose())
        this.chatBoxCloseButton.addEventListener('click', () => this.chatBoxClose())
        this.messageBox.addEventListener("input", () => this.validateReview())
        this.submitButton.addEventListener('click', () => this.submitReview())
        this.successBoxCloseButton.addEventListener('click', () => this.successBoxClose())
    }

    chatBoxToggleState() {
        if (this.feedbackSent) {
            if(!this.chatBoxState && !this.successBoxState) {
                this.chatbox.classList.add('chatbox--active')
                this.chatBoxState = true;
            } else if(this.chatBoxState && !this.successBoxState) {
                this.chatbox.classList.remove('chatbox--active');
                this.chatBoxState = false;
            } else if(!this.chatBoxState && this.successBoxState) {
                this.chatbox.classList.add('chatbox--active')
                this.successBox.classList.remove('successbox--active')
                this.chatBoxState = true;
                this.successBoxState = false;
            }
        } else {
            if(!this.chatBoxState && !this.feedbackState) {
                this.chatbox.classList.add('chatbox--active')
                this.chatBoxState = true;
            } else if(!this.chatBoxState && this.feedbackState) {
                this.feedbackForm.classList.remove('form--active')
                this.chatbox.classList.add('chatbox--active')
                this.chatBoxState = true;
                this.feedbackState = false;
            } else if(this.chatBoxState && !this.feedbackState) {
                this.chatbox.classList.remove('chatbox--active')
                this.chatBoxState = false;
            }
        }
    }

    feedbackToggleState() {
        if (this.feedbackSent) {
            if(!this.chatBoxState && !this.successBoxState) {
                this.successBox.classList.add('successbox--active')
                this.successBoxState= true;
            } else if(this.chatBoxState && !this.successBoxState) {
                this.successBox.classList.add('successbox--active')
                this.chatbox.classList.remove('chatbox--active');
                this.chatBoxState = false;
                this.successBoxState = true;
            } else if(!this.chatBoxState && this.feedbackState) {
                this.successBox.classList.remove('successbox--active')
                this.successBoxState = false;
            }
        } else  {
            if(!this.chatBoxState && !this.feedbackState) {
                this.feedbackForm.classList.add('form--active');
                this.feedbackState = true;
            } else if(this.chatBoxState && !this.feedbackState) {
                this.feedbackForm.classList.add('form--active');
                this.chatbox.classList.remove('chatbox--active');
                this.chatBoxState = false;
                this.feedbackState = true;
            } else if(!this.chatBoxState && this.feedbackState) {
                this.feedbackForm.classList.remove('form--active');
                this.feedbackState = false;
            }
        }
    }

    feedbackClose() {
        this.feedbackState = false;
        this.feedbackForm.classList.remove('form--active')
    }

    chatBoxClose() {
        this.chatBoxState = false;
        if (!this.feedbackSent) {
            this.feedbackState = true;
            this.chatbox.classList.remove('chatbox--active')
            this.feedbackForm.classList.add('form--active')
        } else {
            this.chatBoxState = false;
            this.chatbox.classList.remove('chatbox--active')
        }
    }

    submitReview() {
        this.feedbackState = false;
        this.feedbackSent = true;
        this.successBoxState = true;
        this.feedbackForm.classList.remove('form--active')
        this.successBox.classList.add('successbox--active')
    }

    successBoxClose() {
        this.successBox.classList.remove('successbox--active')
        this.successBoxState = false;
    }

    validateReview() {
        if (this.messageBox.value.length == 0) {
            this.submitButton.disabled = true;
        } else {
            this.submitButton.disabled = false; 
        }
    }
}

const interactables = new FormChatboxInteractables();
interactables.addClickers();
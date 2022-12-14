/* Variables */

let sectionFlow = [];
let currentSection = document.getElementById('initial');

const initialSubtitle = document.querySelector('.header__subtitle').innerText;

const keyframeShake = [
    { transform: 'skewY(-4deg)'},
    { transform: 'skewY(4deg)'},
    { transform: 'skewY(-4deg)'},
    { transform: 'skewY(4deg)'},
    { transform: 'skewY(0)'  },
    { transform: 'skewY(0)'  }
];

const shakeTiming = {
    duration: 350,
    iterations: 1,
}

let steps2 = [
    {
        current: 'style',
        next: 'artisticMovements'
    },
    {
        current: 'artisticMovements', 
        next: 'name'
    },
    {
        current: 'name', 
        next: 'email'
    },
    {
        current: 'email', 
        next: 'styleResult'
    },
    {
        current: 'styleResult', 
        next: 'assistance'
    },
    {
        current: 'assistance: no', 
        next: 'deadlines'
    },
    {
        current: 'assistance: yes', 
        next: 'places'
    },
    {
        current: 'deadlines', 
        next: 'places'
    },
    {
        current: 'places', 
        next: 'file'
    },
    {
        current: 'file', 
        next: 'number'
    },
    {
        current: 'number', 
        next: 'availableBudget'
    },
    {
        current: 'availableBudget', 
        next: 'furnitureBuyingEvent'
    },
    {
        current: 'buyed: no', 
        next: 'buySteps'
    },
    {
        current: 'buyed: yes', 
        next: 'findStore'
    }
];

let steps1 = [
    {
        current: 'budget',
        next: 'name'
    },
    {
        current: 'name', 
        next: 'email'
    },
    {
        current: 'email', 
        next: 'assistance'
    },
    {
        current: 'assistance: no', 
        next: 'deadlines'
    },
    {
        current: 'assistance: yes', 
        next: 'places'
    },
    {
        current: 'deadlines', 
        next: 'places'
    },
    {
        current: 'places', 
        next: 'file'
    },
    {
        current: 'file', 
        next: 'number'
    },
    {
        current: 'number', 
        next: 'availableBudget'
    },
    {
        current: 'availableBudget', 
        next: 'furnitureBuyingEvent'
    },
    {
        current: 'buyed: no', 
        next: 'buySteps'
    },
    {
        current: 'buyed: yes', 
        next: 'findStore'
    }
];

let moviment = [
    {
       name:  'contemporaneo', description: 'Contempor??neo ??? Inovador e atemporal. O estilo contempor??neo ?? inovador, pois combina texturas, cores e bastante tecnologia em um s?? ambiente. Atemporal, ele evolui conforme o tempo e pode incorporar elementos modernos, usando materiais de ??ltima gera????o, como metais e vidros. A partir da d??cada de 1990, a decora????o contempor??nea seguiu ?? tend??ncia minimalista, incluindo cores contrastantes ao lado do preto e branco, proporcionando grande destaque e ousadia. Atualmente, um ambiente contempor??neo ?? composto por m??veis de linhas retas e amplas, abrindo espa??o tamb??m para pe??as com design arrojado e que imprimem aos espa??os mais personalidade, com formas geom??tricas org??nicas que quebram a frieza dos elementos lisos predominantes. Nas cores base predominam tons neutros, como preto, branco, cinza, marrom e tonalidades past??is ??? que d??o visibilidade e sofistica????o ao restante da decora????o, que permite cores vibrantes, desde que sua utiliza????o seja agrad??vel e harm??nica. A automa????o de ambientes e a utiliza????o de espelhos para dar a sensa????o de amplitude t??m se tornado cada vez mais comum no estilo.'
    }, 
    {
        name:  'minimalista', description: 'Minimalista ??? Menos ?? mais. O estilo minimalista cria um ambiente limpo, moderno e funcional. Indo al??m da arquitetura, ?? reconhecido tamb??m como um estilo de vida que preza pela funcionalidade e diminui????o do consumismo e excessos. Os ambientes minimalistas s??o projetados com linhas retas e formas geom??tricas simples, com o m??nimo de objetos poss??veis em um mesmo ambiente. Neste estilo predominam paredes em cores claras, ilumina????o natural, grandes planos de vidro e objetos discretos, como quadros em preto, branco e cores neutras. Al??m disso, pe??as met??licas ou amadeiradas podem ser usadas pontualmente como forma de destaque.'
    }, 
]

const movimentMap = new Map( moviment.map( i => [i.name, i.description]));
const stepsMap1 = new Map(steps1.map(i => [i.current, i.next]));
const stepsMap2 = new Map(steps2.map(i => [i.current, i.next]));

const flowMap = new Map([['budget', stepsMap1], ['style', stepsMap2]]);

const flowChoice = document.querySelectorAll('.options .choice');

let flow;

const [back, forward] = document.querySelectorAll('.actions > button');


main()



/* functions */

function main() {
    changeState(currentSection, {
        old: "section--inactive",
        new: "section--active"
    })
    checkActionsVisibility(currentSection)
}


function sendEmail(data) {
    $.ajax({
        url: 'https://formspree.io/f/xwkzdwdg',
        method: 'POST',
        data: data,
        dataType: "json"
    })
    .done(() => { alert("Deu certo!!")})
    .fail(() => { alert(":( deu erro.")});
}


function nextSection(nextSectionID, ...props) {

    const previous = document.querySelector('.section--active');
    currentSection = document.getElementById(nextSectionID);

    if (nextSectionID === 'initial') clearForms();

    changeSubtitle(currentSection);

    const [isComingBack] = props;
    if (! isComingBack === true) {
        sectionFlow.push(previous.id);
    }

    checkActionsVisibility( currentSection )
    
    changeState(previous, {
        new: "section--inactive",
        old: "section--active"
    });

    changeState(currentSection, {
        old: "section--inactive",
        new: "section--active"
    });
    $(window).scrollTop(0);

    if (previous.getAttribute("data-submit") === "true" && ! isComingBack) {
        const formId = '1'
        formData = clearData(formId);
        sendEmail(formData);
    }

    if (nextSectionID === 'styleResult') setInformationStyleResult()
}


function setInformationStyleResult() {
    let name = getMostSelectedField()
    let section = document.getElementById('styleResult');
    
    section.querySelector('#resultTitle').innerText = `Estilo ${name}`;
    section.querySelector('#movimentDescription').innerText = movimentMap.get(name.toLowerCase());

    let form = document.getElementById('artisticMovements');
    let imgs = Array.from( form.querySelectorAll(`.${name}-img`) );

    let galleryImages = Array.from( document.querySelectorAll('#styleResult img.gallery__photo') );

    document.getElementById('resultCover').setAttribute('src', imgs[0].getAttribute("src"))
    
    changeSubtitle(section, `O seu estilo ?? o: ${name}`)

    imgs.forEach((el, i) => {
        galleryImages[i].setAttribute('src', el.getAttribute("src"));
    })

}


function getMostSelectedField() {
    let form = document.getElementById('artisticMovements');
    form = Array.from(form.querySelectorAll('input[name="movement"]:checked'));

    let fields = form.reduce((acc, e) => {
        if (e.value in acc) {
            acc[e.value] = acc[e.value] + 1;
        } else {
            acc[e.value] = 1;
        }
        return acc
    }, {})

    let mostSelectedField = {name: '', value: 0}

    for (const [name, value] of Object.entries(fields)) {
        if (value > mostSelectedField.value) {
            mostSelectedField.name = name;
            mostSelectedField.value = value;
        }
    }

    return mostSelectedField.name;
}


function changeState(section, state) {
    if (section.classList.contains(state.old)) {
        section.classList.replace(state.old, state.new);
        return
    } 
    section.classList.add(state.new);
}


function clearData(formId) {
    
    const form = document.getElementById(formId);
    let inputs = Array.from(form.querySelectorAll('input'));

    let data = inputs.reduce((acc, e) => {

        const name = e.name
        const type = e.type;
        let value = e.value;
        
        
        if ((type === 'checkbox' || type === 'radio' ) && !e.checked) return acc;

        if(name in acc) {
            let previousValue = acc[name];

            if ( Array.isArray(previousValue) ) {
                acc[name].push(value);
            } else {
                acc[name] = [previousValue, value];
            }
            return acc
        }

        acc[name] = value;

        return acc

    }, {})

    return data;
}


function clearForms() {
    let forms = Array.from(document.forms);
    forms.forEach((form) => {
        let inputs = form.querySelectorAll('input');

        for (let i = 0; i < inputs.length; i++) {

            const value  = inputs[i].value,
            type = inputs[i].getAttribute('type');

            if (! (type === "checkbox" || type === "radio") ){
                inputs[i].value = '';
            }
            
            if (type === "checkbox" || type === "radio") {
                inputs[i].checked = false;
            }
        }
    })
}


function changeActionsValues(previousSection) {
    let backButton = document.querySelector('.actions__back');
    backButton.setAttribute("data-section", previousSection.id);
}


function validateData(element) {

    let inputs = Array.from(element.querySelectorAll('input:not(.option)'));
    let options = element.querySelectorAll('.options');

    if (options.length >  0) {
        for (let i = 0; i < options.length; i++) {
            if (!options[i].getAttribute('data-required')) continue;

            let inputGroup = options[i].querySelectorAll('.option');

            if (inputGroup.length < 1) continue;

            if (checkCheckboxOptions(inputGroup) === false) return false;
        }
        
    }

    if (inputs.length > 0) {
        for (let i = 0; i < inputs.length; i++) {
            
            let isValid =  true;

            const value  = inputs[i].value,
            isRequired = inputs[i].getAttribute('required'),
            pattern = inputs[i].getAttribute("pattern"),
            type = inputs[i].getAttribute('type');

            if(!isRequired) continue;

            if (! (type === "checkbox" || type === "radio") ){
                isValid = validateField(value, {isRequired, pattern});
            }
            
            if (type === "checkbox" || type === "radio") {
                isValid = (inputs[i].checked && isRequired); 
            }

            if (!isValid) return false
        }
    }
    return true;
}


function checkCheckboxOptions(inputGroup) { 
    let ret = false;
    inputGroup.forEach( (e) => {
        if ( e.checked ) ret = true;
    })
    return ret
}


function validateField(value, ...options) {

    let isValid = true;
    let pattern = options[0].pattern;
    let isRequired = options[0].isRequired;
    if (pattern) {

        pattern = pattern.slice(1, pattern.length - 2);

        let regxp = new RegExp(pattern);

        isValid = regxp.test(value)
    }

    if (isRequired && !value) isValid = false;

    return isValid;
}


function checkActionsVisibility(section) {
    try {
        if (!flowMap.get(flow).get(section.id)) {
            changeState(forward, {
                new: "actions__forward--inactive",
                old: "actions__forward--active"
            });
        } else {
            changeState(forward, {
                old: "actions__forward--inactive",
                new: "actions__forward--active"
            });
        }
    } catch (error) {
        changeState(forward, {
            new: "actions__forward--inactive",
            old: "actions__forward--active"
        });
    }
    

    if (sectionFlow.length < 1) {
        changeState(back, {
            new: "actions__back--inactive",
            old: "actions__back--active"
        });
    } else {
        changeState(back, {
            old: "actions__back--inactive",
            new: "actions__back--active"
        });
    }
}


function changeSubtitle(section, ...titles) {
    let title = section.getAttribute('data-title') || initialSubtitle;

    if (titles[0]) {
        title = titles[0]
    }

    document.querySelector('.header__subtitle').innerText = title;
}


/* Listeners */

document.getElementById('refazerTeste').addEventListener('click', () => {
    nextSection('artisticMovements')
});


flowChoice.forEach((element) => {
    element.addEventListener('click', (e) => {
        let id;

        let input = element.querySelector('.choice__input');

        if (element.classList.contains('flow-choice')){
            flow = input.value;
            step = input.value;
        } else {
            step = input.getAttribute('data-next-step-key')
        }
        id = flowMap.get(flow).get(step);
        nextSection(id);
    })
});


back.addEventListener('click', () => {
    if (sectionFlow.length < 1) return
    let lastSectionVisited = sectionFlow.pop();
    nextSection(lastSectionVisited, true);
});


forward.addEventListener('click', () => {

    let isValid = validateData(currentSection);

    if (!isValid) {
        forward.animate(keyframeShake,shakeTiming)
        return 
    };
    

    let nextSectionID = flowMap.get(flow).get(currentSection.id);

    if (nextSectionID) {
        nextSection(nextSectionID);
    }

    
});

/* Modals */

const modals = Array.from(document.querySelectorAll('.modal'));

modals.forEach((modal) => {
    const closeControl = modal.querySelector('.modal__control');
    
    closeControl.addEventListener('click', () => {
        const options = {
            old: 'active',
            new: 'inactive',
        };
        let iframe = modal.querySelector('iframe');
        document.querySelector('body').style.overflow = 'auto';
        if ( iframe ) {
            let url = iframe.src;
            iframe.src = url;
        }

        changeState(modal, options);
    })
});


const step__details = Array.from(document.querySelectorAll('.step__image'));
const videoPreviewModal = document.getElementById('step-video-preview');

let modalTitle = videoPreviewModal.querySelector('.title');
let modalDescription = videoPreviewModal.querySelector('.description');
let modalVideo = videoPreviewModal.querySelector('#video');
let modalEtapa = videoPreviewModal.querySelector('.etapa');

step__details.forEach((image) => {
    image.addEventListener('click', (e) => {
        let url = image.getAttribute('data-video-url');
        let title = image.getAttribute('data-video-title');
        let description = image.getAttribute('data-video-description');
        let etapa = image.getAttribute('data-etapa');
        
        modalVideo.src = url;
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modalEtapa.innerText = 'ETAPA ' + etapa; 

        const options = {
            new: 'active',
            old: 'inactive',
        };

        changeState(videoPreviewModal, options);
    });
});


let modal = document.querySelector('#imageModal');

Array.from(document.querySelectorAll('.gallery__block')).forEach(e => {
    console.log(e)
    e.addEventListener('click', () => {
        const options = {
            new: 'active',
            old: 'inactive',
        };
        changeState(modal, options);
        document.querySelector('body').style.overflow = 'hidden';
        let imageURL = e.querySelector('.gallery__photo').getAttribute('src');
        modal.querySelector('#image').setAttribute('src', imageURL);
    })
})
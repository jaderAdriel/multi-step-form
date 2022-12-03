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
], shakeTiming = {
    duration: 350,
    iterations: 1,
}

const options = document.querySelectorAll('.options .card.flow-choice');
const [back, forward] = document.querySelectorAll('.actions > button');


main()


options.forEach((element) => {
    element.addEventListener('click', (e) => {
        let nextSectionID = element.getAttribute('data-next-section');
        nextSection(nextSectionID);
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
    
    let nextSectionID = currentSection.getAttribute('data-next-section');

    if (nextSectionID) {
        nextSection(nextSectionID)
    }

    
})


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
    const current = document.getElementById(nextSectionID);
    currentSection = current;

    if (nextSectionID === 'initial') clearForms();

    changeTitle(currentSection);

    const [isComingBack] = props;
    if (! isComingBack === true) {
        sectionFlow.push(previous.id);
    }

    checkActionsVisibility( currentSection )
    
    changeState(previous, {
        new: "section--inactive",
        old: "section--active"
    });
    changeState(current, {
        old: "section--inactive",
        new: "section--active"
    });
    
    if (previous.getAttribute("data-submit") === "true") {
        const formId = '1'
        if( !validateData(document.getElementById(formId))) {
            alert("voce esqueceu de algum ")
            throw new Error('Ops!, vc esqueceu algum campo');
        }
        formData = clearData(formId);
        sendEmail(formData);
    }
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
    let inputs = Array.from(form.querySelectorAll('input:not(.option), .option:checked'));

    let data = inputs.reduce((acc, e) => {
        const name = e.getAttribute('name'),
        type = e.getAttribute('type');
        let value = e.getAttribute('value');
        
        const selectTypes = ['checkbox', 'radio'];

        if (selectTypes.includes(type)) value = true;

        if(acc[name]) {
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

    console.log(JSON.stringify(data))
    console.log(data)

    return inputs;
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
    if (!section.getAttribute('data-next-section')) {
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

function changeTitle(section) {
    let title = section.getAttribute('data-title') || initialSubtitle;
    document.querySelector('.header__subtitle').innerText = title;
}

// Grab Necessary Elements // grab/call elements should be at the top//
const careerCards = 
document.querySelectorAll('.career-card');
const filterButtons = 
document.querySelectorAll('.career-filters button');
const searchInput = 
document.getElementById('career-search');
const careerForm = 
document.getElementById('career-form');
const careerLibrarySection = 
document.getElementById('career-library');
const careerIdentitySection = 
document.getElementById('career-identity');

let currentFilter = 'All';

// Career Library/Cards Functionality//
function updateCards() {
    const query = searchInput.value.toLowerCase();

    careerCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const skillsText = card.querySelector('p:nth-of-type(2)').textContent.toLowerCase();
        const cluster = card.dataset.cluster;

        const matchesFilter = currentFilter === 'All' || cluster === currentFilter;
        const matchesSearch = title.includes(query) || skillsText.includes(query);

        card.style.display = matchesFilter && matchesSearch ? 'block' : 'none';

    });

}

/// EVENT LISTENERS ///
//Filter Buttons //
filterButtons.forEach(btn => {
    btn.addEventListener ('click', () => {
        currentFilter = btn.dataset.cluster;

        filterButtons.forEach(b => b.classList.remove('active'));
            
            btn.classList.add('active');

        updateCards();
    });

})

//Seach Input //
searchInput.addEventListener('input',() => {
    updateCards();
});

///Quiz Functionality///
//Also getting User Selections//
function getUserSelections() {
    //Study stream selector//
    const selectedStream = Array.from(
        document.querySelectorAll('#career-identity input[name="stream"]:checked')).map(cb => cb.value);

    //Interest Selection//
    const selectedInterests = Array.from(
        document.querySelectorAll('#career-identity input[name="interest"]:checked')).map(cb => cb.value);

    return { streams: selectedStream, interests: selectedInterests };
}

//filter careers based on user Selection//
function filterCareersByQuiz() {
    const selections = getUserSelections(); 
        let anyMatches = false;

    careerCards.forEach(card => {
        const cardStream = card.dataset.stream;
        const cardInterest = card.dataset.interest;

        const matches = (selections.streams.length === 0 || selections.streams.includes(cardStream)) &&

        (selections.interests.length === 0|| selections.interests.includes(cardInterest));

        card.style.display = matches ? 'block' : 'none'; if (matches) anyMatches = true;
    });

    // show first 3 careers if nothing matches//
    if (!anyMatches) {
        careerCards.forEach((card, index) =>{
            card.style.display = index < 3 ? 'block' : 'none';
        })
    }
}


//Quiz Submission/// Generate Career Path ///
careerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //this hides quiz, shows library//
    //const careerIdentitySection = document.getElementById('career-identity');//
    careerIdentitySection.classList.add('hidden');
    careerLibrarySection.classList.remove('hidden');

    //Get User Name//
    const userName = document.getElementById('name').value; 

    const libraryTitle = document.getElementById('career-library-title');

    libraryTitle.textContent = userName + "'s Career Options"; 
    const librarySubtitle = document.getElementById('career-library-subtitle'); 
    librarySubtitle.textContent = 'Based on your selections, these career paths suit you best.';

    //this resets the (search & filter)//
    searchInput.value = '';
    currentFilter = 'All';
    filterButtons.forEach(btn => btn.classList.remove('active'));

    filterButtons[0].classList.add('active');
    //filter careers based on quiz selections//
    filterCareersByQuiz();

    //smooth scroll from Generator to career library//
        careerLibrarySection.scrollIntoView({ behaviour: 'smooth'});
}); 

//Retake Quiz//
const retakeButton = 
document.createElement('button');
retakeButton.textContent = 'Retake Quiz';
retakeButton.classList.add('btn');
careerIdentitySection.appendChild(retakeButton);

retakeButton.addEventListener('click', () => {
careerLibrarySection.classList.add('hidden');
careerIdentitySection.classList.remove('hidden');
    careerForm.reset();

    careerCards.forEach(card =>
        card.style.display = 'block');

        currentFilter = 'All';
        filterButtons.forEach(btn => 
            btn.classList.remove('active'));

            filterButtons[0].classList.add('active');

            //clear Search input//
            searchInput.value = '';
    
});

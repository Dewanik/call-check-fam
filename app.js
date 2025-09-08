let people = JSON.parse(localStorage.getItem('people')) || [];
let selectedPerson = null;

const peopleList = document.getElementById('peopleList');
const addPersonForm = document.getElementById('addPersonForm');
const personNameInput = document.getElementById('personName');
const personPhoneInput = document.getElementById('personPhone');
const tabsContainer = document.getElementById('tabs');
const notesTextarea = document.getElementById('notes');
const saveNotesBtn = document.getElementById('saveNotes');

// Render people list
function renderPeople() {
    peopleList.innerHTML = '';
    tabsContainer.innerHTML = '';

    people.forEach((p, index) => {
        // People list for deletion/call
        const li = document.createElement('li');
        li.textContent = `${p.name} (${p.phone})`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deletePerson(index);
        li.appendChild(delBtn);
        peopleList.appendChild(li);

        // Tabs
        const tab = document.createElement('div');
        tab.textContent = p.name;
        tab.className = 'tab';
        tab.onclick = () => selectPerson(index);
        if (selectedPerson === index) tab.classList.add('active');
        tabsContainer.appendChild(tab);
    });
}

// Add person
addPersonForm.onsubmit = function(e) {
    e.preventDefault();
    people.push({name: personNameInput.value, phone: personPhoneInput.value, notes: ''});
    localStorage.setItem('people', JSON.stringify(people));
    personNameInput.value = '';
    personPhoneInput.value = '';
    renderPeople();
}

// Delete person
function deletePerson(index) {
    if (confirm(`Delete ${people[index].name}?`)) {
        people.splice(index, 1);
        localStorage.setItem('people', JSON.stringify(people));
        selectedPerson = null;
        renderPeople();
        notesTextarea.value = '';
    }
}

// Select person tab
function selectPerson(index) {
    selectedPerson = index;
    renderPeople();
    notesTextarea.value = people[index].notes || '';
}

// Save notes
saveNotesBtn.onclick = function() {
    if (selectedPerson === null) return alert('Select a person first.');
    people[selectedPerson].notes = notesTextarea.value;
    localStorage.setItem('people', JSON.stringify(people));
    alert('Notes saved!');
}

renderPeople();
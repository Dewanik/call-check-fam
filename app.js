let people = JSON.parse(localStorage.getItem('people')) || [];
let selectedPerson = null;
let checkStatus = JSON.parse(localStorage.getItem('checkStatus')) || {};

const peopleList = document.getElementById('peopleList');
const addPersonForm = document.getElementById('addPersonForm');
const personNameInput = document.getElementById('personName');
const personPhoneInput = document.getElementById('personPhone');
const tabsContainer = document.getElementById('tabs');
const notesTabsContainer = document.createElement('div');
notesTabsContainer.className = 'tabs';
const notesSection = document.getElementById('personNotes');
const notesTextarea = document.getElementById('notes');
const saveNotesBtn = document.getElementById('saveNotes');

// Add Reset Checkboxes button
let resetBtn = document.getElementById('resetCheckboxes');
if (!resetBtn) {
    resetBtn = document.createElement('button');
    resetBtn.id = 'resetCheckboxes';
    resetBtn.textContent = 'Reset Checkboxes';
    resetBtn.style.margin = '1rem';
    resetBtn.onclick = resetCheckboxes;
    notesSection.parentNode.insertBefore(resetBtn, notesSection);
}

// Render people list and checkboxes
function renderPeople() {
    peopleList.innerHTML = '';
    tabsContainer.innerHTML = '';
    notesTabsContainer.innerHTML = '';

    people.forEach((p, index) => {
        // People list for deletion/call and checkbox
        const li = document.createElement('li');
        li.textContent = `${p.name} (${p.phone})`;

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!checkStatus[p.phone];
        checkbox.style.marginRight = '0.5rem';
        checkbox.onchange = () => {
            checkStatus[p.phone] = checkbox.checked;
            localStorage.setItem('checkStatus', JSON.stringify(checkStatus));
        };
        li.prepend(checkbox);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deletePerson(index);
        li.appendChild(delBtn);
        peopleList.appendChild(li);

        // Main tabs for selecting person
        const tab = document.createElement('div');
        tab.textContent = p.name;
        tab.className = 'tab';
        tab.onclick = () => selectPerson(index);
        if (selectedPerson === index) tab.classList.add('active');
        tabsContainer.appendChild(tab);

        // Notes tabs
        const notesTab = document.createElement('div');
        notesTab.textContent = p.name;
        notesTab.className = 'tab';
        notesTab.onclick = () => selectNotesTab(index);
        if (selectedPerson === index) notesTab.classList.add('active');
        notesTabsContainer.appendChild(notesTab);
    });

    // Insert notes tabs above notes section if not already present
    if (!notesSection.previousSibling || notesSection.previousSibling !== notesTabsContainer) {
        notesSection.parentNode.insertBefore(notesTabsContainer, notesSection);
    }
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
        // Remove checkbox status
        delete checkStatus[people[index].phone];
        people.splice(index, 1);
        localStorage.setItem('people', JSON.stringify(people));
        localStorage.setItem('checkStatus', JSON.stringify(checkStatus));
        selectedPerson = null;
        renderPeople();
        notesTextarea.value = '';
    }
}

// Select person tab (for main actions)
function selectPerson(index) {
    selectedPerson = index;
    renderPeople();
    notesTextarea.value = people[index].notes || '';
}

// Select notes tab (for notes only)
function selectNotesTab(index) {
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

// Reset all checkboxes
function resetCheckboxes() {
    people.forEach(p => {
        checkStatus[p.phone] = false;
    });
    localStorage.setItem('checkStatus', JSON.stringify(checkStatus));
    renderPeople();
}

renderPeople();
let people = JSON.parse(localStorage.getItem('people')) || [];
let selectedPerson = people.length > 0 ? 0 : null;
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

// --- Add Share Notes button ---
let shareBtn = document.getElementById('shareNotes');
if (!shareBtn) {
    shareBtn = document.createElement('button');
    shareBtn.id = 'shareNotes';
    shareBtn.textContent = 'Share Notes';
    shareBtn.style.marginLeft = '0.5rem';
    saveNotesBtn.parentNode.insertBefore(shareBtn, saveNotesBtn.nextSibling);
}
shareBtn.onclick = function () {
    if (selectedPerson === null || !people[selectedPerson]) {
        alert('Select a person first.');
        return;
    }
    const person = people[selectedPerson];
    const title = `Wellness Check Note`;
    const noteText = `Note to ${person.name}:\n${person.notes || ''}`;
    const shareText = `${title}\n\n${noteText}`;
    if (navigator.share) {
        navigator.share({
            title: title,
            text: shareText
        }).catch(() => {});
    } else {
        // Fallback: copy to clipboard and instruct user
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Note copied! You can now paste it in Messenger, Instagram, or Notes app.');
        });
    }
};

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

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!checkStatus[p.phone];
        checkbox.style.marginRight = '0.5rem';
        checkbox.onchange = () => {
            checkStatus[p.phone] = checkbox.checked;
            localStorage.setItem('checkStatus', JSON.stringify(checkStatus));
        };

        // Label for checkbox
        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${p.name} (${p.phone})`));
        li.appendChild(label);

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

    // Show notes for selected person
    if (selectedPerson !== null && people[selectedPerson]) {
        notesTextarea.value = people[selectedPerson].notes || '';
        notesTextarea.disabled = false;
        saveNotesBtn.disabled = false;
        shareBtn.disabled = false;
    } else {
        notesTextarea.value = '';
        notesTextarea.disabled = true;
        saveNotesBtn.disabled = true;
        shareBtn.disabled = true;
    }
}

// Add person
addPersonForm.onsubmit = function(e) {
    e.preventDefault();
    people.push({name: personNameInput.value, phone: personPhoneInput.value, notes: ''});
    localStorage.setItem('people', JSON.stringify(people));
    personNameInput.value = '';
    personPhoneInput.value = '';
    if (selectedPerson === null) selectedPerson = 0;
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
        if (people.length === 0) {
            selectedPerson = null;
        } else if (selectedPerson >= people.length) {
            selectedPerson = people.length - 1;
        }
        renderPeople();
    }
}

// Select person tab (for main actions)
function selectPerson(index) {
    selectedPerson = index;
    renderPeople();
}

// Select notes tab (for notes only)
function selectNotesTab(index) {
    selectedPerson = index;
    renderPeople();
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
class Guitar {
    constructor() {
        this.initializeSounds();
        this.currentSoundType = 'acoustic';
        // Reference frequency for A4 note
        this.A4 = 440;
        this.tunerMode = false;
        this.activeNotes = new Set(); // Track currently playing notes
        this.tunerInterval = null; // For tuner mode repetition
        this.tunings = {
            standard: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
            dropD: ['E4', 'B3', 'G3', 'D3', 'A2', 'D2'],
            openG: ['D4', 'B3', 'G3', 'D3', 'G2', 'D2'],
            openD: ['D4', 'A3', 'F#3', 'D3', 'A2', 'D2'],
            openE: ['E4', 'B3', 'G#3', 'E3', 'B2', 'E2'],
            DADGAD: ['D4', 'A3', 'G3', 'D3', 'A2', 'D2'],
            halfStepDown: ['D#4', 'A#3', 'F#3', 'C#3', 'G#2', 'D#2'],
            wholeStepDown: ['D4', 'A3', 'F3', 'C3', 'G2', 'D2'],
            dropC: ['E4', 'B3', 'G3', 'D3', 'A2', 'C2']
        };
        this.currentTuning = 'standard';
        this.scales = {
            major: [0, 2, 4, 5, 7, 9, 11],
            minor: [0, 2, 3, 5, 7, 8, 10],
            harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
            melodicMinor: [0, 2, 3, 5, 7, 9, 11],
            dorianMode: [0, 2, 3, 5, 7, 9, 10],
            phrygianMode: [0, 1, 3, 5, 7, 8, 10],
            lydianMode: [0, 2, 4, 6, 7, 9, 11],
            mixolydianMode: [0, 2, 4, 5, 7, 9, 10],
            locrianMode: [0, 1, 3, 5, 6, 8, 10],
            pentatonicMajor: [0, 2, 4, 7, 9],
            pentatonicMinor: [0, 3, 5, 7, 10],
            blues: [0, 3, 5, 6, 7, 10],
            wholeTone: [0, 2, 4, 6, 8, 10],
            diminished: [0, 2, 3, 5, 6, 8, 9, 11],
            augmented: [0, 3, 4, 7, 8, 11],
            chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };
        this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // Scale degree information for tooltips
        this.scaleDegreesInfo = {
            0: { name: 'Root', shortName: 'R', color: '#FF0000' },  // Red
            1: { name: 'Minor Second', shortName: 'm2', color: '#E3B6B6' },
            2: { name: 'Major Second', shortName: 'M2', color: '#E3D4B6' },
            3: { name: 'Minor Third', shortName: 'm3', color: '#4CAF50' },  // Green
            4: { name: 'Major Third', shortName: 'M3', color: '#4CAF50' },  // Green
            5: { name: 'Perfect Fourth', shortName: 'P4', color: '#B6E3D4' },
            6: { name: 'Diminished Fifth', shortName: '♭5', color: '#B6C7E3' },
            7: { name: 'Perfect Fifth', shortName: 'P5', color: '#0000FF' },  // Blue
            8: { name: 'Augmented Fifth', shortName: '#5', color: '#B6B6E3' },
            9: { name: 'Major Sixth', shortName: 'M6', color: '#D4B6E3' },
            10: { name: 'Minor Seventh', shortName: 'm7', color: '#E3B6D4' },
            11: { name: 'Major Seventh', shortName: 'M7', color: '#E3B6C7' },
            12: { name: 'Octave', shortName: 'O', color: '#800080' }  // Purple
        };
        this.selectedNotes = new Set();
        this.mode = 'scale';
        this.currentScale = 'major';
        this.rootNote = 'C';

        this.initializeGuitarNeck();
        this.setupEventListeners();
    }

    initializeGuitarNeck() {
        const guitarNeck = document.getElementById('guitar-neck');
        guitarNeck.innerHTML = '<div class="guitar-neck-inner"></div>';
        const guitarNeckInner = guitarNeck.querySelector('.guitar-neck-inner');

        this.tunings[this.currentTuning].forEach((stringNote, stringIndex) => {
            const string = document.createElement('div');
            string.className = 'string';
            
            // Get the base note and octave for this string
            const baseNote = stringNote.replace(/\d/, '');
            const baseOctave = parseInt(stringNote.match(/\d/)[0]);
            const startNoteIndex = this.notes.indexOf(baseNote);
            
            // Create 13 positions (0 through 12) for each string
            for (let fret = 0; fret <= 12; fret++) {
                // Calculate the actual note index and octave
                let noteIndex = (startNoteIndex + fret) % 12;
                let octaveShift = Math.floor((startNoteIndex + fret) / 12);
                let currentOctave = baseOctave + octaveShift;
                
                const note = document.createElement('div');
                note.className = 'note';
                note.dataset.note = this.notes[noteIndex];
                note.dataset.string = stringIndex + 1;
                note.dataset.fret = fret;
                note.dataset.octave = currentOctave;
                note.textContent = this.notes[noteIndex];

                // Add fret number on the first string
                if (stringIndex === 0) {
                    const fretNumber = document.createElement('div');
                    fretNumber.className = 'fret-number';
                    fretNumber.textContent = fret;
                    note.appendChild(fretNumber);
                }

                // Add fret markers on traditional positions (3,5,7,9,12)
                if (stringIndex === 2 && [3,5,7,9,12].includes(fret)) {
                    const markerContainer = document.createElement('div');
                    markerContainer.className = 'fret-marker-container';
                    
                    // Calculate position based on fret number
                    const fretSpacing = 36*3;  // Horizontal Space between fret 3,5,6,9,1
                    const noteOffset = 19*19.8;   // Horizontal Distance from left edge to 3rd fret
                    const stringSpacing = 25; // Verticle Space between strings
                    const verticalOffset = stringSpacing;
                    
                    markerContainer.style.left = `${(fretSpacing * (fret-3)) + noteOffset}px`;
                    markerContainer.style.top = `${verticalOffset}px`;
                    
                    const marker = document.createElement('div');
                    marker.className = 'fret-marker';
                    
                    marker.style.width = '14px';
                    marker.style.height = '14px';
                    marker.style.borderRadius = '10px';

                    if (fret === 12) {
                        marker.style.width = '30px';
                        marker.style.height = '14px';
                        marker.style.borderRadius = '10px';
                    }
                    
                    markerContainer.appendChild(marker);
                    string.appendChild(markerContainer);
                }

                string.appendChild(note);
            }
            
            guitarNeckInner.appendChild(string);
        });
    }

    initializeSounds() {
        // Acoustic guitar-like sound
        this.acousticSynth = new Tone.PluckSynth({
            attackNoise: 2,
            dampening: 2000,
            resonance: 0.95,
            release: 1.5,
            sustain: 0.9
        }).toDestination();

        // Simple tone synth
        this.toneSynth = new Tone.Synth({
            oscillator: {
                type: "triangle"
            },
            envelope: {
                attack: 0.005,
                decay: 0.3,
                sustain: 0.4,
                release: 2
            }
        }).toDestination();

        // Electric guitar-like sound
        this.electricSynth = new Tone.AMSynth({
            harmonicity: 3.999,
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.01,
                decay: 0.5,
                sustain: 0.8,
                release: 1.5
            },
            modulation: {
                type: "square"
            }
        }).toDestination();

        // Piano-like sound using local samples
        this.pianoSynth = new Tone.Sampler({
            urls: {
                "A2": "piano-tones/A2.mp3",
                "A3": "piano-tones/A3.mp3",
                "A4": "piano-tones/A4.mp3",
                "C3": "piano-tones/C3.mp3",
                "C4": "piano-tones/C4.mp3",
                "C5": "piano-tones/C5.mp3"
            },
            baseUrl: "/static/"
        }).toDestination();
    }

    setupEventListeners() {
        document.getElementById('tuning').addEventListener('change', (e) => {
            this.currentTuning = e.target.value;
            this.initializeGuitarNeck();
            this.updateScaleNotes();
        });

        document.getElementById('soundType').addEventListener('change', (e) => {
            this.currentSoundType = e.target.value;
        });

        document.getElementById('scale').addEventListener('change', (e) => {
            this.currentScale = e.target.value;
            this.updateScaleNotes();
        });

        document.getElementById('scaleMode').addEventListener('click', () => this.setMode('scale'));
        document.getElementById('findMode').addEventListener('click', () => this.setMode('find'));
        
        document.getElementById('tunerMode').addEventListener('change', (e) => {
            this.tunerMode = e.target.checked;
            this.stopAllNotes(); // Stop any playing notes when switching modes
        });

        document.getElementById('guitar-neck').addEventListener('click', (e) => {
            if (e.target.classList.contains('note')) {
                this.handleNoteClick(e.target);
            } else {
                this.stopAllNotes();
            }
        });

        // Stop all notes when clicking empty space on the page
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#guitar-neck') && 
                !e.target.closest('.controls')) {
                this.stopAllNotes();
            }
        });
    }

    setMode(newMode) {
        this.mode = newMode;
        this.selectedNotes.clear();
        document.getElementById('scaleMode').classList.toggle('active', newMode === 'scale');
        document.getElementById('findMode').classList.toggle('active', newMode === 'find');
        this.updateScaleNotes();
    }

    handleNoteClick(noteElement) {
        const note = noteElement.dataset.note;
        const stringNum = noteElement.dataset.string;
        const fret = noteElement.dataset.fret;
        
        // Clear active state from all notes of the same pitch on this string
        document.querySelectorAll(`.note[data-string="${stringNum}"][data-note="${note}"]`)
            .forEach(n => n.classList.remove('active'));
        
        // Set active state on the clicked note
        noteElement.classList.add('active');
        
        // Play the note with correct string number and pass the clicked element
        this.playNote(note, stringNum, noteElement);

        if (this.mode === 'scale') {
            this.rootNote = note;
            this.updateScaleNotes();
        } else {
            // Find scale mode
            if (this.selectedNotes.has(note)) {
                this.selectedNotes.delete(note);
                noteElement.classList.remove('active');
            } else {
                this.selectedNotes.add(note);
                noteElement.classList.add('active');
            }
            this.findMatchingScales();
        }

        // Update info panel
        document.getElementById('selected-notes').textContent = 
            `String ${stringNum}, Fret ${fret}: ${note}`;
    }

    getScaleDegree(noteIndex, rootIndex) {
        let degree = (noteIndex - rootIndex + 12) % 12;
        return this.scaleDegreesInfo[degree];
    }

    updateScaleNotes() {
        // Clear all notes
        document.querySelectorAll('.note').forEach(note => {
            note.classList.remove('active', 'root');
            note.style.backgroundColor = '';
            note.style.color = '';
            
            // Remove any existing tooltips
            const tooltip = note.querySelector('.note-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });

        if (this.mode === 'scale') {
            const scalePattern = this.scales[this.currentScale];
            const rootIndex = this.notes.indexOf(this.rootNote);
            
            const scaleNotes = scalePattern.map(interval => 
                this.notes[(rootIndex + interval) % 12]
            );

            document.querySelectorAll('.note').forEach(noteElement => {
                const noteIndex = this.notes.indexOf(noteElement.dataset.note);
                if (scaleNotes.includes(noteElement.dataset.note)) {
                    noteElement.classList.add('active');
                    
                    // Get scale degree information
                    const scaleDegree = this.getScaleDegree(noteIndex, rootIndex);
                    
                    // Apply color based on scale degree
                    noteElement.style.backgroundColor = scaleDegree.color;
                    noteElement.style.color = 'white';
                    
                    // Add tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'note-tooltip';
                    tooltip.textContent = `${noteElement.dataset.note} - ${scaleDegree.name} (${scaleDegree.shortName})`;
                    noteElement.appendChild(tooltip);
                    
                    // Mark root notes
                    if (noteElement.dataset.note === this.rootNote) {
                        noteElement.classList.add('root');
                    }
                }
            });

            document.getElementById('scale-info').textContent = 
                `${this.rootNote} ${this.currentScale} scale: ${scaleNotes.join(', ')}`;
        }
    }

    findMatchingScales() {
        if (this.selectedNotes.size < 3) return;

        const selectedNotesArray = Array.from(this.selectedNotes);
        const matchingScales = [];

        console.log("Selected notes for Matching Scales:", this.notes)

        for (let rootNote of this.notes) {
            for (let [scaleName, scalePattern] of Object.entries(this.scales)) {
                const scaleNotes = scalePattern.map(interval => 
                    this.notes[(this.notes.indexOf(rootNote) + interval) % 12]
                );

                if (selectedNotesArray.every(note => scaleNotes.includes(note))) {
                    matchingScales.push(`${rootNote} ${scaleName}`);
                }
            }
        }

        document.getElementById('scale-info').textContent = 
            matchingScales.length > 0 
                ? `Matching scales: ${matchingScales.join(', ')}` 
                : 'No matching scales found';
    }

    getNoteFrequency(note, octave) {
        // Calculate frequency based on equal temperament
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = notes.indexOf(note);
        const A4Index = notes.indexOf('A');
        
        // Calculate number of semitones from A4 (440 Hz)
        const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - A4Index);
        
        // Calculate frequency using the formula: f = 440 * (2^(n/12))
        // where n is the number of semitones from A4 (440 Hz)
        const frequency = 440 * Math.pow(2, semitonesFromA4 / 12);

        // Log frequency info for debugging
        console.log(`Note: ${note}${octave}`);
        console.log(`Semitones from A4: ${semitonesFromA4}`);
        console.log(`Calculated frequency: ${frequency.toFixed(2)} Hz`);

        return frequency;
    }

    stopAllNotes() {
        // Clear tuner interval if it exists
        if (this.tunerInterval) {
            clearInterval(this.tunerInterval);
            this.tunerInterval = null;
        }

        // Stop all active notes
        this.activeNotes.forEach(noteInfo => {
            const { synth, note } = noteInfo;
            synth.triggerRelease();
        });
        this.activeNotes.clear();
    }

    async playNoteInTunerMode(synth, note, frequency) {
        let count = 0;
        const playNote = () => {
            if (count < 5) {  // Changed to 5 repetitions
                // Use '1n' for longer sustain (whole note)
                synth.triggerAttackRelease(note, '1n');
                count++;
            } else {
                clearInterval(this.tunerInterval);
                this.tunerInterval = null;
            }
        };

        // Initial play
        playNote();
        // Set up interval for repeated playing
        this.tunerInterval = setInterval(() => {
            playNote();
        }, 2500); // 2.5 seconds total (longer note, shorter pause)
    }

    async playNote(note, stringNum, clickedElement) {
        await Tone.start();
        this.currentString = parseInt(stringNum);
        
        // Stop previous notes if in tuner mode
        if (this.tunerMode) {
            this.stopAllNotes();
        }
        
        // Use the actual clicked element instead of searching
        this.currentFret = parseInt(clickedElement.dataset.fret);
        const currentOctave = parseInt(clickedElement.dataset.octave);
        
        console.log(`Playing string ${stringNum}, fret ${this.currentFret}, note ${note}, octave ${currentOctave}`);
        const frequency = this.getNoteFrequency(note, currentOctave);
        
        // Update frequency display
        document.getElementById('frequency-info').textContent = 
            `Frequency: ${frequency.toFixed(2)} Hz`;

        let synth;
        let noteValue;

        switch (this.currentSoundType) {
            case 'acoustic':
                synth = this.acousticSynth;
                noteValue = frequency;
                break;
            case 'electric':
                synth = this.electricSynth;
                noteValue = frequency;
                break;
            case 'tone':
                synth = this.toneSynth;
                noteValue = frequency;
                break;
            case 'piano':
                synth = this.pianoSynth;
                noteValue = note + currentOctave;
                break;
        }

        if (this.tunerMode) {
            this.playNoteInTunerMode(synth, noteValue, frequency);
        } else {
            synth.triggerAttackRelease(noteValue, '2n');
            this.activeNotes.add({ synth, note: noteValue });
        }
    }
}

// Initialize the guitar when the page loads
window.addEventListener('load', () => {
    new Guitar();
});
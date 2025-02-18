# SKGuitar - Interactive Guitar Scale Explorer (v0.2.12)

SKGuitar is a web application that provides an interactive guitar fretboard for exploring scales, notes, and musical theory. It features a virtual guitar neck where you can click on notes, hear them played, and explore different scales and tunings.

## Features

### Core Features
- Interactive guitar fretboard visualization with fret markers and numbers
- Real-time audio playback with accurate frequencies
- Multiple sound options:
  - Acoustic Guitar (plucked string simulation)
  - Electric Guitar (amplified tone)
  - Simple Tone (pure synthesizer)
  - Piano (sampled sounds)
- Tuner Mode:
  - Toggle for tuning assistance
  - Repeats note 5 times with sustained notes and brief pauses
  - Auto-stops when playing new note
  - Helps with precise tuning
- Note Playing Modes:
  - Normal Mode: Notes stack and continue playing
  - Tuner Mode: Single note repeats for tuning
  - Click empty space to stop all notes

### Musical Features
- Advanced Scale Visualization:
  - Color-coded scale degrees
  - Root notes highlighted in red
  - Thirds in green
  - Perfect fifths in blue
  - Octaves in purple
  - Hover tooltips showing:
    - Note name
    - Scale degree (e.g., Major Third, Perfect Fifth)
    - Musical notation (e.g., M3, P5)
- Comprehensive Scale Library:
  - Common Scales:
    - Major Scale
    - Natural Minor Scale
    - Harmonic Minor Scale
    - Melodic Minor Scale
    - Major Pentatonic
    - Minor Pentatonic
    - Blues Scale
  - Modes:
    - Dorian Mode
    - Phrygian Mode
    - Lydian Mode
    - Mixolydian Mode
    - Locrian Mode
  - Advanced Scales:
    - Whole Tone Scale
    - Diminished Scale
    - Augmented Scale
    - Chromatic Scale
- Multiple tuning options:
  - Standard Tuning (EADGBE)
  - Drop D Tuning (DADGBE)
  - Open G Tuning (DGDGBD)
  - Open D Tuning (DADF#AD)
  - Open E Tuning (EBE♯GBE)
  - DADGAD Tuning
  - Half Step Down (E♭A♭D♭G♭B♭E♭)
  - Whole Step Down (DGCFAD)
  - Drop C Tuning (CGCFAD)
- Two operation modes:
  - Scale Mode: Select a root note and scale to see all notes in that scale
  - Find Scale Mode: Select multiple notes to find matching scales

### Technical Details
- Accurate frequency calculations using equal temperament
- Base frequencies (open strings):
  - String 1 (High E): 329.63 Hz (E4)
  - String 2 (B): 246.94 Hz (B3)
  - String 3 (G): 196.00 Hz (G3)
  - String 4 (D): 146.83 Hz (D3)
  - String 5 (A): 110.00 Hz (A2)
  - String 6 (Low E): 82.41 Hz (E2)
- Each fret increases frequency by a factor of 2^(1/12)
- 12th fret is exactly double the frequency of the open string
- Real-time frequency display in Hz

## Running the Application

### Quick Start (Recommended)
Use the deployment script which handles everything automatically:
```bash
./deploy.sh
```
The script will:
1. Stop any running instances
2. Rebuild the Docker image
3. Find an available port (starting from 8000)
4. Start the application
5. Show you the URL where it's running

### Manual Development

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Flask application:
   ```bash
   python app.py
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Manual Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t skguitar .
   ```

2. Run the container:
   ```bash
   docker run --rm -p 8000:8000 skguitar
   ```

## Usage

1. Select your preferred tuning from the dropdown menu
2. Choose your preferred sound type:
   - Acoustic Guitar: Realistic plucked string simulation
   - Electric Guitar: Amplified tone with sustain
   - Simple Tone: Pure synthesizer sound
   - Piano: Sampled piano sounds

3. Choose between Scale Mode and Find Scale Mode:
   - Scale Mode: Click any note to see the complete scale starting from that note
   - Find Scale Mode: Click multiple notes to find scales that contain those notes

4. Click on any note on the fretboard to:
   - Hear the note played with accurate frequency
   - See the string number and note name
   - View the exact frequency in Hz
   - View scale information (depending on the selected mode)

5. Use fret markers and numbers to navigate:
   - Numbers (0-12) show fret positions
   - Traditional dot markers at frets 3,5,7,9,12
   - Double marker at the 12th fret

## Technical Notes

### Frequency Calculation
- Uses equal temperament tuning
- Each fret represents one semitone (frequency ratio of 2^(1/12))
- 12th fret is exactly one octave higher (2x frequency) than open string
- Frequencies are calculated using the formula: f = f0 * 2^(n/12)
  where f0 is the open string frequency and n is the fret number

### Sound Generation
- Uses Web Audio API via Tone.js
- Different synthesis methods for each sound type:
  - Acoustic: PluckSynth with optimized parameters
  - Electric: AMSynth with sustain
  - Tone: Basic synthesizer
  - Piano: Sampler with real piano samples

## TODO List 

This is a list of maybes.

- [x] Add more tuning options (Open G, Open D, etc.)
- [ ] Implement chord recognition and display
- [ ] Add MIDI support for external instruments
- [ ] Include a metronome feature
- [ ] Add scale practice exercises
- [ ] Implement save/load functionality for custom scales
- [ ] Include a chord progression builder
- [ ] Add support for left-handed guitar layout
- [ ] Implement mobile-responsive design improvements
- [ ] Add harmonic visualization
- [ ] Include string bending simulation
- [ ] Add audio recording functionality

## Changelog

### v0.2.12
- Further adjusted fret marker positions:
  - Fixed horizontal spacing
  - Increased vertical offset to 300% of string spacing
  - Made markers 20% more transparent (opacity 0.64)
  - Improved visual balance with strings and notes

### v0.2.10
- Adjusted fret marker vertical position:
  - Increased vertical offset to 150% of string spacing
  - Improved visual balance between strings and markers
  - Better spacing between markers and notes

### v0.2.9
- Fixed fret marker positions:
  - Correctly placed at 3rd, 5th, 7th, 9th, and 12th frets
  - Moved markers 50% between strings vertically
  - Improved spacing and alignment calculations
  - Fixed double-dot marker at 12th fret

### v0.2.8
- Fixed fret marker positions:
  - Correctly placed at 3rd, 5th, 7th, 9th, and 12th frets
  - Improved spacing calculation
  - Better centering between frets
  - Fixed double-dot marker at 12th fret

### v0.2.7
- Fixed fret marker positioning:
  - Markers now correctly appear on the fretboard
  - Improved vertical alignment
  - Better integration with guitar neck layout
  - Fixed marker container positioning

### v0.2.6
- Fixed visual bugs:
  - Fret markers now stay in place when hovering/selecting notes
  - Eliminated horizontal movement when selecting notes
  - Made unselected notes same size as selected notes (32px)
  - Added pointer-events: none to fret markers

### v0.2.5
- Further refined note visualization:
  - Inactive notes now use mathematically precise square size (sqrt(2) * radius)
  - Increased transparency by additional 20%
  - Moved fret markers up by 40% for better spacing
  - Improved overall visual balance

### v0.2.4
- Further refined visual appearance:
  - Increased transparency of inactive notes by 20%
  - Moved fret markers up by 40% for better visual balance
  - Improved overall visual hierarchy

### v0.2.3
- Optimized note visualization geometry:
  - Inactive note squares now sized using sqrt(2) * radius formula
  - Perfect geometric relationship between active circles and inactive squares
  - Mathematically precise centering and spacing
  - Improved visual harmony in the layout

### v0.2.2
- Improved note visualization:
  - Unselected notes now appear as small squares
  - Increased transparency for inactive notes
  - Active notes remain as circles with bold text
  - Better contrast between active and inactive states
  - Smoother transition animations
  - More compact layout for inactive notes

### v0.2.1
- Improved note visualization:
  - White borders for unselected/non-scale notes
  - Thicker black borders for selected/scale notes
  - Better visual distinction between active and inactive notes
- Added extensive scale library:
  - Added Harmonic and Melodic Minor scales
  - Added all major modes (Dorian, Phrygian, etc.)
  - Added advanced scales (Whole Tone, Diminished, etc.)
  - Organized scales into logical groups
  - Added tooltips for all new scales

### v0.2.0
- Added advanced scale degree visualization:
  - Color-coded notes based on scale degree
  - Root notes highlighted in red
  - Important intervals (thirds, fifths, octaves) in distinct colors
  - Hover tooltips showing note function in the scale
  - Complete scale degree information with musical notation
  - Enhanced visual hierarchy for important scale tones

### v0.1.5
- Improved tuner mode timing:
  - Increased to 5 repetitions (from 4)
  - Longer sustain on notes
  - Shorter pauses between notes (2.5s cycle)
  - Better overall timing for tuning

### v0.1.4
- Added tuner mode functionality
- Added note stacking in normal mode
- Added click-to-stop-all feature
- Improved note handling

### v0.1.3
- Added multiple tuning options:
  - Open G, Open D, Open E
  - DADGAD
  - Half Step Down
  - Whole Step Down
  - Drop C

### v0.1.2
- Fixed 12th fret frequency calculation
- Added local piano samples
- Improved octave handling

### v0.1.1
- Initial release with basic functionality
- Added fretboard visualization
- Added scale display
- Added basic sound options

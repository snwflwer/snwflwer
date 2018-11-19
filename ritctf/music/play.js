function play(DURATION_SCALE, RETRIGGER_ON_SUBDIVISION) {
    var synth = new Tone.PolySynth(4, Tone.Synth).toMaster();

    function f(t) {
        let hex_array = [0xd2d2c7, 0xce4087, 0xca32c7, 0x8e4008];
        let hex_array_index = t >> 14 & 3.1;
        let test = (t >> 10 & 15) > 9;
        let note_index = hex_array[hex_array_index] >> (0x3dbe4687 >> (test ? 18 : t >> 10 & 15) * 3 & 7.1) * 3 & 7.1;
        let notes = ["G4","A4","B4","C5","D5","E5", null];
        let note = notes[note_index];
        return note;
    }

    let note_display = document.querySelector("p");
    note_display.innerHTML = "";
    function add_note(start_time, note, duration) {
        let note_el = document.createElement("div");
        note_el.classList.add("note");
        if (!note) {
            note_el.classList.add("rest");
        }
        note_el.textContent = note || "-";
        note_el.style.width = `${duration / 256}em`;
        let duration_s = DURATION_SCALE * duration / 1000.0;
        window.setTimeout(() => {
            note_display.appendChild(note_el); 
            if (note) {
                synth.triggerAttackRelease(note, duration_s);
            }
        }, DURATION_SCALE * start_time);
    }

    let repeat_count = 0;
    let prev_note = null;
    let note_index = 0;

    for (let t = 0; t < 2**18; t++) {
        let note = f(t);
        if (note != prev_note || (repeat_count >= 1024 && RETRIGGER_ON_SUBDIVISION)) {
            add_note(t - repeat_count, prev_note, repeat_count);
            repeat_count = 0;
            prev_note = note;
        } else if (note == prev_note) {
            repeat_count++;
        }
    }
};

window.addEventListener("load", () => {
    document.querySelector("#p").onclick = () => {
        let mult = parseFloat(document.querySelector("#r").value);
        let retrigger = document.querySelector("#t").checked; 
        play(mult, retrigger);
    }
});


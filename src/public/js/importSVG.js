const link = document.querySelector('link[rel="import"]');
const s = new XMLSerializer();
// Clone the <template> in the import.
const svg = link.import.querySelector('svg');
    console.log(svg);

document.getElementsByClassName('content')[0].innerHTML =  s.serializeToString(svg);

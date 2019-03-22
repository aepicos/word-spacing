import sketch from 'sketch';

export default function() {
  const doc = sketch.getSelectedDocument();
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;

  if (selectedCount == 0) {

    sketch.UI.message('Please select a layer.');

  } else {

    let wordSpacing = sketch.UI.getStringFromUser('Word spacing in px', 4);

    wordSpacing = parseInt(wordSpacing.trim());

    let selection = context.selection;

    for ( var i = 0; i < selectedCount; i++ ) {
      let layer = selection[i];
      let layerType = layer.class();

      if ( layerType == 'MSTextLayer' ) {

        sketch.UI.message(`kerning: ${selectedLayers.layers[0].style.kerning}`);

        let textValue = layer.stringValue();

        var ranges = getRanges(textValue, ' ');

        if (ranges.length < 1) {
          sketch.UI.message('Error: No matching text found 😢');
          return false;
        }

        layer.setIsEditingText(true);
        for (let idx = 0; idx < ranges.length; idx++) {
          layer.addAttribute_value_forRange_(NSKernAttributeName, wordSpacing, ranges[idx]);
        }
        layer.setIsEditingText(false);
      }
    }
  }
}

function getRanges(str, query) {
  const len = query.length;
  const ranges = [];
  let idx = 0;
  let lastIdx = 0;

  while (str.indexOf(query, lastIdx) > -1) {
    idx = str.indexOf(query, lastIdx);
    ranges.push(NSMakeRange(idx, len));
    lastIdx = idx + len;
  }

  return ranges;
}

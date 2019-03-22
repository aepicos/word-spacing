import sketch from 'sketch';

export default function() {
  const doc = sketch.getSelectedDocument();
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;

  if (selectedCount == 0) {

    sketch.UI.message('Please select a layer.');

  } else {

    let wordSpacing = sketch.UI.getStringFromUser('Word spacing in px (e.g. 1 or 0.1)', 0);

    if (isNaN(parseInt(wordSpacing.trim()))) {

      sketch.UI.alert('Bad designer', 'You didn\'t write a number');

    } else {

      wordSpacing = parseInt(wordSpacing.trim());

      let selection = context.selection;

      for ( var i = 0; i < selectedCount; i++ ) {
        let layer = selection[i];
        let layerType = layer.class();

        if ( layerType == 'MSTextLayer' ) {

          let textValue = layer.stringValue();

          var ranges = getRanges(textValue, ' ');

          layer.setIsEditingText(true);
          for (let idx = 0; idx < ranges.length; idx++) {
            layer.addAttribute_value_forRange_(NSKernAttributeName, wordSpacing, ranges[idx]);
          }
          layer.setIsEditingText(false);

          sketch.UI.message(`🚀 Word spacing set to ${wordSpacing}px`);
        }
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

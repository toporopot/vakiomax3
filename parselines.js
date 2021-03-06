if (typeof module !== 'undefined' && module.exports) {
  var fs = require('fs'), _ = require('lodash')

  if (require.main === module) {
    if (process.argv.length < 4) {
      console.error('Usage ' + process.argv[1] + ' filename drawId')
      process.exit(1)
    }
    var filename = process.argv[2]
    var drawId = process.argv[3]
    console.log(JSON.stringify(couponRowsToWagerRequests(fs.readFileSync(filename, 'utf8'), drawId, 25), null, 2))
  }

  exports.couponRowsToWagerRequests = couponRowsToWagerRequests
}
else {
  window.couponRowsToWagerRequests = couponRowsToWagerRequests
}
function couponRowsToWagerRequests(rowsString, drawId, stake) {
  var splitRows = _(rowsString.split(/[\r\n]/))
  var allSportWagerRequestObjs = splitRows
    .filter(notEmpty)
    .map(cleanUpRowString)
    .map(rowToOutcomes)
    .map(outComesToSelections)
    .map(selectionsToSportWagerRequestObj)
    .value()

  return allSportWagerRequestObjs

  function selectionsToSportWagerRequestObj(selections) {
    return {
      "type": "NORMAL",
      "drawId": drawId,
      "gameName": "SPORT",
      "selections": selections,
      "stake": stake
    }
  }

  function outComesToSelections(oc) {
    return [
      {systemBetType: 'SYSTEM', outcomes: oc}
    ]
  }

  function notEmpty(r) {
    return !_.isEmpty(r)
  }

  function cleanUpRowString(r) {
    return r.replace(/[^1xX2]/g, '').toLowerCase()
  }

  function rowToOutcomes(r) {
    return r.split("").map(charToSelection)
  }

  function charToSelection(c) {
    switch (c) {
      case '1':
        return {
          "home": {
            "selected": true
          }
        }
      case 'x':
        return {
          "tie": {
            "selected": true
          }
        }
      case '2':
        return {
          "away": {
            "selected": true
          }
        }
      default:
        throw new Error('Unknown char')
    }
  }
}
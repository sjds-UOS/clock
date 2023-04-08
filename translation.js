const i18n = require("i18n")
function useTranslation(language) {
  if (!language || ["zh-CN", "en-US"].indexOf(language) === -1) {
    language = "en-US"
  }
  var obj = require(__dirname + "/locales/" + language + ".json")
  return obj
}

module.exports = useTranslation
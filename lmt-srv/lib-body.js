/** @module lib-body
 * prepare the text body of the message
 */
const fs = require('fs')
const path = require('path')
const config = require('config')
const mustache = require('mustache')
const marked=require('marked')
const log = require('pino')(config.get('logging'))

const buttons=require('./lib-buttons')

let status = 200

let template
let template_file_path = path.join(config.get('static.root'), config.get('static.template'))
try {
    template = fs.readFileSync(template_file_path, 'utf-8')
} catch (err) {
    log.error(`route:/  cannot read template file ${template_file_path}`)
    template = "Internal error: unable to load page"
    status = 500
}

let narrative
let narrative_file_path = path.join(config.get('static.root'), config.get('static.narrative'))
try {
    narrative = fs.readFileSync(narrative_file_path, 'utf-8')
    narrative = marked(narrative)
} catch (err) {
    log.error(`route:/  cannot read narrative file ${narrative_file_path}`)
    narrative = "Internal error: unable to load page"
    status = 500
}

module.exports.view_data = {
    app_title: config.get('app_title'),
    app_description: config.get('app_description'),
    version: config.get('version'),
    prefix: config.get('url_prefix'),
    buttons: buttons.html,
    rendered_output: "",
    narrative: narrative,
    template: template,
}

module.exports.body = function (data) {
    return { status: status, body: mustache.render(data.template, data) }
}
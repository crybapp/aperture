import { parse as _parse } from 'url'

import collection from './mongo.config'

export const fetchPortalFromId = portalId => new Promise((resolve, reject) =>
    collection.find({ 'info.id': portalId }, (error, docs) => {
        if(error) return reject(error)
        if(docs.length === 0) return resolve(null)

        resolve(docs[0].info)
    })
)

export const verify_env = (...vars) => {
    vars.forEach(evar => {
        if (!process.env[evar.toUpperCase()])
            throw `No value was found for ${evar} - make sure .env is setup correctly!`
    })
}

export const log = (...msg) => console.log('[CRYB-APERTURE]', ...msg)
export const errlog = (...msg) => console.log('{CRYB-APERTURE}', ...msg)

export const parse = url => {
    if (url.length <= 1) return {}
    const { query } = _parse(url)
    if (!query) return {}

    const stringified = '{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'

    return JSON.parse(stringified)
}

import { parse as _parse } from 'url'

import collection from './mongo.config'

export const fetchPortalFromId = portalId => new Promise((resolve, reject) =>
    collection.find({ 'info.id': portalId }, (error, docs) => {
        if(error) return reject(error)
        if(docs.length === 0) return resolve(null)

        resolve(docs[0].info)
    })
)

export const log = (...msg) => console.log('[CRYB-APERTURE]', ...msg)
export const errlog = (...msg) => console.log('{CRYB-APERTURE}', ...msg)

export const parse = url => {
    if(url.length <= 1) return {}

    const stringified = '{"' + decodeURI(_parse(url).query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'
    let object

    try {
        object = JSON.parse(stringified)
    } catch {
        return {}
    }

    return object
}

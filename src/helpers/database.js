import { db } from "../services/firebase"

export function getValues(ref, callback) {
    return db.ref(ref).on("value", callback)
}


export function setValue(ref, data) {
    return db.ref(ref).push(data)
}

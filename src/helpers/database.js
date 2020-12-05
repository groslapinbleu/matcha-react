import { db } from "../services/firebase"

// we are using Firebase Realtime Database below the hood
export function getValues(ref, callback) {
    // ref is the entry point in the hierarchy
    // callback is executed when the data is retrieved from the database
    return db.ref(ref).on("value", callback)
}


export function setArrayValue(ref, data) {
    // ref is the entry point in the hierarchy
    // data is a json object with the actual data to write
    return db.ref(ref).push(data)
}

export function setValue(ref, data) {
    // ref is the entry point in the hierarchy
    // data is a json object with the actual data to write
    return db.ref(ref).set(data)
}
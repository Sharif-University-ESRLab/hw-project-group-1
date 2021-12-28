export const serverUrl = "http://192.168.1.1:5000";
const token = 'aaaaaa';

export const get_record_status = () => {
    requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`${serverUrl}/get_recording_status?token=${token}`, requestOptions)
}

export const start_recording = () => {
    requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`${serverUrl}/start_recording?token=${token}`, requestOptions)
}


export const stop_recording = () => {
    requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`${serverUrl}/stop_recording?token=${token}`, requestOptions)
}


export const get_pictures = () => {
    requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`${serverUrl}/get_files?token=${token}`, requestOptions)
}


export const get_video = (id: string) => {
    requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`${serverUrl}/show_video/<name>?token=${token}`, requestOptions)
}

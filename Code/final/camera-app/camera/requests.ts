export const serverUrl = "http://192.168.1.37:5000";
const token = "aaaaaa";

export const get_record_status = () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(
    `${serverUrl}/get_recording_status?token=${token}`,
    requestOptions
  );
};

export const start_recording = () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${serverUrl}/start_recording?token=${token}`, requestOptions);
};

export const stop_recording = () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${serverUrl}/stop_recording?token=${token}`, requestOptions);
};

export const get_alarm_status = () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${serverUrl}/get_alarm_status?token=${token}`, requestOptions);
};

export const set_alarm_off = () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${serverUrl}/set_alarm_off?token=${token}`, requestOptions);
};

export const set_alarm_on = () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${serverUrl}/reset_alarm?token=${token}`, requestOptions);
};

export const get_pictures = () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${serverUrl}/get_files?token=${token}`, requestOptions);
};

export const get_video = (id: string) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${serverUrl}/show_video/${id}?token=${token}`, requestOptions);
};

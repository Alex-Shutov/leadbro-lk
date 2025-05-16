export const loadAvatar = (blob) => {
  const blobResult = blob ?? null;
  return !blob
    ? `data:image/png;base64,${blobResult}`
    : `${process.env.REACT_APP_API_URL_2}/${blob}`;
};

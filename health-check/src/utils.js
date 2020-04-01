export const isSafari = () => {
  return (
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  );
};

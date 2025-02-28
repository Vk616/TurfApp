export const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  export const formatTime = (time) => {
    return time.replace(/^(\d{2}):(\d{2})$/, "$1:$2 AM/PM");
  };
  
  export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
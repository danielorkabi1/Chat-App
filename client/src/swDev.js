export function swDev() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./../public/sw.js")
      .then((response) => console.log(response));
  }
}

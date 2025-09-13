export async function enableMocking() {
  // if (import.meta.env.NODE_ENV !== "development") {
  //   return;
  // }

  const { worker } = await import("./mocks/browser.ts");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

module.exports = {
  browsers: ['chromium'],
  launchOptions: {
    headless: true,
  },
  workers: 1,
  exitOnPageError: false, // Prevent tests from failing on page errors

};

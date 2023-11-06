/** Start server for Lunchly. */

const app = require("./app");

app.listen(4000, function() {
  console.log(`Started on http://localhost:4000`);
});

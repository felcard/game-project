const app = require("app");

const { PORT = 7777 } = process.env;

app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});

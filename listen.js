const app = require("app");

const { PORT = 7777 } = process.env;

app.listen(PORT, () => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listen on port ${PORT}`);
  }
});

const app = require('app');

app.listen(7777, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('listen on port 7777');
    };
})
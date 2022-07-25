const prompt = require('prompt');

// start the prompt
prompt.start();

// create an object
const user = {
    name: 'John Doe',
    country: 'USA'
};

// extend `user` object
prompt.addProperties(user, ['email', 'age'], (err) => {
    if (err) {
        throw err;
    }

    // print modified object
    console.dir(user);

});
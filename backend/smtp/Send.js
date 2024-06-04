const sendEmail = require("./sendEmail");

// Call the sendEmail function
sendEmail("mmuuaaaazzahmad@gmail.com")
    .then(code => {
        console.log(code);
    })
    .catch(error => {
        console.error(error);
    });

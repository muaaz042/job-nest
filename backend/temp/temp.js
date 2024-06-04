const fs = require('fs');
const { google }= require('googleapis');
const path = require("path");
const express = require('express');
const multer = require('multer');
const apikeys = require('./apikeys.json');

const app = express();
const SCOPE = ['https://www.googleapis.com/auth/drive'];

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// A Function that can provide access to google drive api
async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient, file){
    return new Promise((resolve,reject)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 

        const fileMetaData = {
            name: file.originalname,
            parents: ['1hXVnRabWaqfNyhFU2H_B2ikEoTuMmkfw'] // A folder ID to which file will get uploaded
        };

        const media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path)
        };

        drive.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        }, function(error, file) {
            if(error) {
                return reject(error);
            }
            // Delete the temporary file uploaded by Multer
            fs.unlinkSync(file.path);
            resolve(file.data.id);
        });
    });
}

// Handle file upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const authClient = await authorize();
        const fileId = await uploadFile(authClient, req.file);
        res.json({ fileId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload file to Google Drive' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

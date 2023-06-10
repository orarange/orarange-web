const mongoose = require('mongoose');
const UserData = require('../../models/userdata');
const Schema = mongoose.Schema;

async function main() {
    
    await mongoose.connect("mongodb://localhost:27017");
    console.log('DB connected');
}

function getUserData(email) {
    main().catch(err => console.log(err));
    return
}

function createUserData(profile) {
    main().catch(err => console.log(err));

    const userData = new UserData({
        email: profile.emails[0].value,
        username: profile.displayName
    });

    return userData.save();
}

function updateUserData(email, username) {
    main().catch(err => console.log(err));

}

function deleteUserData(email) {
    main().catch(err => console.log(err));

}


module.exports = {getUserData, createUserData, updateUserData, deleteUserData};
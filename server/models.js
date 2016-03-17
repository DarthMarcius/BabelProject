"use strict";

module.exports= {
    defineModels(mongoose) {
        let models = {
            User: mongoose.model('User', {
                username: String,
                password: String,
                email: String,
                gender: String,
                address: String
            })
        }

        return models;
    }
}

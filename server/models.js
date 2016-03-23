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
            }),

            Projects: mongoose.model('Projects', {
                name: String,
                creator: String,
                description: String
            })
        }

        return models;
    }
}

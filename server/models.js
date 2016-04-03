"use strict";

module.exports= {
    defineSchemas(Schema) {
        this.userSchema = new Schema({
            username: String,
            password: String,
            email: String,
            gender: String,
            address: String
        });

        this.projectSchema = new Schema({
            name: String,
            updated: { type: Date, default: Date.now },
            creator: {type: Schema.Types.ObjectId, ref: 'User'},
            description: String,
            issues: [{type: Schema.Types.ObjectId, ref: 'Issue'}]
        });

        this.issueSchema = new Schema({
            name: String,
            updated: { type: Date, default: Date.now },
            creator: {type: Schema.Types.ObjectId, ref: 'User'},
            description: String,
            project: {type: Schema.Types.ObjectId, ref: 'Project'},
            comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
            logs:  [{type: Schema.Types.ObjectId, ref: 'Log'}],
            originalEstimateMinutes: Number,
            remainingEstimateMinutes: Number
        });

        this.commentSchema = new Schema({
            creator: {type: Schema.Types.ObjectId, ref: 'User'},
            updated: { type: Date, default: Date.now },
            text: String,
            issue: {type: Schema.Types.ObjectId, ref: 'Issue'}
        });

        this.logSchema = new Schema({
            creator: {type: Schema.Types.ObjectId, ref: 'User'},
            updated: { type: Date, default: Date.now },
            text: String,
            timeSpent: String,
            issue: {type: Schema.Types.ObjectId, ref: 'Issue'}
        });
    },

    defineModels(mongoose) {
        this.defineSchemas(mongoose.Schema);

        let models = {
            User: mongoose.model('User', this.userSchema),

            Project: mongoose.model('Project',this.projectSchema),

            Issue: mongoose.model('Issue', this.issueSchema),

            Comment: mongoose.model('Comment', this.commentSchema),

            Log: mongoose.model('Log', this.logSchema)
        }

        return models;
    }
}

const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    question: {
        type: String
    },
    answer_info: {
        answers: [{
            answer: {
                type: String
            },
            best_answer: {
                type: Boolean,
                required: false
            }
        }]
    }
});

module.exports = mongoose.model('Posts', PostSchema);
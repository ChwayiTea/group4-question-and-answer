const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const Posts = require('../models/Post');

//Router param
router.param('qID', (req, res, next, id) => {
    Posts.findById(id, (err, doc) => {
        if (err) return next(err);
        if (!doc) {
            err = new Error('Document not found');
            err.status = 404;
            return next(err);
        }
        req.question = doc;
        return next();
    });
});

router.param('aID', (req, res, next, id) => {
    req.answer = req.question.answers.id(id);
    if (!req.answer) {
        err = new Error('Answer not found');
        err.status = 404;
        return next(err);
    }
    return next();
});


//Get back all posts
router.get('/', async(req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.json({ message: err })
    }
});


//Sends or submits posts
router.post('/', async(req, res) => {
    const post = new Post({
        question: req.body.question,
        answer: req.body.answer,
        best_answer: req.body.best_answer
    });
    try {
        const savedPost = await post.save()
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err })
    }
});


//specific post
router.get('/:postID', async(req, res) => {
    try {
        const post = await Post.findById(req.params.postID);
        res.json(post);
    } catch (err) {
        res.json({ message: err })
    }
});

//Delete post
router.delete('/:postID', async(req, res) => {
    try {
        const removedPost = await Post.remove({ _id: req.params.postID });
        res.json(removedPost);
    } catch (err) {
        res.json({ message: err })
    }
});

//Update post
router.patch('/:postID', async(req, res) => {
    try {
        const updatedPost = await Post.updateOne({ _id: req.params.postID }, { $set: { answer: req.body.answer } });

        res.json(updatedPost);
    } catch (err) {
        res.json({ message: err })
    }
});

//Vote for preffered answer
router.post(
    '/:qID/answers/:aID/vote-:dec',
    (req, res, next) => {
        if (req.params.dec.search(/^(up|down)$/) === -1) {
            const err = new Error(`Impossible to vote for ${req.params.dec}!`);
            err.status = 404;
            next(err);
        } else {
            req.vote = req.params.dec;
            next();
        }
    },
    (req, res, next) => {
        req.answer.vote(req.vote, (err, question) => {
            if (err) return next(err);
            res.json(question);
        });
    }
);

module.exports = router;
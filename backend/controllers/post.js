const Post = require('../models/post');

exports.createPost = (req, res, next)=>{
    const url = req.protocol +'://'+ req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message: "succcess fully created",
            post : {
                ...createdPost,
                id: createdPost._id
            }
        })
    }).catch(error=>{
        res.status(500).json({
            message: "post creation failed"
        })
    });
};

exports.updatePost = (req, res, next)=>{
    let imagePath = req.body.imagePath;
    const url = req.protocol +'://'+ req.get("host");
    if(req.file){
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(updatedPost=>{
        if(updatedPost.n > 0){
            res.status(201).json({
                message: "succcess fully updated"
            })
        }else{
            res.status(401).json({
                message: "Not authorized"
            })
        }
    }).catch(error=>{
        res.status(500).json({
            message: "could not updated data."
        })
    });
};

exports.getPosts = (req, res, next)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.then((posts)=>{
        fetchedPost = posts
        return Post.countDocuments();
    }).then(count=>{
        res.status(200).json({
            message: "post fetched successfully",
            posts: fetchedPost,
            maxPosts: count
        });
    }).catch(error=>{
        res.status(500).json({
            message: "fathing post falied."
        })
    });
}

exports.getPostById = (req, res, next) => {
    Post.findById({_id: req.params.id}).then(post=>{
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: "post not found",
            });
        }
    }).catch(error=>{
        res.status(500).json({
            message: "fathing post falied."
        })
    });
};

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result=>{
        if(result.n > 0){
            res.status(201).json({
                message: "succcess fully deleted"
            })
        }else{
            res.status(401).json({
                message: "Not authorized"
            })
        }
    }).catch(error=>{
        res.status(500).json({
            message: "not deleted."
        })
    });
}
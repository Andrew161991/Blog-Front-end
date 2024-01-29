import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    }catch(err){
        console.log(err);
        res.status(404).json({
            message: 'Error retrieving posts'
        });
    }
}

export const getLastTags = async (req, res) => {
    try{
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags);
    }catch(err){
        console.log(err);
        res.status(404).json({
            message: 'Error retrieving posts'
        });
    }
};

export const create = async (req, res) => {
    try{
        const  doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,

        });
        const post = await doc.save();
        res.json(post);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Some error occurred while creating the Post.'
        });
    }
};

export const getOne = (req, res) => {
    try{
        const postId = req.params.id;
        const post = PostModel.findOneAndUpdate({_id: postId}, {$inc: {viewsCount: 1}}, {returnDocument: 'after'}).populate('user').then((doc)=>{
            if(!doc) throw Error("No document found!");
            else return res.json(doc);
            }).catch((e)=>res.status(404).json({message:"No such post exists!"}));

//         PostModel.findOneAndUpdate({
//             _id : postId,
//         },
//         {
//             $inc:{viewsCount:1}
//         },
//         {
//             returnDocument: 'after'
//         },
//         (err, doc) => {
//         if(err){
//             console.log(err)
//             return res.status(404).json({message:'Could not find post!'});
//         } 
//         if(!doc){
//             return res.status(404).json({message:"No post with given id!"});
//         }
//         res.json(doc);
//     }
// );
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Error retrieving posts'
        });

    }
};

export const remove = (req, res) => {
    try {
        let postId = req.params.id;
        const deletePost = PostModel.findOneAndDelete({
            _id : postId
            })
            .then((result) =>{
                if (!result) {
                    return res.status(404).json({ message: "No record found forthe provided ID." });
                    } else {
                        res.json({message: "Deleted the record."});
                        }
            })
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Error deleting the post"});
    }
};

export const update = async (req, res) => {
    try {
        let postId = req.params.id;
        const updatedPost = await PostModel.findByIdAndUpdate(
            {_id: postId}, 
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.userId,
                tags: req.body.tags.split(','),
            }, {new:true})
        res.status(201).send(updatedPost);
        } catch (error) {
            console.log("ERROR IN UPDATING POST");
            console.log(error.message);
            res.status(500).json({ message: "Failed to update the post!" + error.message});
            }
};

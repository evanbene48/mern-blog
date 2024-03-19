import { errorHandler } from '../utils/error.js';
import Post from '../models/post.model.js';

export const createPost = async (req, res,next) => {
    
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }

};

export const getPosts = async(req,res,next) =>{
    try {
        console.log(req.query)
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            //  query for userId
          ...(req.query.userId && { userId: req.query.userId }),
            //  query for category
          ...(req.query.category && { category: req.query.category }),
            //  query for slug
          ...(req.query.slug && { slug: req.query.slug }),
            //  query for postId
          ...(req.query.postId && { _id: req.query.postId }),
            //  query for searchTerm
          ...(req.query.searchTerm && {
            $or: [
              { title: { $regex: req.query.searchTerm, $options: 'i' } },
              { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ],
          }),
        })
        // sorting di mongodb
          .sort({ updatedAt: sortDirection })
          // untuk tahu memulai dari index ke berapa
          .skip(startIndex)
          // limit yang dikirim dari database di mongodb
          .limit(limit);
    
        const totalPosts = await Post.countDocuments();
    
        const now = new Date();
    
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
    
        const lastMonthPosts = await Post.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });
    
        res.status(200).json({
          posts,
          totalPosts,
          lastMonthPosts,
        });
      } catch (error) {
        next(error);
      }
}

export const deletePost = async(req,res,next) =>{
  console.log('delete post')
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post has been deleted');
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
}
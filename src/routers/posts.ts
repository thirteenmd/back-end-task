import { Router, RequestHandler } from 'express';
import { Op } from 'sequelize';

import type { SequelizeClient } from '../sequelize';
import type { Post } from '../repositories/types';
import { initTokenValidationRequestHandler, RequestAuth, RequestParams } from '../middleware/security';

import { BadRequestError } from '../errors/bad-request';
import { UserType } from '../constants';

export function initPostsRouter(sequelizeClient: SequelizeClient): Router {
  const router = Router({ mergeParams: true });

  const tokenValidation = initTokenValidationRequestHandler(sequelizeClient);

  router.route('/')
    .get(tokenValidation, initListPostsRequesHandler(sequelizeClient))
    .post(tokenValidation, initCreatePostsRequesHandler(sequelizeClient));
  
  router.route('/:id')
    .post(tokenValidation, initEditPostRequestHandler(sequelizeClient))
    .delete(tokenValidation, initDeletePostRequestHandler(sequelizeClient));

  return router;
}

function initListPostsRequesHandler(sequelizeClient: SequelizeClient): import('express-serve-static-core').RequestHandler<{}, any, any, import('qs').ParsedQs, Record<string, any>> {
  return async function listPostsRequestHandler(req, res, next): Promise<void> {
    const { models } = sequelizeClient;

    try {
      const { auth: { user: { id: userId } } } = req as unknown as { auth: RequestAuth };

      const publicPosts = await models.posts.findAll({where: {isHidden: false}});
      const privateOwnPosts = await models.posts.findAll({where: {isHidden: true, authorId: userId}});

      res.send([...publicPosts, ...privateOwnPosts]);

      return res.end();
    } catch (error) {
      next(error);
    }
  };
}

function initCreatePostsRequesHandler(sequelizeClient: SequelizeClient): RequestHandler {
  return async function reactePostsRequestHandler(req, res, next): Promise<void> {
    const { models } = sequelizeClient;

    try {
      const { title, content } = req.body as  Omit<CreatePostData, 'authorId'>; 
      const { auth: { user: { id: authorId } } } = req as unknown as { auth: RequestAuth };
      if(!title) {
        throw new BadRequestError('TITLE_REQUIRED');
      }

      if(!content) {
        throw new BadRequestError('CONTENT_REQUIRED');
      }
      const similarPost = await models.posts.findOne({
        attributes: ['id', 'title', 'content'],
        where: {
          [Op.or]: [
            { title },
            { content },
          ],
        },
      }) as Pick<Post, 'title' | 'content'> | null;

      if(similarPost){
        if(similarPost.title){
          throw new BadRequestError('TITLE_ALREADY_EXISTS');
        }
        if(similarPost.content){
          throw new BadRequestError('CONTENT_ALREADY_EXISTS');
        }
      }

      await models.posts.create({title, content, authorId, isHidden: false});
      
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}

function initEditPostRequestHandler(sequelizeClient: SequelizeClient): RequestHandler{
  return async function editPostRequestHandler(req, res, next) {
    const { models } = sequelizeClient;

    try {
      const { title, content, isHidden } = req.body as  Omit<CreatePostData, 'authorId'>; 
      const { auth: { user: { id: authorId } } } = req as unknown as { auth: RequestAuth };
      const { params: { id: postId } } = req as unknown as { params: RequestParams };

      if(!title || !content) {
        throw new BadRequestError('TITLE_AND_CONTENT_REQUIRED');
      }

      if(!postId) {
        throw new BadRequestError('POSTID_REQUIRED');
      }

      const postToUpdate = await models.posts.findOne({
        where: {
          [Op.or]: [
            { id: postId },
          ],
        },
      });

      if(!postToUpdate) {
        throw new BadRequestError('POST_NOT_FOUND');
      }

      if(postToUpdate.authorId !== authorId) {
        throw new BadRequestError('UNAUTHORIZED');
      }

      if(title) {
        await postToUpdate.update({title});
      }

      if(content) {
        await postToUpdate.update({content});
      }

      if(isHidden !== postToUpdate.isHidden) {
        await postToUpdate.update({isHidden});
      }

      return res.status(200).send({ postToUpdate }).end();
    } catch (error) {
      next(error);
    }
  };
}

function initDeletePostRequestHandler(sequelizeClient: SequelizeClient): RequestHandler{
  return async function deletePostRequestHandler(req, res, next) {
    const { models } = sequelizeClient;
    try {
      const { auth: { user: { id: userId, type: userType } } } = req as unknown as { auth: RequestAuth };
      const { params: { id: postId } } = req as unknown as { params: RequestParams };

      if(!postId) {
        throw new BadRequestError('POSTID_REQUIRED');
      }

      const isAdmin = userType === UserType.ADMIN;

      const postToDelete = await models.posts.findOne({
        where: {
          [Op.or]: [
            { id: postId },
          ],
        },
      });

      if(!postToDelete) {
        throw new BadRequestError('POST_NOT_FOUND');
      }

      if(postToDelete.authorId !== userId) {
        if(!isAdmin) {
          throw new BadRequestError('UNAUTHORIZED');
        }
        if(postToDelete.isHidden) {
          throw new BadRequestError('UNAUTHORIZED');
        }
        await postToDelete.destroy();
      }

      if(postToDelete.authorId === userId){
        await postToDelete.destroy();
      }

      return res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

type CreatePostData = Pick<Post, 'title' | 'content' | 'authorId' | 'isHidden'>;

import { FastifyRequest, FastifyReply } from 'fastify';
import * as postService from '../services/postService';
import { PostListQuery } from '../schemas';

export const listPosts = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as PostListQuery;
  
  const result = await postService.listPosts(query);
  
  return reply.send({
    data: result.posts,
    meta: result.meta,
  });
};

export const getPostBySlug = async (request: FastifyRequest, reply: FastifyReply) => {
  const { slug } = request.params as { slug: string };
  const { locale = 'en' } = request.query as { locale?: string };
  
  const result = await postService.getPostBySlug(slug, locale);
  
  if (!result) {
    return reply.status(404).send({
      error: {
        code: 'NOT_FOUND',
        message: 'Post not found',
      },
    });
  }

  return reply.send({
    data: result,
  });
};

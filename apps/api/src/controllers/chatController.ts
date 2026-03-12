import type { FastifyRequest, FastifyReply } from 'fastify';
import { chatMessageSchema } from '../schemas/chat.schemas';
import { streamChatResponse } from '../services/chatService';

export const chat = async (request: FastifyRequest, reply: FastifyReply) => {
  const input = chatMessageSchema.parse(request.body);

  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const send = (event: string, data: string) => {
    reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  await streamChatResponse(
    input,
    (text) => send('chunk', text),
    (suggestions) => {
      send('done', '');
      if (suggestions.length > 0) {
        reply.raw.write(`event: suggestions\ndata: ${JSON.stringify(suggestions)}\n\n`);
      }
      reply.raw.end();
    },
    (err) => {
      request.log.error(err, 'Chat stream error');
      send('error', 'An error occurred while processing your request. Please try again.');
      reply.raw.end();
    }
  );

  if (!reply.raw.writableEnded) {
    reply.raw.end();
  }
};

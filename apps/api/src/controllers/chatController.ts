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
    () => {
      send('done', '');
      reply.raw.end();
    },
    (err) => {
      const msg = err.message || '';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        request.log.warn('Chat rate limited by Gemini API');
        send('error', 'AI đang bận, vui lòng thử lại sau vài giây.');
      } else {
        request.log.error(err, 'Chat stream error');
        send('error', 'Something went wrong. Please try again.');
      }
      reply.raw.end();
    }
  );
};

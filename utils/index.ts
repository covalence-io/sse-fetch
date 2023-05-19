import { Response } from 'express';

export function prepStream(res: Response) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream; charset=utf8');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    res.on('close', () => {
        res.end();
    });
}
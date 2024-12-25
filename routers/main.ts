import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express
    .Router()
    .get(`/`, (req, res) => {
        res.sendFile(`${__dirname}/../public/index.html`);
    })
    .get(`/chats`, (req, res) => {
        res.sendFile(`${__dirname}/../public/index.html`);
    })
    .get(`/auth`, (req, res) => {
        res.sendFile(`${__dirname}/../public/auth/index.html`);
    });

export default router;
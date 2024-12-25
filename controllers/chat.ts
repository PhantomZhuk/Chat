import { Chats } from "../models/chats";
import { meinChatMessages } from "../models/messages";
import { User } from "../models/users";

export default {
    mainChatMessages: async (req, res) => {
        try {
            const messages = await meinChatMessages.find();
            res.send(messages);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    createChat: async (req, res) => {
        const { nameChat, userId, chatType } = req.body;
        const file = req.file;

        if (!nameChat) {
            return res.status(400).send('Missing nameChat');
        }

        const filename: string = file ? file.filename : 'none';
        const path: string = file ? file.path : 'none';

        const newChat = new Chats({
            nameChat,
            chatType,
            admin: userId,
            filename,
            path
        });

        newChat.save()
            .then((savedChat) => {
                return Promise.all([
                    User.findByIdAndUpdate(
                        userId,
                        { $push: { chats: savedChat._id } },
                        { new: true }
                    ),
                    Chats.findByIdAndUpdate(
                        savedChat._id,
                        { $push: { users: userId } },
                        { new: true }
                    )
                ]);
            })
            .then(() => {
                res.sendStatus(201);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error creating chat or updating user');
            });
    },
    addChatToUser: async (req, res) => {
        const { userId, chatId } = req.body;
        if (!userId || !chatId) {
            return res.status(400).send('Missing userId or chatId');
        }

        Promise.all([
            User.findByIdAndUpdate(userId, { $push: { chats: chatId } }),
            Chats.findByIdAndUpdate(chatId, { $push: { users: userId } })
        ])
            .then(() => {
                res.sendStatus(201);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error adding chat to user');
            });
    },
    Allchats: async (req, res) => {
        try {
            const chats = await Chats.find();
            res.send(chats);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    deleteChats: async (req, res) => {
        try {
            const { chatId } = req.body;
            if (!chatId) {
                return res.status(400).send('Missing chatId');
            }

            await Chats.findByIdAndDelete(chatId);
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    changeChat: async (req, res) => {
        try {
            const { nameChat, chatId } = req.body;
            if (!nameChat || !chatId) {
                return res.status(400).send('Missing nameChat');
            }

            const chat = await Chats.findByIdAndUpdate(chatId, { nameChat });
            res.status(200).send(chat);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    deleteMessages: async (req, res) => {
        try {
            const { messageId, chatId } = req.body;
            if (!messageId) {
                return res.status(400).send('Missing messageId');
            }

            await Chats.findByIdAndUpdate(chatId, { $pull: { messages: { _id: messageId } } });
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    createUserChat: async (req, res) => {
        const { nameChat, usersId } = req.body;

        if (!nameChat || !usersId) {
            return res.status(400).send('Missing nameChat or usersId');
        }

        const chatName: string = nameChat.join(', ');

        const newChat = new Chats({
            nameChat: chatName,
            filename: 'none',
            path: 'none',
            users: usersId,
            chatType: 'private',
            messages: []
        });

        newChat.save()
            .then((savedChat) => {
                return Promise.all(
                    usersId.map(userId =>
                        User.findByIdAndUpdate(userId, { $push: { chats: savedChat._id } })
                    )
                );
            })
            .then(() => {
                res.sendStatus(201);
            })
            .catch((err) => {
                console.error('Error creating chat or updating users:', err);
                res.status(500).send('Error creating chat or updating users');
            })
    }
}
import { User } from "../models/users";

export default {
    uploadUserIcon: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }

            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).send('No user ID provided');
            }

            User.findByIdAndUpdate(userId, {
                filename: req.file.filename,
                path: req.file.path
            })
                .then(() => {
                    res.json({ message: 'File uploaded and user updated successfully' });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send('Error updating user');
                });

            console.log(req.file);
        } catch (error) { console.log(error) }
    },
    changeName: async (req, res) => {
        try {
            User.findByIdAndUpdate(req.params.id, { login: req.body.login })
                .then(() => {
                    res.json({ message: "User updated successfully" });
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (error) { console.log(error) }
    }
}
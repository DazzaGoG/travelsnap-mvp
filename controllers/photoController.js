const Photo = require('../models/Photo');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

exports.uploadPhoto = async (req, res) => {
    try {
        const file = req.files.image;
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'travelsnap'
        });

        const photo = await Photo.create({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
            user: req.user.id
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { photos: photo._id },
            $inc: { rewards: 5 } // $5 reward per upload
        });

        res.status(201).json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPhotos = async (req, res) => {
    try {
        const photos = await Photo.find().populate('user', 'username');
        res.json(photos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.likePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ error: 'Photo not found' });

        // Check if already liked
        if (photo.likes.includes(req.user.id)) {
            return res.status(400).json({ error: 'Photo already liked' });
        }

        photo.likes.push(req.user.id);
        await photo.save();

        // Add $0.10 reward to photo owner per like
        await User.findByIdAndUpdate(photo.user, {
            $inc: { rewards: 0.1 }
        });

        res.json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

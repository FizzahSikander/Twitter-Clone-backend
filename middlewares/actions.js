import User from '../models/User.js';
import Tweet from '../models/Tweet.js';

// FOLLOW
export const followUser = async (req, res) => {
    const { id } = req.user;
    const { targetId } = req.params;
    console.log(id, 'is following', targetId);

    const user = await User.findById(id);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) return res.status(404).json({ error: 'User not found' });
    if (id === targetId) return res.status(400).json({ error: 'Cannot follow yourself' });

    if (user.following.includes(targetId)) {
        return res.status(400).json({ error: 'Already following this user' });
    }

    await User.findByIdAndUpdate(id, { $addToSet: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: id } });

    res.json({ message: 'Followed user', ok: true });
};

export const unfollowUser = async (req, res) => {
    const { id } = req.user;
    const { targetId } = req.params;
    console.log(id, 'is unfollowing', targetId);

    const user = await User.findById(id);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) return res.status(404).json({ error: 'User not found' });
    if (id === targetId) return res.status(400).json({ error: 'Cannot unfollowing yourself' });

    await User.findByIdAndUpdate(id, { $pull: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { followers: id } });

    res.json({ message: 'unfollowUser user', ok: true });
};

export async function searchHandler(req, res) {
    const q = req.query.q;

    if (!q) return res.status(400).json({ error: 'Missing query' });

    try {
        const isHashtag = q.startsWith('#');
        let results;

        if (isHashtag) {
            const tag = q.replace(/^#/, '');
            results = await Tweet.find({ tags: tag }).populate('createdBy', 'name nickname image').lean();
        } else {
            results = await User.find({
                $or: [{ nickname: { $regex: q, $options: 'i' } }, { name: { $regex: q, $options: 'i' } }],
            })
                .select('-password -__v')
                .lean();
        }


        res.json({ type: isHashtag ? 'hashtag' : 'user', results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getTrendingTags(req, res) {
    try {
        const trending = await Tweet.aggregate([
            { $unwind: '$tags' },
            { $match: { tags: { $ne: '' } } },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        res.json({ trending });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

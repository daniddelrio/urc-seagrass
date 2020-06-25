const Modification = require('../models/modification');

getModificationById = async (req, res) => {
    await Modification.findOne({ _id: req.params.id }, (err, modification) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!modification) {
            return res
                .status(404)
                .json({ success: false, error: `Modification not found` })
        }
        return res.status(200).json({ success: true, data: modification })
    }).catch(err => console.log(err))
}

getModifications = async (req, res) => {
    await Modification.find({}, (err, modification) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!modification.length) {
            return res
                .status(404)
                .json({ success: false, error: `Modifications not found` })
        }
        return res.status(200).json({ success: true, data: modification })
    }).catch(err => console.log(err))
}

// deleteModifications = async (req, res) => {
//     await Modification.deleteMany({}, (err, data) => {
//         if (err) {
//             return res.status(400).json({ success: false, error: err });
//         }

//         if (!data) {
//             return res
//                 .status(404)
//                 .json({ success: false, error: `Modifications not found` });
//         }

//         return res.status(200).json({ success: true, data: data });
//     }).catch((err) => console.log(err));
// };

module.exports = {
    getModificationById,
    getModifications,
    // deleteModifications,
}
const Modification = require('../models/modification');

getModificationsBySite = async (req, res) => {
    await Modification.findOne({ siteCode: req.params.siteCode, year: req.params.year }, (err, modifications) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!modifications) {
            return res
                .status(404)
                .json({ success: false, error: `Modifications not found` })
        }
        return res.status(200).json({ success: true, data: modifications })
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
    getModificationsBySite,
    getModifications,
    // deleteModifications,
}
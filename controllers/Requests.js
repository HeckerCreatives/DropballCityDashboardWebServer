const Requests = require("../models/Requests");

// entity/
exports.browse = (req, res) =>
  Requests.find()
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/to
exports.to = (req, res) =>
  Requests.find()
    .byTo(req.query.key)
    .populate({
      path: "from",
      select: "username",
    })
    .populate({
      path: "to",
      select: "username",
    })
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:userId/find
exports.find = (req, res) =>
  Requests.find()
    .byFrom(req.params.userId)
    .populate({
      path: "from",
      select: "username",
    })
    .populate({
      path: "to",
      select: "username",
    })
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/save
exports.save = (req, res) =>
  Requests.create(req.body)
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/update
exports.update = (req, res) =>
  Requests.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/destroy
exports.destroy = (req, res) =>
  Requests.findByIdAndUpdate(req.params.id, {
    deletedAt: new Date().toLocaleString(),
  })
    .then(() => res.json(req.params.id))
    .catch(error => res.status(400).json({ error: error.message }));

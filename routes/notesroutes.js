const { Router } = require('express');
const notecontroller = require('../controllers/notecontroller');

const noteRouter = Router();

noteRouter.post("/notes/:noteID",notecontroller.post_notes_data);
noteRouter.get("/notes",notecontroller.get_notes);

module.exports = noteRouter;

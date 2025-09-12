const express = require('express');
const { body } = require('express-validator');
const instituteController = require('../controllers/institute');
const router = express.Router();

// Get institute
router.get('/institute/:instCode', instituteController.getInstitute);

// Get all institutes
router.get('/institutes', instituteController.getInstitutes);

// // POST
router.post('/institute', instituteController.getInstitutes);

// // PUT
router.put('/institute/:instCode', instituteController.updateInstitute);

// // DELETE
// router.delete('/institute/:instId', instituteController.deleteInstitute);

// // PAGINATION with search
// router.get(
//   '/search/:pageNo/:numOfLine/:searchText',
//   instituteController.searchInstitutes
// );

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const certificateController = require('../controllers/certificate');
const router = express.Router();

// Get certificate
router.get('/certificate/:certId', certificateController.getCertificate);

// Get all certificates 
router.get('/certificates', certificateController.getCertificates);

// POST
router.post('/certificate', certificateController.addCertificate);

// PUT
router.put('/certificate/:certId', certificateController.updateCertificate);

// DELETE
router.delete('/certificate/:certId', certificateController.deleteCertificate);

// PAGINATION with search
router.get(
  '/search/:pageNo/:numOfLine/:searchText',
  certificateController.searchCertificates
);

module.exports = router;
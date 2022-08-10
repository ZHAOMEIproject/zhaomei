var express = require('express');
var router = express.Router();

const ido = require('../../api/ido/ido');

/**
 * @swagger
 * /v1/ido/getReleaseList:
 *   get:
 *     tags:
 *       - cusenft
 *     description: Return Release List
 *     produces:
 *       - "application/xml"
 *       - "application/json"
 *     parameters:
 *       - name: address
 *         description:
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Return Release List
 *         schema:
 */
router.get('/v1/ido/getReleaseList', ido.getReleaseList);

module.exports = router;

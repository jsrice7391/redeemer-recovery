import { Router, Request, Response } from 'express';
import { facilitatorStore } from '../data/facilitatorStore';
import { CreateFacilitatorDto, UpdateFacilitatorDto } from '../types/facilitator';

const router = Router();

/**
 * @swagger
 * /api/facilitators:
 *   get:
 *     summary: Get all facilitators
 *     tags: [Facilitators]
 *     responses:
 *       200:
 *         description: List of facilitators
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const facilitators = await facilitatorStore.getAll();
    res.json(facilitators);
  } catch (error) {
    console.error('Error fetching facilitators:', error);
    res.status(500).json({ error: 'Failed to fetch facilitators' });
  }
});

/**
 * @swagger
 * /api/facilitators/{id}:
 *   get:
 *     summary: Get facilitator by ID
 *     tags: [Facilitators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facilitator found
 *       404:
 *         description: Facilitator not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid facilitator ID' });
    }
    const facilitator = await facilitatorStore.getById(id);
    if (!facilitator) {
      return res.status(404).json({ error: 'Facilitator not found' });
    }
    res.json(facilitator);
  } catch (error) {
    console.error('Error fetching facilitator:', error);
    res.status(500).json({ error: 'Failed to fetch facilitator' });
  }
});

/**
 * @swagger
 * /api/facilitators:
 *   post:
 *     summary: Create a facilitator
 *     tags: [Facilitators]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               availability:
 *                 type: string
 *     responses:
 *       201:
 *         description: Facilitator created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreateFacilitatorDto = req.body;
    if (!data.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const facilitator = await facilitatorStore.create(data);
    res.status(201).json(facilitator);
  } catch (error) {
    console.error('Error creating facilitator:', error);
    res.status(500).json({ error: 'Failed to create facilitator' });
  }
});

/**
 * @swagger
 * /api/facilitators/{id}:
 *   put:
 *     summary: Update a facilitator
 *     tags: [Facilitators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               availability:
 *                 type: string
 *     responses:
 *       200:
 *         description: Facilitator updated
 *       404:
 *         description: Facilitator not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid facilitator ID' });
    }
    const data: UpdateFacilitatorDto = req.body;
    const updated = await facilitatorStore.update(id, data);
    if (!updated) {
      return res.status(404).json({ error: 'Facilitator not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating facilitator:', error);
    res.status(500).json({ error: 'Failed to update facilitator' });
  }
});

/**
 * @swagger
 * /api/facilitators/{id}:
 *   delete:
 *     summary: Delete a facilitator
 *     tags: [Facilitators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Facilitator deleted
 *       404:
 *         description: Facilitator not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid facilitator ID' });
    }
    const deleted = await facilitatorStore.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Facilitator not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting facilitator:', error);
    res.status(500).json({ error: 'Failed to delete facilitator' });
  }
});

export default router;

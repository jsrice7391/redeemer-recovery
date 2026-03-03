import { Router, Request, Response } from 'express';
import { groupStore } from '../data/groupStore';
import { CreateGroupDto, UpdateGroupDto, GroupSearchParams } from '../types/group';

const router = Router();

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups or search groups
 *     description: Retrieve groups with optional search filters
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search by city, state, zip code, or location name
 *       - in: query
 *         name: focusArea
 *         schema:
 *           type: string
 *         description: Filter by focus area
 *       - in: query
 *         name: meetingDay
 *         schema:
 *           type: string
 *         description: Filter by meeting day
 *     responses:
 *       200:
 *         description: List of groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const searchParams: GroupSearchParams = {
      searchTerm: req.query.searchTerm as string,
      focusArea: req.query.focusArea as string,
      meetingDay: req.query.meetingDay as string,
    };

    // If any search params are provided, use search, otherwise get all
    if (searchParams.searchTerm || searchParams.focusArea || searchParams.meetingDay) {
      const groups = await groupStore.search(searchParams);
      res.json(groups);
    } else {
      const groups = await groupStore.getAll();
      res.json(groups);
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     description: Retrieve a specific group by their unique identifier
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the group
 *     responses:
 *       200:
 *         description: Group found successfully
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const group = await groupStore.getById(id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     description: Create a new recovery group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupDto'
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const groupData: CreateGroupDto = req.body;

    // Basic validation
    const requiredFields = ['name', 'location', 'city', 'state', 'zipCode', 'meetingDay', 'meetingTime', 'focusArea', 'description', 'facilitatorName', 'address'];
    const missingFields = requiredFields.filter(field => !groupData[field as keyof CreateGroupDto]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const newGroup = await groupStore.create(groupData);
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update a group
 *     description: Update an existing group's information
 *     tags: [Groups]
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
 *             $ref: '#/components/schemas/UpdateGroupDto'
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const groupData: UpdateGroupDto = req.body;
    const updatedGroup = await groupStore.update(id, groupData);

    if (!updatedGroup) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(updatedGroup);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a group
 *     description: Permanently delete a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const deleted = await groupStore.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

export default router;

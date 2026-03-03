import { Router, Request, Response } from 'express';
import { userStore } from '../data/userStore';
import { userGroupStore } from '../data/userGroupStore';
import { userStepStore } from '../data/userStepStore';
import { CreateUserDto, UpdateUserDto } from '../types/user';
import { UpsertUserStepDto } from '../types/userStep';

const router = Router();

// Helper to compute next occurrence of a meeting day
function nextOccurrence(dayName: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = days.indexOf(dayName);
  if (targetDay === -1) return '';
  let daysUntil = targetDay - todayDay;
  if (daysUntil <= 0) daysUntil += 7;
  const next = new Date(today);
  next.setDate(today.getDate() + daysUntil);
  return next.toISOString().split('T')[0];
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userStore.getAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their unique identifier
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user to retrieve
 *         example: 1
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await userStore.getById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * @swagger
 * /api/users/{id}/groups:
 *   get:
 *     summary: Get groups for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's groups
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
router.get('/:id/groups', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
    const groups = await userGroupStore.getUserGroups(id);
    res.json(groups);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
});

/**
 * @swagger
 * /api/users/{id}/groups/{groupId}:
 *   post:
 *     summary: Join a group
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Joined group
 *       400:
 *         description: Invalid IDs
 *       500:
 *         description: Server error
 */
router.post('/:id/groups/:groupId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const groupId = parseInt(req.params.groupId);
    if (isNaN(userId) || isNaN(groupId)) {
      return res.status(400).json({ error: 'Invalid user or group ID' });
    }
    const isPrimary = req.body.isPrimary === true;
    const result = await userGroupStore.joinGroup(userId, groupId, isPrimary);
    res.json(result);
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

/**
 * @swagger
 * /api/users/{id}/groups/{groupId}:
 *   delete:
 *     summary: Leave a group
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Left group
 *       400:
 *         description: Invalid IDs
 *       404:
 *         description: User not in group
 *       500:
 *         description: Server error
 */
router.delete('/:id/groups/:groupId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const groupId = parseInt(req.params.groupId);
    if (isNaN(userId) || isNaN(groupId)) {
      return res.status(400).json({ error: 'Invalid user or group ID' });
    }
    const deleted = await userGroupStore.leaveGroup(userId, groupId);
    if (!deleted) return res.status(404).json({ error: 'User not in that group' });
    res.status(204).send();
  } catch (error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

/**
 * @swagger
 * /api/users/{id}/step:
 *   get:
 *     summary: Get current recovery step for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User step or null
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
router.get('/:id/step', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
    const step = await userStepStore.getUserStep(id);
    res.json(step);
  } catch (error) {
    console.error('Error fetching user step:', error);
    res.status(500).json({ error: 'Failed to fetch user step' });
  }
});

/**
 * @swagger
 * /api/users/{id}/step:
 *   put:
 *     summary: Set or update recovery step for a user
 *     tags: [Users]
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
 *             required: [stepNumber]
 *             properties:
 *               stepNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step updated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id/step', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
    const { stepNumber, note }: UpsertUserStepDto = req.body;
    if (!stepNumber || typeof stepNumber !== 'number') {
      return res.status(400).json({ error: 'stepNumber is required and must be a number' });
    }
    const step = await userStepStore.upsertUserStep(id, { stepNumber, note });
    res.json(step);
  } catch (error) {
    console.error('Error updating user step:', error);
    res.status(500).json({ error: 'Failed to update user step' });
  }
});

/**
 * @swagger
 * /api/users/{id}/schedule:
 *   get:
 *     summary: Get upcoming meeting schedule for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule items with next meeting dates
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
router.get('/:id/schedule', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
    const userGroups = await userGroupStore.getUserGroups(id);
    const schedule = userGroups.map((ug) => ({
      groupId: ug.groupId,
      groupName: ug.group.name,
      location: ug.group.location,
      meetingDay: ug.group.meetingDay,
      meetingTime: ug.group.meetingTime,
      nextDate: nextOccurrence(ug.group.meetingDay),
    }));
    schedule.sort((a, b) => a.nextDate.localeCompare(b.nextDate));
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

/**
 * @swagger
 * /api/users/{id}/contact:
 *   get:
 *     summary: Get main contact (facilitator) for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facilitator or null
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
router.get('/:id/contact', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
    const contact = await userGroupStore.getUserContact(id);
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user or return existing
 *     description: Create a new user with a unique email address. If a user with the email already exists, returns the existing user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       200:
 *         description: Existing user found and returned
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email }: CreateUserDto = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingUser = await userStore.getByEmail(email);
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = await userStore.create(name, email);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { name, email }: UpdateUserDto = req.body;

    if (email && !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (email) {
      const existingUser = await userStore.getByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    const updatedUser = await userStore.update(id, name, email);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const deleted = await userStore.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('Starting seed...');

  // Create groups
  const groups = [
    {
      name: 'New Hope Recovery Group',
      location: 'Grace Community Church',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      meetingDay: 'Tuesday',
      meetingTime: '7:00 PM',
      focusArea: 'Substance Abuse',
      description: 'A welcoming community focused on breaking free from substance addiction through Christ-centered principles.',
      facilitator: 'Pastor John Smith',
      address: '123 Main St, Austin, TX 78701',
    },
    {
      name: 'Freedom in Christ',
      location: 'Redeemer Church',
      city: 'Austin',
      state: 'TX',
      zipCode: '78702',
      meetingDay: 'Thursday',
      meetingTime: '6:30 PM',
      focusArea: 'Alcohol Addiction',
      description: 'Finding freedom from alcohol dependency through faith, fellowship, and biblical guidance.',
      facilitator: 'Sarah Johnson',
      address: '456 Oak Ave, Austin, TX 78702',
    },
    {
      name: 'Renewed Life Fellowship',
      location: 'First Baptist Church',
      city: 'Round Rock',
      state: 'TX',
      zipCode: '78664',
      meetingDay: 'Monday',
      meetingTime: '7:30 PM',
      focusArea: 'General Addiction',
      description: 'A safe space for anyone struggling with addiction to find healing and hope in Christ.',
      facilitator: 'Michael Brown',
      address: '789 Church Rd, Round Rock, TX 78664',
    },
    {
      name: 'Victory Over Addiction',
      location: 'Cornerstone Church',
      city: 'Cedar Park',
      state: 'TX',
      zipCode: '78613',
      meetingDay: 'Wednesday',
      meetingTime: '7:00 PM',
      focusArea: 'Drug Addiction',
      description: 'Experience God\'s power to overcome drug addiction through community support and prayer.',
      facilitator: 'Lisa Martinez',
      address: '321 Victory Ln, Cedar Park, TX 78613',
    },
    {
      name: 'Journey to Recovery',
      location: 'Lakeway Community Center',
      city: 'Lakeway',
      state: 'TX',
      zipCode: '78734',
      meetingDay: 'Friday',
      meetingTime: '6:00 PM',
      focusArea: 'Substance Abuse',
      description: 'Begin your journey to lasting recovery with supportive believers walking the same path.',
      facilitator: 'David Wilson',
      address: '555 Lake Dr, Lakeway, TX 78734',
    },
  ];

  for (const group of groups) {
    await prisma.group.create({
      data: group,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

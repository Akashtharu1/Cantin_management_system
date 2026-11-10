import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BMSIT Canteen Database...');

  // 1. Seed Roles & Personas
  const student = await prisma.user.upsert({
    where: { email: '1by23is017@bmsit.in' },
    update: {},
    create: {
      fullName: 'Aarav Sharma',
      email: '1by23is017@bmsit.in',
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      phoneNumber: '+91 98450 12345',
    },
  });

  const faculty = await prisma.user.upsert({
    where: { email: 'priyarao@bmsit.in' },
    update: {},
    create: {
      fullName: 'Dr. Priya Rao',
      email: 'priyarao@bmsit.in',
      role: 'FACULTY',
      department: 'Electronics & Communication',
      phoneNumber: '+91 94480 67890',
    },
  });

  const kitchen = await prisma.user.upsert({
    where: { email: 'chef.rajesh@bmsit.in' },
    update: {},
    create: {
      fullName: 'Chef Rajesh Kumar',
      email: 'chef.rajesh@bmsit.in',
      role: 'KITCHEN',
      department: 'BMSIT Canteen Operations',
      phoneNumber: '+91 97310 55443',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'canteen.manager@bmsit.in' },
    update: {},
    create: {
      fullName: 'Suresh Hegde',
      email: 'canteen.manager@bmsit.in',
      role: 'ADMIN',
      department: 'Campus Facilities & Services',
      phoneNumber: '+91 99000 88776',
    },
  });

  // 2. Seed 15-min Pickup Slots
  const slots = [
    { startTime: '11:45 AM', endTime: '12:00 PM', displayLabel: '11:45 AM – 12:00 PM', capacity: 30, reservedCount: 14 },
    { startTime: '12:00 PM', endTime: '12:15 PM', displayLabel: '12:00 PM – 12:15 PM', capacity: 35, reservedCount: 28 },
    { startTime: '12:15 PM', endTime: '12:30 PM', displayLabel: '12:15 PM – 12:30 PM', capacity: 35, reservedCount: 19 },
    { startTime: '12:30 PM', endTime: '12:45 PM', displayLabel: '12:30 PM – 12:45 PM', capacity: 35, reservedCount: 22 },
    { startTime: '12:45 PM', endTime: '01:00 PM', displayLabel: '12:45 PM – 01:00 PM', capacity: 30, reservedCount: 16 },
    { startTime: '01:00 PM', endTime: '01:15 PM', displayLabel: '01:00 PM – 01:15 PM', capacity: 25, reservedCount: 9 },
  ];

  for (const slot of slots) {
    await prisma.pickupSlot.create({
      data: {
        startTime: slot.startTime,
        endTime: slot.endTime,
        displayLabel: slot.displayLabel,
        capacity: slot.capacity,
        reservedCount: slot.reservedCount,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

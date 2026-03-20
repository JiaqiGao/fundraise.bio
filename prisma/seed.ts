const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const charities = [
    {
      name: 'Against Malaria Foundation',
      description: 'Provides long-lasting insecticidal nets to prevent malaria.',
      giveWellRating: 'Top Charity',
      charityWatchRating: 'A+',
      donationUrl: 'https://www.againstmalaria.com/Donate.aspx',
    },
    {
      name: 'Helen Keller International',
      description: 'Provides vitamin A supplementation to prevent blindness and mortality.',
      giveWellRating: 'Top Charity',
      charityWatchRating: 'A',
      donationUrl: 'https://www.hki.org/donate/',
    },
    {
      name: 'New Incentives',
      description: 'Provides cash transfers to encourage childhood vaccinations.',
      giveWellRating: 'Top Charity',
      charityWatchRating: 'N/A',
      donationUrl: 'https://www.newincentives.org/donate',
    },
    {
      name: 'Evidence Action',
      description: 'Scales evidence-based programs like Deworm the World.',
      giveWellRating: 'Top Charity',
      charityWatchRating: 'A',
      donationUrl: 'https://www.evidenceaction.org/donate/',
    },
    {
      name: 'GiveDirectly',
      description: 'Sends unconditional cash transfers to people living in extreme poverty.',
      giveWellRating: 'Standout Charity',
      charityWatchRating: 'A-',
      donationUrl: 'https://www.givedirectly.org/donate/',
    },
  ]

  for (const charity of charities) {
    await prisma.charity.upsert({
      where: { id: '' }, // This won't match anything, so it will always create
      update: {},
      create: charity,
    }).catch(async (e: any) => {
      // If no unique constraint on name, just create
      await prisma.charity.create({ data: charity })
    })
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e: any) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
    await prisma.$disconnect()
  })

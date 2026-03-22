const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
// Cast to any to avoid the version mismatch in types on Vercel
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
    {
      name: 'Doctors Without Borders',
      description: 'Provides medical care where it is needed most — in over 70 countries.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://donate.doctorswithoutborders.org/',
    },
    {
      name: 'Direct Relief',
      description: 'Improves the health and lives of people affected by poverty or emergencies.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A+',
      donationUrl: 'https://www.directrelief.org/donate/',
    },
    {
      name: 'International Rescue Committee',
      description: 'Responds to the world\'s worst humanitarian crises.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://help.rescue.org/donate',
    },
    {
      name: 'Partners In Health',
      description: 'Brings modern medical science to those most in need.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://secure.pih.org/page/contribute/donate',
    },
    {
      name: 'Feeding America',
      description: 'The nation\'s largest domestic hunger-relief organization.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://www.feedingamerica.org/',
    },
    {
      name: 'Habitat for Humanity',
      description: 'Helps people in your community and around the world build or improve a place they can call home.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://www.habitat.org/',
    },
    {
      name: 'The Nature Conservancy',
      description: 'Conserving the lands and waters on which all life depends.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://preserve.nature.org/page/80429/donate/1',
    },
    {
      name: 'ACLU',
      description: 'Defends the individual rights and liberties guaranteed by the Constitution.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://action.aclu.org/give/now',
    },
    {
      name: 'Room to Read',
      description: 'Focuses on literacy and gender equality in education.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://www.roomtoread.org/donate/',
    },
    {
      name: 'The Hunger Project',
      description: 'Empowers people to end their own hunger and poverty on a sustainable basis.',
      giveWellRating: 'N/A',
      charityWatchRating: 'A',
      donationUrl: 'https://thp.org/invest-now/',
    }
  ]

  for (const charity of charities) {
    // Using name as a simple unique identifier for seeding
    const existing = await prisma.charity.findFirst({
      where: { name: charity.name }
    })

    if (existing) {
      await prisma.charity.update({
        where: { id: existing.id },
        data: charity
      })
    } else {
      await prisma.charity.create({
        data: charity
      })
    }
  }

  console.log('Seed completed successfully with more charities.')
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

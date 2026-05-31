import 'dotenv/config'
import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'setect2026'

  const hash = await bcrypt.hash(password, 12)

  const existing = await prisma.admin.findUnique({ where: { username } })
  if (existing) {
    await prisma.admin.update({
      where: { username },
      data: { password: hash },
    })
    console.log(`Admin "${username}" already exists. Password has been updated.`)
    await prisma.$disconnect()
    return
  }

  await prisma.admin.create({ data: { username, password: hash } })
  console.log(`Admin "${username}" created.`)
  await prisma.$disconnect()
}

seed().catch(e => {
  console.error(e)
  process.exit(1)
})
